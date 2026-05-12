import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: 'Unauthorized' });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: token_decode.id }; 
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error in token' });
    }
};

export default authMiddleware;