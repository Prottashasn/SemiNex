const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'student'
    },
    phone: {
        type: String,
        trim: true
    },
    institution: {
        type: String,
        trim: true
    },
    
    // Blocking system fields
    isBlocked: {
        type: Boolean,
        default: false
    },
    blockReason: {
        type: String,
        trim: true
    },
    blockDate: {
        type: Date
    },
    blockedBy: {
        type: String // Admin email who blocked the user
    },
    warningCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Block user method
userSchema.methods.blockUser = function(reason, adminEmail) {
    this.isBlocked = true;
    this.blockReason = reason;
    this.blockDate = new Date();
    this.blockedBy = adminEmail;
    return this.save();
};

// Unblock user method
userSchema.methods.unblockUser = function() {
    this.isBlocked = false;
    this.blockReason = undefined;
    this.blockDate = undefined;
    this.blockedBy = undefined;
    return this.save();
};

// Increment warning count method
userSchema.methods.incrementWarning = function() {
    this.warningCount += 1;
    return this.save();
};

// Static method to find users by role
userSchema.statics.findByRole = function(role) {
    return this.find({ role });
};

// Static method to find blocked users
userSchema.statics.findBlockedUsers = function() {
    return this.find({ isBlocked: true });
};

// Static method to find active users
userSchema.statics.findActiveUsers = function() {
    return this.find({ isBlocked: false });
};

const User = mongoose.model('User', userSchema);

module.exports = User;   