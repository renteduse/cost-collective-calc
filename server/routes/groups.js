
const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Group = require('../models/Group');
const User = require('../models/User');
const Expense = require('../models/Expense');

const router = express.Router();

// Create a new group
router.post(
  '/',
  [
    auth,
    body('name').not().isEmpty().withMessage('Group name is required'),
    body('defaultCurrency').not().isEmpty().withMessage('Default currency is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, defaultCurrency } = req.body;
      
      // Generate a unique invite code
      let inviteCode = Group.generateInviteCode();
      let codeExists = true;
      
      // Ensure invite code is unique
      while (codeExists) {
        const existingGroup = await Group.findOne({ inviteCode });
        if (!existingGroup) {
          codeExists = false;
        } else {
          inviteCode = Group.generateInviteCode();
        }
      }
      
      const newGroup = new Group({
        name,
        description,
        inviteCode,
        defaultCurrency,
        createdBy: req.user.id,
        members: [{ user: req.user.id, role: 'admin' }],
      });

      const group = await newGroup.save();
      
      // Add group to user's groups
      await User.findByIdAndUpdate(req.user.id, {
        $push: { groups: group._id }
      });

      // Populate creator details
      await group.populate('members.user', 'name email avatar');
      
      res.json(group);
    } catch (error) {
      console.error('Error creating group:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all groups for a user
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ 'members.user': req.user.id })
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort({ updatedAt: -1 });
    
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single group by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is a member of the group
    const isMember = group.members.some(member => 
      member.user._id.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this group' });
    }
    
    res.json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join a group with invite code
router.post('/join', [auth, body('inviteCode').not().isEmpty()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { inviteCode } = req.body;
    
    // Find the group by invite code
    const group = await Group.findOne({ inviteCode });
    
    if (!group) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }
    
    // Check if user is already a member
    const alreadyMember = group.members.some(member => 
      member.user.toString() === req.user.id
    );
    
    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }
    
    // Add user to group
    group.members.push({ user: req.user.id });
    group.updatedAt = Date.now();
    await group.save();
    
    // Add group to user's groups
    await User.findByIdAndUpdate(req.user.id, {
      $push: { groups: group._id }
    });
    
    // Populate member details
    await group.populate('members.user', 'name email avatar');
    await group.populate('createdBy', 'name email');
    
    res.json(group);
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a group
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, defaultCurrency } = req.body;
    
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is an admin
    const isAdmin = group.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    if (!isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this group' });
    }
    
    // Update fields
    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    if (defaultCurrency) group.defaultCurrency = defaultCurrency;
    group.updatedAt = Date.now();
    
    await group.save();
    
    // Populate member details
    await group.populate('members.user', 'name email avatar');
    await group.populate('createdBy', 'name email');
    
    res.json(group);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a member from a group
router.delete('/:groupId/members/:userId', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if the requester is an admin or the user themself
    const isAdmin = group.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    const isSelf = req.user.id === req.params.userId;
    
    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: 'Not authorized to remove members' });
    }
    
    // Check if the person being removed is the only admin
    const isRemovingOnlyAdmin = 
      req.params.userId === group.createdBy.toString() && 
      group.members.filter(member => member.role === 'admin').length === 1;
    
    if (isRemovingOnlyAdmin) {
      return res.status(400).json({ message: 'Cannot remove the only admin of the group' });
    }
    
    // Remove member from group
    group.members = group.members.filter(
      member => member.user.toString() !== req.params.userId
    );
    
    group.updatedAt = Date.now();
    await group.save();
    
    // Remove group from user's groups
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { groups: group._id }
    });
    
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get group balances
router.get('/:id/balances', auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    
    // Verify group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this group' });
    }
    
    // Get all expenses for this group
    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name')
      .populate('participants.user', 'name');
    
    // Calculate balances
    const balances = {};
    const members = group.members.map(m => m.user.toString());
    
    // Initialize balances for all members
    members.forEach(memberId => {
      balances[memberId] = { paid: 0, owes: 0, netBalance: 0 };
    });
    
    // Process each expense
    expenses.forEach(expense => {
      const paidById = expense.paidBy._id.toString();
      
      // Add to the payer's "paid" amount
      if (balances[paidById]) {
        balances[paidById].paid += expense.amount;
      }
      
      // Process each participant's share
      expense.participants.forEach(participant => {
        const participantId = participant.user._id.toString();
        const share = participant.share;
        
        // Add to participant's "owes" amount
        if (balances[participantId] && participantId !== paidById) {
          balances[participantId].owes += share;
        }
      });
    });
    
    // Calculate net balance for each member
    Object.keys(balances).forEach(userId => {
      balances[userId].netBalance = balances[userId].paid - balances[userId].owes;
    });
    
    // Get member details for the response
    const membersDetails = await User.find(
      { _id: { $in: members } },
      'name email avatar'
    );
    
    // Combine balance data with member details
    const result = membersDetails.map(member => ({
      user: {
        id: member._id,
        name: member.name,
        email: member.email,
        avatar: member.avatar,
      },
      paid: balances[member._id.toString()].paid,
      owes: balances[member._id.toString()].owes,
      netBalance: balances[member._id.toString()].netBalance,
    }));
    
    res.json(result);
  } catch (error) {
    console.error('Error calculating balances:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get settlement plan for a group
router.get('/:id/settlements', auth, async (req, res) => {
  try {
    const groupId = req.params.id;
    
    // Verify group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this group' });
    }
    
    // Get all expenses for this group
    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name')
      .populate('participants.user', 'name');
    
    // Calculate balances
    const balances = {};
    const members = group.members.map(m => m.user.toString());
    
    // Initialize balances for all members
    members.forEach(memberId => {
      balances[memberId] = { paid: 0, owes: 0, netBalance: 0 };
    });
    
    // Process each expense
    expenses.forEach(expense => {
      const paidById = expense.paidBy._id.toString();
      
      // Add to the payer's "paid" amount
      if (balances[paidById]) {
        balances[paidById].paid += expense.amount;
      }
      
      // Process each participant's share
      expense.participants.forEach(participant => {
        const participantId = participant.user._id.toString();
        const share = participant.share;
        
        // Add to participant's "owes" amount
        if (balances[participantId] && participantId !== paidById) {
          balances[participantId].owes += share;
        }
      });
    });
    
    // Calculate net balance for each member
    Object.keys(balances).forEach(userId => {
      balances[userId].netBalance = balances[userId].paid - balances[userId].owes;
    });
    
    // Create settlement plan using the simplification algorithm
    const debtors = [];
    const creditors = [];
    
    // Separate members into debtors and creditors
    Object.keys(balances).forEach(userId => {
      const balance = balances[userId].netBalance;
      
      if (balance < 0) {
        debtors.push({ id: userId, amount: Math.abs(balance) });
      } else if (balance > 0) {
        creditors.push({ id: userId, amount: balance });
      }
    });
    
    // Sort by amount (descending)
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);
    
    const settlements = [];
    
    // Generate settlement transactions
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      
      const amount = Math.min(debtor.amount, creditor.amount);
      if (amount > 0) {
        settlements.push({
          from: debtor.id,
          to: creditor.id,
          amount: parseFloat(amount.toFixed(2)),
        });
      }
      
      debtor.amount -= amount;
      creditor.amount -= amount;
      
      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }
    
    // Get member details for the response
    const membersDetails = await User.find(
      { _id: { $in: members } },
      'name email avatar'
    );
    
    // Create a map for quick lookup
    const memberMap = {};
    membersDetails.forEach(member => {
      memberMap[member._id.toString()] = {
        id: member._id,
        name: member.name,
        email: member.email,
        avatar: member.avatar,
      };
    });
    
    // Enhance settlements with member details
    const detailedSettlements = settlements.map(settlement => ({
      from: memberMap[settlement.from],
      to: memberMap[settlement.to],
      amount: settlement.amount,
      currency: group.defaultCurrency,
    }));
    
    res.json(detailedSettlements);
  } catch (error) {
    console.error('Error calculating settlements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
