const User = require('../model/User');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get users by role
exports.getUsersByRole = async (req, res) => {
    try {
        const users = await User.find({ role: req.params.role }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Block a user
exports.blockUser = async (req, res) => {
    try {
        const { reason } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.blockUser(reason, req.user.email); // req.user should come from your auth middleware
        res.json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Unblock a user
exports.unblockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isBlocked = false;
        user.blockReason = undefined;
        user.blockDate = undefined;
        user.blockedBy = undefined;


        await user.save();
        res.json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add warning to user
exports.addWarning = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.warningCount+=1;
        await user.save();        
        res.json({ message: 'Warning added successfully', warningCount: user.warningCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const blockedUsers = await User.countDocuments({ isBlocked: true });
        const activeUsers = await User.countDocuments({ isBlocked: false });

        res.json({
            totalUsers,
            totalStudents,
            totalAdmins,
            blockedUsers,
            activeUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};                