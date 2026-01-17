import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
    configKey: {
        type: String,
        required: true,
        unique: true,
        enum: ['portfolio', 'colors', 'sections']
    },
    configData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update the updatedAt field before saving
configSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Config = mongoose.model('Config', configSchema);

export default Config;
