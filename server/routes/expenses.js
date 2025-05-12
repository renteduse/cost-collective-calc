
const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken'); // Add JWT import
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const Group = require('../models/Group');
const User = require('../models/User');
const { convertCurrency } = require('../utils/currencyConverter');

const router = express.Router();

// Add a new expense
router.post(
  '/',
  [
    auth,
    body('group').not().isEmpty().withMessage('Group ID is required'),
    body('description').not().isEmpty().withMessage('Description is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('currency').not().isEmpty().withMessage('Currency is required'),
    body('paidBy').not().isEmpty().withMessage('Payer ID is required'),
    body('participants').isArray().withMessage('Participants must be an array'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        group,
        description,
        amount,
        currency,
        date,
        paidBy,
        splitType,
        participants,
        notes,
        attachments,
      } = req.body;
      
      // Verify group exists and user is a member
      const groupDoc = await Group.findById(group);
      if (!groupDoc) {
        return res.status(404).json({ message: 'Group not found' });
      }
      
      const isMember = groupDoc.members.some(
        member => member.user.toString() === req.user.id
      );
      
      if (!isMember) {
        return res.status(403).json({ message: 'Not authorized to add expenses to this group' });
      }
      
      // Create new expense
      const newExpense = new Expense({
        group,
        description,
        amount,
        currency,
        date: date || Date.now(),
        paidBy,
        splitType: splitType || 'equal',
        participants,
        notes: notes || '',
        attachments: attachments || [],
        createdBy: req.user.id,
      });
      
      const expense = await newExpense.save();
      
      // Populate referenced fields
      await expense.populate('paidBy', 'name email avatar');
      await expense.populate('participants.user', 'name email avatar');
      await expense.populate('createdBy', 'name email avatar');
      
      res.json(expense);
    } catch (error) {
      console.error('Error adding expense:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all expenses for a group
router.get('/group/:groupId', auth, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    
    // Verify group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view expenses for this group' });
    }
    
    // Get expenses sorted by date (newest first)
    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name email avatar')
      .populate('participants.user', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ date: -1 });
    
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single expense by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('paidBy', 'name email avatar')
      .populate('participants.user', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('group', 'name');
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    // Verify group exists and user is a member
    const group = await Group.findById(expense.group._id);
    
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this expense' });
    }
    
    res.json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an expense
router.put('/:id', auth, async (req, res) => {
  try {
    const expenseId = req.params.id;
    const {
      description,
      amount,
      currency,
      date,
      paidBy,
      splitType,
      participants,
      notes,
      attachments,
    } = req.body;
    
    // Find the expense
    let expense = await Expense.findById(expenseId);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    // Verify group exists and user is a member
    const group = await Group.findById(expense.group);
    
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }
    
    // Check if user is the creator or an admin
    const isCreator = expense.createdBy.toString() === req.user.id;
    const isAdmin = group.members.some(
      member => member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }
    
    // Update fields
    const updateFields = {};
    if (description) updateFields.description = description;
    if (amount !== undefined) updateFields.amount = amount;
    if (currency) updateFields.currency = currency;
    if (date) updateFields.date = date;
    if (paidBy) updateFields.paidBy = paidBy;
    if (splitType) updateFields.splitType = splitType;
    if (participants) updateFields.participants = participants;
    if (notes !== undefined) updateFields.notes = notes;
    if (attachments) updateFields.attachments = attachments;
    
    updateFields.updatedAt = Date.now();
    
    // Update expense
    expense = await Expense.findByIdAndUpdate(
      expenseId,
      { $set: updateFields },
      { new: true }
    )
      .populate('paidBy', 'name email avatar')
      .populate('participants.user', 'name email avatar')
      .populate('createdBy', 'name email avatar');
    
    res.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expenseId = req.params.id;
    
    // Find the expense
    const expense = await Expense.findById(expenseId);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    // Verify group exists and user is a member
    const group = await Group.findById(expense.group);
    
    // Check if user is the creator or an admin
    const isCreator = expense.createdBy.toString() === req.user.id;
    const isAdmin = group.members.some(
      member => member.user.toString() === req.user.id && member.role === 'admin'
    );
    
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }
    
    // Delete expense
    await Expense.findByIdAndDelete(expenseId);
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export expenses for a group as CSV data
router.get('/group/:groupId/export', async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // If there's a token, verify it
    let userId = null;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
        userId = decoded.id;
      } catch (err) {
        // If token verification fails, return authentication error
        return res.status(401).json({ message: 'Authentication required' });
      }
    } else {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const isMember = group.members.some(
      member => member.user.toString() === userId
    );
    
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to export expenses for this group' });
    }
    
    // Get all expenses for this group
    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email')
      .sort({ date: -1 });
    
    // Prepare CSV data
    const csvRows = [];
    
    // Add CSV header
    csvRows.push([
      'Date',
      'Description',
      'Amount',
      'Currency',
      'Amount in Group Currency',
      'Paid By',
      'Split Type',
      'Participants',
      'Notes',
    ].join(','));
    
    // Add expense data
    expenses.forEach(expense => {
      // Calculate amount in group's default currency
      const amountInDefaultCurrency = convertCurrency(
        expense.amount,
        expense.currency,
        group.defaultCurrency
      );
      
      const participants = expense.participants
        .map(p => `${p.user.name} (${p.share})`)
        .join('; ');
      
      // Format date properly - ISO format with date only
      const dateObj = new Date(expense.date);
      const formattedDate = dateObj.toISOString().split('T')[0];
      
      csvRows.push([
        formattedDate,
        `"${expense.description.replace(/"/g, '""')}"`,
        expense.amount,
        expense.currency,
        amountInDefaultCurrency.toFixed(2),
        expense.paidBy.name,
        expense.splitType,
        `"${participants.replace(/"/g, '""')}"`,
        `"${(expense.notes || '').replace(/"/g, '""')}"`,
      ].join(','));
    });
    
    // Join rows with newlines
    const csvData = csvRows.join('\n');
    
    // Send CSV data
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="expenses-${group.name}-${Date.now()}.csv"`);
    res.send(csvData);
  } catch (error) {
    console.error('Error exporting expenses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
