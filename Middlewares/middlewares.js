import jwt from 'jsonwebtoken';

const Secret_key= process.env.SECRET_KEY
export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, Secret_key);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};
export default verifyToken