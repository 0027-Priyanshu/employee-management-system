import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(`\n🔍 LOGIN ATTEMPT: Trying to log in with email: "${email}"`);

        // 1. Check if the email exists in the database
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log(`❌ FAILED: The email "${email}" was NOT found in the database.`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 2. If email exists, check if the password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            console.log(`❌ FAILED: Email found, but the password was INCORRECT.`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. If both match, success!
        console.log(`✅ SUCCESS: Credentials match. Generating token for ${user.name}...`);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });

    } catch (error) {
        console.log(`🚨 SERVER ERROR: ${error.message}`);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        // req.user is populated by the 'protect' middleware
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};