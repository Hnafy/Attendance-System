import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

let verifyToken = (req, res, next) => {
    let token = req.headers.token;
    if (token) {
        try {
            let decoded = jwt.verify(req.headers.token, process.env.SECRET_KEY);
            req.user = decoded;
            next();
        } catch (err) {
            res.status(404).send({ message: "invalid token" });
        }
    } else {
        res.status(404).send({ message: "token isn't exist" });
    }
};

let isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(403).send({ message: "you don't authorized" });
    }
};

let authorization = (req, res, next) => {
    if (req.user.id === req.body.studentId) {
        next();
    } else {
        res.status(403).send({ message: "you don't authorized" });
    }
};

let TableAuth = (req, res, next) => {
    if (req.user.id === req.query.studentId || req.user.isAdmin) {
        next();
    } else {
        res.status(403).send({ message: "you don't authorized" });
    }
};

let adminIdMatch = [isAdmin,(req, res, next) => {
    const adminIdFromParams = req.params.id;
    if (req.user.isAdmin && req.user.id === adminIdFromParams) {
        next();
    } else {
        res.status(403).json({ message: "Admin ID does not match" });
    }
}];

export { verifyToken, isAdmin,authorization,TableAuth,adminIdMatch };