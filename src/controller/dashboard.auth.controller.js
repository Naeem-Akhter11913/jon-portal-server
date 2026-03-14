
const Joi = require('joi');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const round = Number(process.env.SALT_ROUND || '10');
const jwt = require('jsonwebtoken');
const sendEmail = require('../templates/nodemail');
const secret = process.env.SECRET_KEY

/**
 * @swagger
 * /auth/create-admin:
 *   post:
 *     summary: Register Admin User
 *     tags: [Auth]
 *     description: Create a new admin account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Naeem
 *               lastName:
 *                 type: string
 *                 example: Akhter
 *               email:
 *                 type: string
 *                 format: email
 *                 example: naeem@gmail.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *                 description: Must contain 8 characters, uppercase, lowercase, number and special character
 *               confirmPassword:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Your Profile created successfully!
 */
const createAdmin = async (req, res) => {
    try {
        const userSchema = Joi.object({
            firstName: Joi.string().min(3).required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string()
                .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
                .required()
                .messages({
                    "string.pattern.base":
                        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
                }),
            confirmPassword: Joi.string()
                .valid(Joi.ref("password"))
                .required()
                .messages({
                    "any.only": "Confirm password must match password",
                    "any.required": "Confirm password is required"
                })
        });

        const { error } = userSchema.validate(req.body);


        if (error) {
            const message = error.details[0].message.replaceAll("/", "").replaceAll(`"`, "");
            const transformMessage = message.charAt(0).toUpperCase().concat(message.slice(1))
            return res.status(400).json({ message: transformMessage });
        }
        const { firstName, lastName, email, password } = req.body;
        const isEmailPresent = await userModel.findOne({ email: email });

        if (isEmailPresent) {
            return res.status(401).send({
                status: false,
                message: "Email is already present"
            });
        }

        const hashPawss = await bcrypt.hash(password, round)



        const createdCollectionInstance = await userModel.create({
            firstName,
            lastName,
            email,
            password: hashPawss,
        });
        await createdCollectionInstance.save();

        const emailSentId = await sendEmail(email, "Welcome!", "accountCreated.html")

        res.status(200).send({
            status: true,
            emailSentId,
            message: "Your Profile created successfully!",
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error
        })
    }
}

/**
 * @swagger
 * /auth/loggedin-user:
 *   post:
 *     summary: Login Admin User
 *     tags: [Auth]
 *     description: Login admin to the account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: naeem@gmail.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *                 description: Must contain 8 characters, uppercase, lowercase, number and special character
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: You have been logged in successfully!

 */
const loginUser = async (req, res) => {
    try {
        const userSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string()
                .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
                .required()
                .messages({
                    "string.pattern.base":
                        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
                })
        });

        const { error } = userSchema.validate(req.body);



        if (error) {
            const message = error.details[0].message.replaceAll("/", "").replaceAll(`"`, "");
            const transformMessage = message.charAt(0).toUpperCase().concat(message.slice(1))
            return res.status(400).json({ message: transformMessage });
        }

        const isUserPresent = await userModel.findOne({ email: req.body.email });

        if (!isUserPresent) {
            return res.status(401).send({
                status: false,
                message: "You don't have account, Contact with your admin or create an account first",
            })
        }

        const { password, email, _id, firstName, lastName } = isUserPresent;

        const isMatchPassword = await bcrypt.compareSync(req.body.password, password)

        if (!isMatchPassword) {
            return res.status(401).send({
                status: false,
                message: "Incorrect Password"
            })
        }

        const payload = {
            email, _id, firstName, lastName
        }
        const accessToken = jwt.sign(
            payload,
            secret,
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            payload,
            secret,
            { expiresIn: "10d" }
        );

        res.cookie("token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 6 * 60 * 60 * 1000
        }).status(200).send({
            status: true,
            message: "Logged in successfully!",
            accessToken
        });

    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message || error
        })
    }
}

const regenerateToken = async (req, res) => {

    try {
        const { token } = req.cookies;

        const decpdedData = await jwt.decode(token);

        const { iat, exp, ...rest } = decpdedData

        const accessToken = jwt.sign(
            rest,
            secret,
            { expiresIn: "15m" }
        );

        res.status(200).send({
            status: true,
            message: "Token regenerated successfully!",
            accessToken
        });


    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message || error
        })
    }
}


// This controller will complete after settings SMPT
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const isUserPresent = await userModel.findOne({ email })

        if (!isUserPresent) {
            return res.status(401).send({
                status: false,
                message: "You Don't have An Account"
            })
        }
        const link = ""
        const id = await sendEmail(email, "Reset Password", "forgetPassword.html", link);

        res.status(200).send({
            status: true,
            sendMessageId: id,
            message: "Email Successfully Sent!."
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message || error
        })
    }
}

/**
 * @swagger
 * /auth/changes-password:
 *   put:
 *     summary: Change user password
 *     tags: [Auth]
 *     description: Allows a logged-in user to change their password using the old password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - oldPass
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               oldPass:
 *                 type: string
 *                 example: Old@1234
 *               password:
 *                 type: string
 *                 example: New@1234
 *               confirmPassword:
 *                 type: string
 *                 example: New@1234
 *     responses:
 *       200:
 *         description: Password successfully changed
 *         content:
 *           application/json:
 *             example:
 *               status: true
 *               message: Password Successfully Changed!
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Confirm password must match password
 *       401:
 *         description: Unauthorized or old password incorrect
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Old password is incorrect
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               status: false
 *               message: Internal server error
 */
const resetPassword = async (req, res) => {
    try {
        const userSchema = Joi.object({
            email: Joi.string().email().required(),
            oldPass: Joi.string()
                .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
                .required()
                .messages({
                    "string.pattern.base":
                        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
                }),
            password: Joi.string()
                .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
                .required()
                .messages({
                    "string.pattern.base":
                        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
                }),
            confirmPassword: Joi.string()
                .valid(Joi.ref("password"))
                .required()
                .messages({
                    "any.only": "Confirm password must match password",
                    "any.required": "Confirm password is required"
                })
        });

        const { error } = userSchema.validate(req.body);


        if (error) {
            const message = error.details[0].message.replaceAll("/", "").replaceAll(`"`, "");
            const transformMessage = message.charAt(0).toUpperCase().concat(message.slice(1))
            return res.status(400).send({ status: false, message: transformMessage });
        }


        const { email, password } = req.body;
        const isUserPresent = await userModel.findOne({ email });
        if (!isUserPresent) {
            return res.status(401).send({
                status: false,
                message: "Unauthorized"
            });
        }
        const isMatchPassword = bcrypt.compareSync(req.body.oldPass, isUserPresent.password);

        if (!isMatchPassword) {
            return res.status(401).send({
                status: false,
                message: "Old password is incorrect"
            });
        }

        const hashPawss = await bcrypt.hash(password, round);

        isUserPresent.password = hashPawss;

        await isUserPresent.save()

        res.status(200).send({
            status: true,
            message: "Password Successfully Changed!",
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message || error
        })
    }
}

module.exports = {
    createAdmin,
    loginUser,
    regenerateToken,
    resetPassword,
    forgetPassword
}