"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 Soaking up the soil (Seeding)...');
        // Categories
        const plumbing = yield prisma.category.upsert({
            where: { slug: 'plumbing' }, update: {}, create: { name: 'Plumbing', slug: 'plumbing', icon: '🔧' }
        });
        const electrical = yield prisma.category.upsert({
            where: { slug: 'electrical' }, update: {}, create: { name: 'Electrical', slug: 'electrical', icon: '⚡' }
        });
        const cleaning = yield prisma.category.upsert({
            where: { slug: 'cleaning' }, update: {}, create: { name: 'Cleaning', slug: 'cleaning', icon: '🧹' }
        });
        const carpentry = yield prisma.category.upsert({
            where: { slug: 'carpentry' }, update: {}, create: { name: 'Carpentry', slug: 'carpentry', icon: '🪚' }
        });
        const painting = yield prisma.category.upsert({
            where: { slug: 'painting' }, update: {}, create: { name: 'Painting', slug: 'painting', icon: '🎨' }
        });
        const tailoring = yield prisma.category.upsert({
            where: { slug: 'tailoring' }, update: {}, create: { name: 'Tailoring', slug: 'tailoring', icon: '🧵' }
        });
        const beauty = yield prisma.category.upsert({
            where: { slug: 'beauty' }, update: {}, create: { name: 'Beauty & Spa', slug: 'beauty', icon: '💅' }
        });
        const tutoring = yield prisma.category.upsert({
            where: { slug: 'tutoring' }, update: {}, create: { name: 'Tutoring', slug: 'tutoring', icon: '📚' }
        });
        // Providers & Users 
        // 1. Rajesh (Plumber)
        const rajeshUser = yield prisma.user.upsert({
            where: { email: 'rajesh@example.com' }, update: {},
            create: { email: 'rajesh@example.com', name: 'Rajesh Kumar', role: 'PROVIDER', password: 'password123', phone: '9876543210' }
        });
        const rajeshProfile = yield prisma.providerProfile.upsert({
            where: { userId: rajeshUser.id }, update: {},
            create: {
                userId: rajeshUser.id,
                bio: 'Master plumber with 12 years of experience in residential and commercial plumbing.',
                skills: 'Pipe Fitting,Leak Repair,Bathroom',
                experience: 12, rating: 4.8, reviewCount: 127, isVerified: true, location: 'Koramangala, Bangalore'
            }
        });
        // 2. Suresh (Electrician)
        const sureshUser = yield prisma.user.upsert({
            where: { email: 'suresh@example.com' }, update: {},
            create: { email: 'suresh@example.com', name: 'Suresh Sharma', role: 'PROVIDER', password: 'password123', phone: '9876543211' }
        });
        const sureshProfile = yield prisma.providerProfile.upsert({
            where: { userId: sureshUser.id }, update: {},
            create: {
                userId: sureshUser.id,
                bio: 'Certified electrician specializing in home wiring and smart installations.',
                skills: 'Wiring,MCB,Fan Installation',
                experience: 8, rating: 4.5, reviewCount: 89, isVerified: true, location: 'Indiranagar, Bangalore'
            }
        });
        // 3. Anita (Cleaner)
        const anitaUser = yield prisma.user.upsert({
            where: { email: 'anita@example.com' }, update: {},
            create: { email: 'anita@example.com', name: 'Anita Devi', role: 'PROVIDER', password: 'password123', phone: '9876543212' }
        });
        const anitaProfile = yield prisma.providerProfile.upsert({
            where: { userId: anitaUser.id }, update: {},
            create: {
                userId: anitaUser.id,
                bio: 'Professional cleaning expert. Eco-friendly products only.',
                skills: 'Deep Clean,Kitchen,Bathroom',
                experience: 6, rating: 4.9, reviewCount: 203, isVerified: true, location: 'HSR Layout, Bangalore'
            }
        });
        // 4. Mohammad (Carpenter)
        const mohammadUser = yield prisma.user.upsert({
            where: { email: 'mohammad@example.com' }, update: {},
            create: { email: 'mohammad@example.com', name: 'Mohammad Ali', role: 'PROVIDER', password: 'password123', phone: '9876543213' }
        });
        const mohammadProfile = yield prisma.providerProfile.upsert({
            where: { userId: mohammadUser.id }, update: {},
            create: {
                userId: mohammadUser.id,
                bio: 'Third-generation carpenter crafting custom furniture.',
                skills: 'Furniture,Doors,Cabinet',
                experience: 15, rating: 4.7, reviewCount: 156, isVerified: true, location: 'Jayanagar, Bangalore'
            }
        });
        // 5. Lakshmi (Painter)
        const lakshmiUser = yield prisma.user.upsert({
            where: { email: 'lakshmi@example.com' }, update: {},
            create: { email: 'lakshmi@example.com', name: 'Lakshmi Narayana', role: 'PROVIDER', password: 'password123', phone: '9876543214' }
        });
        const lakshmiProfile = yield prisma.providerProfile.upsert({
            where: { userId: lakshmiUser.id }, update: {},
            create: {
                userId: lakshmiUser.id,
                bio: 'Painting specialist with expertise in decorative and waterproof coatings.',
                skills: 'Wall Paint,Texture,Waterproof',
                experience: 10, rating: 4.6, reviewCount: 74, isVerified: false, location: 'Whitefield, Bangalore'
            }
        });
        // 6. Priya (Tailor)
        const priyaUser = yield prisma.user.upsert({
            where: { email: 'priya@example.com' }, update: {},
            create: { email: 'priya@example.com', name: 'Priya Menon', role: 'PROVIDER', password: 'password123', phone: '9876543215' }
        });
        const priyaProfile = yield prisma.providerProfile.upsert({
            where: { userId: priyaUser.id }, update: {},
            create: {
                userId: priyaUser.id,
                bio: 'Expert tailor with 20 years in designer wear and alterations.',
                skills: 'Blouse Stitching,Alterations,Designer',
                experience: 20, rating: 4.9, reviewCount: 312, isVerified: true, location: 'MG Road, Bangalore'
            }
        });
        // Services — clear old entries first to avoid duplicates on re-seed
        yield prisma.service.deleteMany({});
        yield prisma.service.createMany({
            data: [
                { title: 'Complete Bathroom Plumbing', description: 'Full bathroom plumbing including pipe fitting, tap installation, and leak repair.', price: 800, duration: 180, categoryId: plumbing.id, providerId: rajeshProfile.id },
                { title: 'Kitchen Sink Repair', description: 'Expert kitchen sink repair, drain cleaning, and garbage disposal installation.', price: 400, duration: 90, categoryId: plumbing.id, providerId: rajeshProfile.id },
                { title: 'Home Wiring & MCB Setup', description: 'Complete home electrical wiring, MCB panel installation, and safety audit.', price: 1500, duration: 300, categoryId: electrical.id, providerId: sureshProfile.id },
                { title: 'Fan & Light Installation', description: 'Ceiling fan installation, light fitting, and switchboard replacement.', price: 350, duration: 60, categoryId: electrical.id, providerId: sureshProfile.id },
                { title: 'Deep Home Cleaning', description: 'Comprehensive deep cleaning of your entire home including kitchen, bathrooms, and living areas.', price: 1200, duration: 360, categoryId: cleaning.id, providerId: anitaProfile.id },
                { title: 'Bathroom Deep Clean', description: 'Intensive bathroom cleaning with limescale removal and sanitization.', price: 500, duration: 120, categoryId: cleaning.id, providerId: anitaProfile.id },
                { title: 'Custom Furniture Making', description: 'Bespoke furniture crafted to your specifications. Wardrobes, tables, beds, and more.', price: 5000, duration: 4320, categoryId: carpentry.id, providerId: mohammadProfile.id },
                { title: 'Full Room Painting', description: 'Complete room painting with primer, two coats, and clean finish. Asian Paints premium.', price: 3500, duration: 1440, categoryId: painting.id, providerId: lakshmiProfile.id },
                { title: 'Designer Blouse Stitching', description: 'Custom blouse stitching with designer patterns, embroidery, and perfect fitting.', price: 800, duration: 2880, categoryId: tailoring.id, providerId: priyaProfile.id },
            ]
        });
        // Products — clear old entries first to avoid duplicates on re-seed
        yield prisma.product.deleteMany({});
        yield prisma.product.createMany({
            data: [
                { title: 'Handmade Terracotta Vase', description: 'Beautiful hand-crafted terracotta vase with traditional Indian motifs.', price: 650, stock: 12, category: 'Home Décor', images: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format', artisanId: mohammadUser.id },
                { title: 'Woven Bamboo Basket Set', description: 'Set of 3 hand-woven bamboo baskets. Eco-friendly and multipurpose.', price: 450, stock: 8, category: 'Home Décor', images: 'https://images.unsplash.com/photo-1567225477277-c8162eb4991d?w=600&auto=format', artisanId: mohammadUser.id },
                { title: 'Handloom Cotton Saree', description: 'Premium handloom cotton saree with traditional weave patterns.', price: 2200, stock: 5, category: 'Textiles', images: 'https://images.unsplash.com/photo-1610189012906-e7e01db05987?w=600&auto=format', artisanId: priyaUser.id },
                { title: 'Brass Diya Set (6 pcs)', description: 'Hand-forged brass diyas with intricate carvings.', price: 850, stock: 20, category: 'Home Décor', images: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format', artisanId: mohammadUser.id },
            ]
        });
        console.log('✅ Seeding completed!');
    });
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => __awaiter(void 0, void 0, void 0, function* () { yield prisma.$disconnect(); }));
