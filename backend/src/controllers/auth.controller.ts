import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import prisma from "@/config/db.config.js";
import generateToken from '@/utils/generateToken.util.js';
import type { User } from '@prisma/client';
import env from '@/config/validateEnv.config.js';
import { sendEmail } from '@/utils/sendEmail.util.js';
import { uploadToCloudinary } from '../utils/cloudinary.util';

export const loginController = async (req: Request, res: Response) : Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            message: "Email & Password must be provided."
        });
        return;
    }

    try {
        const user: User | null = await prisma.user.findFirst({
            where: { email },
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user.verified === false) {
            res.status(403).json({
                message: "Please Verify User Via Token"
            })
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user.id, '1d');

        res.status(200).cookie("authToken", token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
        }).json({
            message: "User Logged In"
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' });
    }
};

export const verifyUser = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;
    if (!token) {
        res.status(400).json({
            message: "Token is Required"
        });
        return;
    }

    try {
        const getUser = await prisma.user.findFirst({
            where: {
                verified: false,
                token: token,
            },
        });

        if (!getUser) {
            res.status(404).json({
                message: "User Not Found"
            });
            return;
        }

        const oneHour = 60 * 60 * 1000;
        if (Date.now() > new Date(getUser.createdAt).getTime() + oneHour) {
            await prisma.user.delete({
                where: {
                    id: getUser.id,
                    verified: false
                }
            })
            res.status(400).json({
                message: "Token has expired"
            });
            return;
        }

        await prisma.user.update({
            where: { id: getUser.id },
            data: { verified: true, token: "" },
        });


        res.status(200).clearCookie('authToken').json({
            message: "User Verified"
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const registerController = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({
            message: 'Full Name & Email & Password must be provided.',
        });
        return;
    }

    try {
        const existingUser: User | null = await prisma.user.findFirst({
            where: { email },
        })
        if (existingUser) {
            res.status(400).json({
                message: "Email Already Taken"
            });
            return;
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
            res.status(500).json({
                message: "User Cannot be created"
            });
            return;
        }

        await sendEmail({
            to: email,
            subject: 'Registeration Email',
            text: `Paste this link on browser: ${
                env.FRONTEND_URL + '/auth/verify/' + hasedToken
            }`,
            html: `
                <p>Click on this button to register yourself.</p>
                <div style="display: flex; justify-content: center;">
                    <a
                        style="padding: "4px 2px"; "
                        href="${
                            env.FRONTEND_URL +
                            '/auth/verify/' +
                            hasedToken
                        }"
                    >
                        Click Here
                    </a>
                </div>
                <p>
                    If button doesn't work. Paste this link on browser:
                    ${env.FRONTEND_URL + '/auth/verify/' + hasedToken}
                </p>
            `,
        });

        res
            .status(201)
            .clearCookie('authToken')
            .json({
                message: "User Created! Please Verify the user with specified Token within One Hour."
            })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
};

export const forgetPasswordRequestController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        const findUser = await prisma.user.findFirst({
            where: { email }
        });

        if (!findUser) {
            res.status(404).json({
                message: 'User Not Found'
            });
            return;
        }

        if (!findUser.verified) {
            res.status(403).json({
                message: 'User Not Verified.'
            });
            return;
        }

        const hashedToken = generateToken(findUser.id, '1h');

        await sendEmail({
            to: email,
            subject: "Password Reset Requested! Finflow",
            text: `Paste this URL on browser: ${env.FRONTEND_URL + '/auth/reset/' + hashedToken}. This link is only valid for 1 hour.`,
            html: `
            <p>Click the button below to reset your password:</p>
            <div style="display: flex; justify-content: center;">
                <a
                style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;"
                href="${env.FRONTEND_URL + '/auth/reset/' + hashedToken}"
                >
                Reset Password
                </a>
            </div>
            <p>
                If the button doesn't work, paste this URL into your browser:
                ${env.FRONTEND_URL + '/auth/reset/' + hashedToken}
            </p>
            <p><strong>Note:</strong> This link is only valid for 1 hour.</p>
            `,
        });

        res.status(200).json({
            message: "Password reset email sent successfully."
        });
    } catch (error) {
        console.error("Error At Password Reset Request: ", error);
        res.status(500).json({
            error: (error instanceof Error ? error.message : 'Internal Server Error'),
        });
    }
}; // Not Tested

export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, password } = req.body();
        const data = jwt.verify(token, env.JWT_SECRET) as ({
            id: string;
        } | null);

        if (!data || !data.id) {
            res.status(400).json({
                message: 'Bad or Damaged Token! Request A New Token'
            });
            return;
        }

        const findUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: data.id }
                ],
            },
        });

        if (!findUser) {
            res.status(404).json({
                message: 'No User Found'
            })
            return;
        }

        if (findUser.verified === false) {
            res.status(403).json({
                message: 'User Not Verified.'
            });
            return;
        }

        await prisma.user.update({
            where: { id: findUser.id },
            data: { password },
        });

        res.status(200).json({
            message: 'Password Changed!'
        });

    } catch (error) {
        console.error("Error In Resetting The Password: ", error);
        res.status(500).json({
            error: (error instanceof Error) ? error.message : "Internal Server Error"
        });
    }
}; // Not Tested

export const logoutController = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('authToken', {
            httpOnly: true,
            sameSite: env.NODE_ENV === "production",
        }).status(200).json({
            message: "User Logged Out Successfully"
        });
    } catch (error) {
        console.error("Error in logout Controller", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown Error"
        });
    }
}; // Not Tested

export const getUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                message: "Authentication is Required"
            });
            return;
        }

        const user: Partial<User> | null = await prisma.user.findFirst({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                balance: true,
                role: true,
                verified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            res.status(404).json({
                message: "User Not Found"
            });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUserController", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown Error"
        });
    }
}; // Not Tested

export const updateUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                message: "Authentication is Required"
            });
            return;
        }

        const { name, email, password } = req.body;

        let avatar = null;

        if (req.file) {
            const file = req.file as Express.Multer.File;
            const filePath = file.path;

            const { url, public_id } = await uploadToCloudinary(filePath);

            avatar = await prisma.cloudinaryAsset.create({
                data: {
                    public_id,
                    url,
                }
            });
        }

        const updatedUser: Partial<User> | null = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                avatarId: avatar ? avatar.id : undefined,
                password
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                balance: true,
                role: true,
                verified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!updatedUser) {
            res.status(404).json({
                message: "User Not Found"
            });
            return;
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in updateUserController", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown Error"
        });
    }
}; // Not Tested