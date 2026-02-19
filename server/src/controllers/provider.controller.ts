import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all providers
export const getProviders = async (_req: Request, res: Response) => {
    try {
        const providers = await prisma.providerProfile.findMany({
            include: { user: { select: { name: true, email: true, avatar: true } } }
        });
        res.json(providers);
    } catch (error) {
        console.error('Get providers error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get provider by ID
export const getProviderById = async (req: Request, res: Response) => {
    try {
        const provider = await prisma.providerProfile.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { name: true, email: true, avatar: true } },
                services: { include: { category: true } }
            }
        });
        if (!provider) return res.status(404).json({ message: 'Provider not found' });
        res.json(provider);
    } catch (error) {
        console.error('Get provider error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update provider profile (authenticated)
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { bio, location, skills } = req.body;

        let provider = await prisma.providerProfile.findFirst({ where: { userId } });

        if (provider) {
            provider = await prisma.providerProfile.update({
                where: { id: provider.id },
                data: { bio, location, skills: Array.isArray(skills) ? skills.join(',') : skills }
            });
        } else {
            provider = await prisma.providerProfile.create({
                data: { userId, bio, location, skills: Array.isArray(skills) ? skills.join(',') : skills }
            });
        }

        res.json(provider);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
