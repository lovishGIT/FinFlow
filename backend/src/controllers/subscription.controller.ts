import { Request, Response } from 'express';
import { PrismaClient, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const createSubscription = async (
    req: Request,
    res: Response
) => {
    if (!req.user || !req.user.id) {
        res.status(401).json({
            success: false,
            error: 'Please Login!'
        });
        return;
    }
    try {
        const subscriptionData = req.body;

        const subscription = await prisma.subscription.create({
            data: {
                name: subscriptionData.name,
                category: subscriptionData.category,
                amount: subscriptionData.amount,
                description: subscriptionData.description,
                status: subscriptionData.status || 'ACTIVE',
                userId: req.user?.id,
                startDate: subscriptionData.startDate
                    ? new Date(subscriptionData.startDate)
                    : new Date(),
                endDate: subscriptionData.endDate
                    ? new Date(subscriptionData.endDate)
                    : null,
            },
        });

        res.status(201).json({
            success: true,
            data: subscription,
        });
        return;
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create subscription',
        });
        return;
    }
};

export const getAllSubscriptions = async (
    req: Request,
    res: Response
) => {
    try {
        const subscriptions = await prisma.subscription.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions,
        });
    } catch (error) {
        console.error('Error getting all subscriptions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get subscriptions',
        });
    }
};

export const getSubscriptionById = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        const subscription = await prisma.subscription.findUnique({
            where: { id },
        });

        if (!subscription) {
            res.status(404).json({
                success: false,
                error: 'Subscription not found',
            });

            return;
        }

        res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        console.error(
            `Error getting subscription with id ${req.params.id}:`,
            error
        );
        res.status(500).json({
            success: false,
            error: 'Failed to get subscription',
        });
    }
};

export const updateSubscription = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const existingSubscription =
            await prisma.subscription.findUnique({
                where: { id },
            });

        if (!existingSubscription) {
            res.status(404).json({
                success: false,
                error: 'Subscription not found',
            });

            return;
        }

        if (updateData.startDate) {
            updateData.startDate = new Date(updateData.startDate);
        }
        if (updateData.endDate) {
            updateData.endDate = new Date(updateData.endDate);
        }

        const updatedSubscription = await prisma.subscription.update({
            where: { id },
            data: updateData,
        });

        res.status(200).json({
            success: true,
            data: updatedSubscription,
        });
    } catch (error) {
        console.error(
            `Error updating subscription with id ${req.params.id}:`,
            error
        );
        res.status(500).json({
            success: false,
            error: 'Failed to update subscription',
        });
    }
};

export const toggleSubscription = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const existingSubscription =
            await prisma.subscription.findUnique({
                where: { id },
            });

        if (!existingSubscription) {
            res.status(404).json({
                success: false,
                error: 'Subscription not found',
            });

            return;
        }

        const newStatus =
            status === 'ACTIVE' ? SubscriptionStatus.ACTIVE :
            status === 'INACTIVE' ? SubscriptionStatus.INACTIVE :
            status === 'CANCELLED' ? SubscriptionStatus.CANCELLED :
            SubscriptionStatus.ACTIVE; // Default: ACTIVE as status is not recognized

        const updatedSubscription = await prisma.subscription.update({
            where: { id },
            data: {
                status: newStatus,
            },
        });

        res.status(200).json({
            success: true,
            data: updatedSubscription,
            message: `Subscription status toggled to ${newStatus}`,
        });
    } catch (error) {
        console.error(
            `Error toggling subscription with id ${req.params.id}:`,
            error
        );
        res.status(500).json({
            success: false,
            error: 'Failed to toggle subscription status',
        });
    }
};
