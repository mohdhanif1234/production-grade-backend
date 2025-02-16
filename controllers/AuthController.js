import { prisma } from "../db/db.config.js"
import vine, { errors } from "@vinejs/vine";
import { registerSchema } from "../validations/authValidation.js";
import bcrypt from "bcryptjs"

class AuthController {
    static async register(req, res) {
        try {
            const body = req.body;
            const validator = vine.compile(registerSchema);
            const payload = await validator.validate(body);

            // Check if email exists

            const findUser = await prisma.users.findUnique({
                where: {
                    email: payload.email
                }
            })

            if (findUser) {
                return res.status(400).json({
                    error: {
                        email: "Email is already taken. Please use another one."
                    }
                })
            }

            // Encrypt password
            const salt = bcrypt.genSaltSync(10);
            payload.password = bcrypt.hashSync(payload.password, salt);

            const user = await prisma.users.create({
                data: payload
            })

            return res.json({ status: 200, message: "User created successfully.", user });

        } catch (error) {
            console.log('Error is: ', error)
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ error: error.messages })
            }
            else {
                return res.status(500).json({ status: 500, message: "Something went wrong.Please try again." })
            }
        }
    }
}

export default AuthController