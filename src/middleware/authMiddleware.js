import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Yetkilendirme token\'ı eksik veya geçersiz.' });
        }

        const token = authHeader.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET); // Tokenden gelen payload

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token süresi dolmuş.' });
        }
        return res.status(401).json({ message: 'Geçersiz token.' });
    }
};

export default authMiddleware;