import express from 'express';
import { body, validationResult } from 'express-validator';
import Feedback from '../models/Feedback.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/feedback
// @desc    Submit feedback
// @access  Public
router.post('/',
    [
        body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
        body('email').trim().isEmail().withMessage('Valid email is required'),
        body('feedback').trim().notEmpty().withMessage('Feedback is required').isLength({ max: 2000 }),
        body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
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

            const { name, email, feedback, rating } = req.body;

            // Create new feedback
            const newFeedback = new Feedback({
                name,
                email,
                feedback,
                rating: rating || 5
            });

            await newFeedback.save();

            res.status(201).json({
                success: true,
                message: 'Feedback submitted successfully',
                data: newFeedback
            });
        } catch (error) {
            console.error('Feedback submission error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to submit feedback'
            });
        }
    }
);

// @route   GET /api/feedback
// @desc    Get all feedback
// @access  Private (Admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: feedback.length,
            data: feedback
        });
    } catch (error) {
        console.error('Get feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback'
        });
    }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.json({
            success: true,
            message: 'Feedback deleted successfully'
        });
    } catch (error) {
        console.error('Delete feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete feedback'
        });
    }
});

// @route   PATCH /api/feedback/:id/read
// @desc    Mark feedback as read
// @access  Private (Admin only)
router.patch('/:id/read', authMiddleware, async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.json({
            success: true,
            message: 'Feedback marked as read',
            data: feedback
        });
    } catch (error) {
        console.error('Mark feedback read error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark feedback as read'
        });
    }
});

export default router;
