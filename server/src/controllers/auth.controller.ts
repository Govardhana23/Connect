import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateTokens } from '../utils/jwt.utils';
import { verifyFirebaseToken } from '../config/firebase.config';

const prisma = new PrismaClient();

// ── Email/Password Register ──
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, role, phone } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required' });
        }

        const existingUser = await prisma.user.findFirst({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'CUSTOMER',
                phone: phone || null,
                authProvider: 'EMAIL',
            }
        });

        const tokens = generateTokens(user);
        res.json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
            ...tokens
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ── Email/Password Login ──
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const tokens = generateTokens(user);
        res.json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
            ...tokens
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ── Google OAuth ──
export const googleAuth = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: 'Firebase ID token is required' });
        }

        const decoded = await verifyFirebaseToken(idToken);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid Firebase token' });
        }

        const { uid, email, name, picture } = decoded;

        // Find existing user by firebaseUid or email
        let user = await prisma.user.findFirst({
            where: { OR: [{ firebaseUid: uid }, ...(email ? [{ email }] : [])] }
        });

        if (user) {
            // Update firebaseUid if not set
            if (!user.firebaseUid) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { firebaseUid: uid, avatar: picture || user.avatar }
                });
            }
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email: email || null,
                    name: name || email?.split('@')[0] || 'Google User',
                    firebaseUid: uid,
                    authProvider: 'GOOGLE',
                    avatar: picture || null,
                    role: 'CUSTOMER',
                }
            });
        }

        const tokens = generateTokens(user);
        res.json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
            ...tokens
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ── Phone OTP Auth ──
export const phoneAuth = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: 'Firebase ID token is required' });
        }

        const decoded = await verifyFirebaseToken(idToken);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid Firebase token' });
        }

        const { uid, phone_number } = decoded;

        // Find existing user by firebaseUid or phone
        let user = await prisma.user.findFirst({
            where: { OR: [{ firebaseUid: uid }, ...(phone_number ? [{ phone: phone_number }] : [])] }
        });

        if (user) {
            if (!user.firebaseUid) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { firebaseUid: uid, phone: phone_number || user.phone }
                });
            }
        } else {
            user = await prisma.user.create({
                data: {
                    phone: phone_number || null,
                    name: `User ${phone_number?.slice(-4) || 'New'}`,
                    firebaseUid: uid,
                    authProvider: 'PHONE',
                    role: 'CUSTOMER',
                }
            });
        }

        const tokens = generateTokens(user);
        res.json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone, avatar: user.avatar },
            ...tokens
        });
    } catch (error) {
        console.error('Phone auth error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ── Get Current User ──
export const getMe = async (req: any, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, authProvider: true, createdAt: true }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ user });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
