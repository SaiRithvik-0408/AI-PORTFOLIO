import express from 'express';
import Config from '../models/Config.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Default color configuration
const DEFAULT_COLORS = {
    primary: 'indigo-500',
    secondary: 'purple-500',
    accent: 'pink-500',
    glow: 'from-indigo-500/50 via-purple-500/50 to-pink-500/50',
    background: '#0f172a' // Default dark background
};

// @route   GET /api/config
// @desc    Get portfolio configuration
// @access  Public
router.get('/', async (req, res) => {
    try {
        const config = await Config.findOne({ configKey: 'portfolio' });

        if (!config) {
            // Return default config if none exists
            return res.json({
                success: true,
                data: {
                    colors: DEFAULT_COLORS,
                    sections: {}
                }
            });
        }

        res.json({
            success: true,
            data: config.configData
        });
    } catch (error) {
        console.error('Get config error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch configuration'
        });
    }
});

// @route   PUT /api/config
// @desc    Update portfolio configuration
// @access  Private (Admin only)
router.put('/', authMiddleware, async (req, res) => {
    try {
        const { configData } = req.body;

        if (!configData) {
            return res.status(400).json({
                success: false,
                message: 'Configuration data is required'
            });
        }

        // Update or create config
        const config = await Config.findOneAndUpdate(
            { configKey: 'portfolio' },
            {
                configData,
                updatedAt: Date.now()
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.json({
            success: true,
            message: 'Configuration updated successfully',
            data: config.configData
        });
    } catch (error) {
        console.error('Update config error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update configuration'
        });
    }
});

// @route   GET /api/config/colors
// @desc    Get color configuration
// @access  Public
router.get('/colors', async (req, res) => {
    try {
        const config = await Config.findOne({ configKey: 'portfolio' });

        const colors = config?.configData?.colors || DEFAULT_COLORS;

        res.json({
            success: true,
            data: colors
        });
    } catch (error) {
        console.error('Get colors error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch colors'
        });
    }
});

// @route   PUT /api/config/colors
// @desc    Update color configuration
// @access  Private (Admin only)
router.put('/colors', authMiddleware, async (req, res) => {
    try {
        const { colors } = req.body;

        if (!colors) {
            return res.status(400).json({
                success: false,
                message: 'Colors data is required'
            });
        }

        // Get existing config or create new one
        let config = await Config.findOne({ configKey: 'portfolio' });

        if (!config) {
            config = new Config({
                configKey: 'portfolio',
                configData: { colors }
            });
        } else {
            config.configData = {
                ...config.configData,
                colors
            };
        }

        await config.save();

        res.json({
            success: true,
            message: 'Colors updated successfully',
            data: colors
        });
    } catch (error) {
        console.error('Update colors error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update colors'
        });
    }
});

// @route   POST /api/config/colors/reset
// @desc    Reset colors to default
// @access  Private (Admin only)
router.post('/colors/reset', authMiddleware, async (req, res) => {
    try {
        // Get existing config
        let config = await Config.findOne({ configKey: 'portfolio' });

        if (!config) {
            config = new Config({
                configKey: 'portfolio',
                configData: { colors: DEFAULT_COLORS }
            });
        } else {
            config.configData = {
                ...config.configData,
                colors: DEFAULT_COLORS
            };
        }

        await config.save();

        res.json({
            success: true,
            message: 'Colors reset to default successfully',
            data: DEFAULT_COLORS
        });
    } catch (error) {
        console.error('Reset colors error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset colors'
        });
    }
});

export default router;
