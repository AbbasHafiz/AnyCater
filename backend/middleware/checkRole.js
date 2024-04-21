const checkRole = (role) => {
    return (req, res, next) => {
        // Your role-based access logic here
        // Example: Verify role logic with the user object or JWT token
        
        // For demonstration, assuming role information is available in the user object
        if (req.user && req.user.role === role) {
            next();
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }
    };
};

module.exports = checkRole;
