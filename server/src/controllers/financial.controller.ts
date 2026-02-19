import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFinancialPlan = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const providerProfile = await prisma.providerProfile.findUnique({
            where: { userId }
        });

        if (!providerProfile) {
            return res.status(404).json({ message: 'Provider profile not found' });
        }

        const financialPlan = await prisma.financialPlan.findUnique({
            where: { providerId: providerProfile.id }
        });

        if (!financialPlan) {
            // Return default/empty plan if not exists
            return res.json({
                monthlyIncome: 0,
                savingsGoal: 0,
                expenseLimit: 0,
                providerId: providerProfile.id
            });
        }

        res.json(financialPlan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching financial plan' });
    }
};

export const updateFinancialPlan = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { monthlyIncome, savingsGoal, expenseLimit } = req.body;

        const providerProfile = await prisma.providerProfile.findUnique({
            where: { userId }
        });

        if (!providerProfile) {
            return res.status(404).json({ message: 'Provider profile not found' });
        }

        const financialPlan = await prisma.financialPlan.upsert({
            where: { providerId: providerProfile.id },
            update: {
                monthlyIncome: parseFloat(monthlyIncome),
                savingsGoal: parseFloat(savingsGoal),
                expenseLimit: parseFloat(expenseLimit)
            },
            create: {
                providerId: providerProfile.id,
                monthlyIncome: parseFloat(monthlyIncome),
                savingsGoal: parseFloat(savingsGoal),
                expenseLimit: parseFloat(expenseLimit)
            }
        });

        res.json(financialPlan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating financial plan' });
    }
};
