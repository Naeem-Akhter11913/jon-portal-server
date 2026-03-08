
const Joi = require('joi');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const round = Number(process.env.SALT_ROUND || '10')

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

        res.status(200).send({
            status: true,
            message: "Your Profile created successfully!",
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error
        })
    }
}


module.exports = {
    createAdmin
}