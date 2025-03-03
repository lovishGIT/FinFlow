import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from "@/config/db.config.js";
import generateToken from '@/utils/generateToken.util.js';
import type { User } from '@prisma/client';
import env from '@/config/validateEnv.config.js';

export const loginController = async (req: Request, res: Response) : Promise<any> => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({
        message: "Email & Password must be provided."
    });

    try {
        const user: User | null = await prisma.user.findFirst({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.verified === false) {
            return res.status(403).json({
                message: "Please Verify User Via Token"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.id);

        return res
            .status(200)
            .cookie("authToken", token, {
                httpOnly: true,
                sameSite: env.NODE_ENV === "production"
            })
            .json({
                message: "User Logged In"
            });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server error' });
    }
};

export const verifyUser = async (req: Request, res: Response): Promise<any> => {
    const { token } = req.body;
    if (!token) return res.status(400).json({
        message: "Token is Required"
    })

    try {
        const getUser = await prisma.user.findFirst({
            where: {
                verified: false,
                token: token,
            },
        });

        if (!getUser) {
            return res.status(404).json({
            message: "User Not Found"
            });
        }

        const oneHour = 60 * 60 * 1000;
        if (Date.now() > new Date(getUser.createdAt).getTime() + oneHour) {
            await prisma.user.delete({
                where: {
                    id: getUser.id,
                    verified: false
                }
            })
            return res.status(400).json({
                message: "Token has expired"
            });
        }

        await prisma.user.update({
            where: { id: getUser.id },
            data: { verified: true, token: "" },
        });


        return res
            .status(200)
            .clearCookie('authToken')
            .json({
            message: "User Verified"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const registerController = async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({
            message: 'Full Name & Email & Password must be provided.',
        });

    try {
        const existingUser: User | null = await prisma.user.findFirst({
            where: { email },
        })
        if (existingUser) {
            return res.status(400).json({
                message: "Email Already Taken"
            })
        }

        const password_salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, password_salt);


        const newUser: User | null = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        const token_salt = await bcrypt.genSalt(10);
        const hasedToken = await bcrypt.hash(newUser.id, token_salt);

        await prisma.user.update({
            where: { id: newUser.id },
            data: { token: hasedToken },
        });

        if (!newUser) {
            return res.status(500).json({
                message: "User Cannot be created"
            })
        }

        return res
            .status(201)
            .clearCookie('authToken')
            .json({
                message: "User Created! Please Verify the user with specified Token within One Hour.",
                token: hasedToken
            })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
};