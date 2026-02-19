import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            include: { artisan: { select: { name: true } } }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { title, description, price, stock, images } = req.body;
        const userId = (req as any).user.userId;

        const product = await prisma.product.create({
            data: {
                title,
                description,
                price,
                stock,
                images,
                artisanId: userId
            }
        });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: { artisan: { select: { name: true } } }
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
};
