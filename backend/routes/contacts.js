import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/contacts
// @desc    Submit contact form
// @access  Public
router.post('/',
    [
        body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
        body('email').trim().isEmail().withMessage('Valid email is required'),
        body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 })
    ],
    async (req, res) => {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { name, email, message } = req.body;

            // Create new contact
            const contact = new Contact({
                name,
                email,
                message
            });

            await contact.save();

            res.status(201).json({
                success: true,
                message: 'Contact form submitted successfully',
                data: contact
            });
        } catch (error) {
            console.error('Contact submission error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to submit contact form'
            });
        }
    }
);

// @route   GET /api/contacts
// @desc    Get all contacts
// @access  Private (Admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts'
        });
    }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact'
        });
    }
});

// @route   PATCH /api/contacts/:id/read
// @desc    Mark contact as read
// @access  Private (Admin only)
router.patch('/:id/read', authMiddleware, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact marked as read',
            data: contact
        });
    } catch (error) {
        console.error('Mark contact read error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark contact as read'
        });
    }
});

export default router;
