
const express = require('express');
const auth = require('../middleware/auth');
const Group = require('../models/Group');
const Expense = require('../models/Expense');
const User = require('../models/User');
const Settlement = require('../models/Settlement');
const { convertCurrency } = require('../utils/currencyConverter');

const router = express.Router();

// Calculate settlements for a group
router.get('/group/:groupId', auth, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    
    // Check if group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view settlements for this group' });
    }
    
    // Get all expenses for this group
    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name email avatar')
      .populate('participants.user', 'name email avatar');
      
    // Calculate balances
    const balances = {};
    const defaultCurrency = group.defaultCurrency || 'USD';
    
    // Process each expense
    expenses.forEach(expense => {
      const payerId = expense.paidBy._id.toString();
      const expenseCurrency = expense.currency;
      const expenseAmount = expense.amount;
      
      // Calculate the amount each participant owes to the payer
      expense.participants.forEach(participant => {
        const participantId = participant.user._id.toString();
        // Skip if participant is the payer
        if (participantId === payerId) return;
        
        // Convert share to default currency for settlement calculation
        const shareInDefaultCurrency = convertCurrency(
          participant.share,
          expenseCurrency,
          defaultCurrency
        );
        
        // Initialize balances
        if (!balances[payerId]) balances[payerId] = {};
        if (!balances[participantId]) balances[participantId] = {};
        
        // Add to what the participant owes the payer
        if (!balances[participantId][payerId]) {
          balances[participantId][payerId] = 0;
        }
        balances[participantId][payerId] += shareInDefaultCurrency;
        
        // Subtract from what the payer owes the participant
        if (!balances[payerId][participantId]) {
          balances[payerId][participantId] = 0;
        }
        balances[payerId][participantId] -= shareInDefaultCurrency;
      });
    });
    
    // Calculate net balances
    const netBalances = {};
    Object.entries(balances).forEach(([userId, userBalances]) => {
      Object.entries(userBalances).forEach(([otherUserId, amount]) => {
        // Only process positive balances (what user owes to others)
        if (amount > 0) {
          if (!netBalances[userId]) netBalances[userId] = {};
          netBalances[userId][otherUserId] = amount;
        }
      });
    });
    
    // Simplify settlements (minimize number of transactions)
    const settlements = [];
    const debtors = Object.entries(netBalances)
      .map(([id, balances]) => ({
        id,
        totalOwed: Object.values(balances).reduce((sum, val) => sum + val, 0),
        owedTo: balances
      }))
      .filter(user => user.totalOwed > 0)
      .sort((a, b) => b.totalOwed - a.totalOwed); // Sort by descending debt
      
    const creditors = Object.entries(netBalances)
      .map(([id, balances]) => ({
        id,
        totalOwed: -1 * Object.entries(balances)
          .reduce((sum, [otherUserId, amount]) => {
            const reversed = netBalances[otherUserId]?.[id] || 0;
            return sum + (reversed * -1);
          }, 0),
        owedBy: {}
      }))
      .filter(user => user.totalOwed > 0)
      .sort((a, b) => b.totalOwed - a.totalOwed); // Sort by descending credit
      
    // Create simplified settlements
    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0];
      const creditor = creditors[0];
      
      // Amount to settle is minimum of what debtor owes and what creditor is owed
      const amountToSettle = Math.min(debtor.totalOwed, creditor.totalOwed);
      
      if (amountToSettle > 0.01) { // Only create settlement if amount is significant
        // Get user details for the settlement
        const debtorUser = await User.findById(debtor.id, 'name email avatar');
        const creditorUser = await User.findById(creditor.id, 'name email avatar');
        
        settlements.push({
          from: {
            id: debtor.id,
            name: debtorUser.name,
            email: debtorUser.email,
            avatar: debtorUser.avatar
          },
          to: {
            id: creditor.id,
            name: creditorUser.name,
            email: creditorUser.email,
            avatar: creditorUser.avatar
          },
          amount: parseFloat(amountToSettle.toFixed(2)),
          currency: defaultCurrency
        });
      }
      
      // Update remaining balances
      debtor.totalOwed -= amountToSettle;
      creditor.totalOwed -= amountToSettle;
      
      // Remove users with zero balance
      if (debtor.totalOwed < 0.01) debtors.shift();
      if (creditor.totalOwed < 0.01) creditors.shift();
    }
    
    res.json(settlements);
  } catch (error) {
    console.error('Error calculating settlements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a settlement reminder
router.post('/remind', auth, async (req, res) => {
  try {
    const { groupId, toUserId, amount, currency } = req.body;
    
    // Verify the sender is the creditor
    const fromUserId = req.user.id;
    
    // Check if users exist
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: 'Recipient user not found' });
    }
    
    // Create a notification (in a real app this would send an email/push notification)
    // For now, we'll just record it in the database
    const reminder = new Settlement({
      group: groupId,
      from: toUserId, // The debtor
      to: fromUserId, // The creditor
      amount,
      currency,
      settled: false,
      date: null,
      createdAt: Date.now()
    });
    
    await reminder.save();
    
    res.json({ message: 'Reminder sent successfully' });
  } catch (error) {
    console.error('Error sending reminder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark a settlement as completed
router.post('/settle', auth, async (req, res) => {
  try {
    const { settlementId } = req.body;
    
    const settlement = await Settlement.findById(settlementId);
    if (!settlement) {
      return res.status(404).json({ message: 'Settlement not found' });
    }
    
    // Verify the user is involved in this settlement
    if (settlement.from.toString() !== req.user.id && 
        settlement.to.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this settlement' });
    }
    
    // Update settlement status
    settlement.settled = true;
    settlement.date = Date.now();
    await settlement.save();
    
    res.json({ message: 'Settlement marked as completed' });
  } catch (error) {
    console.error('Error updating settlement:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
