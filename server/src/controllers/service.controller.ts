import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Categories
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, slug, icon } = req.body;
        const category = await prisma.category.create({
            data: { name, slug, icon }
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category' });
    }
};

// Services
export const getServices = async (req: Request, res: Response) => {
    try {
        const { categoryId, providerId } = req.query;
        const where: any = {};
        if (categoryId) where.categoryId = String(categoryId);
        if (providerId) where.providerId = String(providerId);

        const services = await prisma.service.findMany({
            where,
            include: { category: true, provider: { include: { user: { select: { name: true } } } } }
        });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services' });
    }
};

export const createService = async (req: Request, res: Response) => {
    try {
        const { title, description, price, duration, categoryId } = req.body;
        // Assuming req.user is populated by auth middleware
        const userId = (req as any).user.userId;

        const providerProfile = await prisma.providerProfile.findUnique({
            where: { userId }
        });

        if (!providerProfile) {
            return res.status(400).json({ message: 'User is not a provider' });
        }

        const service = await prisma.service.create({
            data: {
                title,
                description,
                price,
                duration,
                providerId: providerProfile.id,
                categoryId
            }
        });
        res.json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating service' });
    }
};
export const getServiceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const service = await prisma.service.findUnique({
            where: { id },
            include: { provider: { include: { user: { select: { name: true, phone: true } } } }, category: true }
        });
        if (!service) return res.status(404).json({ message: 'Service not found' });
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching service' });
    }
};
