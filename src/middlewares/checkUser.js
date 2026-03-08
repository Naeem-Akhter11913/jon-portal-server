const jwt = require("jsonwebtoken");

const isValidUserRequest = async (req, res, next) => {
    try {

        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send({
                status: false,
                message: "Unauthorized"
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        req.user = decoded; // attach user data

        next();

    } catch (error) {
        return res.status(401).send({
            status: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = isValidUserRequest;