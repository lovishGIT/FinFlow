import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from "@/config/db.config.js";
import generateToken from '@/utils/generateToken.util.js';
import type { User } from '@prisma/client';

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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.id);
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server error' });
    }
};

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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser: User | null = await prisma.user.create({
            data: {
                email, name, password: hashedPassword
            }
        })

        if (!newUser) {
            return res.status(500).json({
                message: "User Cannot be created"
            })
        }

        return res.status(201).json({
            message: "User Created"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error
        })
    }
}