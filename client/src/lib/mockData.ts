// ═══ Types ═══
export interface Provider {
    id: string; name: string; avatar: string; rating: number; reviewCount: number;
    skills: string[]; experience: string; bio: string; location: string; isOnline: boolean; isVerified: boolean;
}
export interface ServiceItem {
    id: string; title: string; description: string; price: number; duration: string;
    category: string; categorySlug: string; image: string; provider: Provider; rating: number; bookings: number;
}
export interface ProductItem {
    id: string; title: string; description: string; price: number; images: string[];
    artisan: Provider; category: string; stock: number; rating: number; reviews: number;
}
export interface Booking {
    id: string; service: ServiceItem; provider: Provider; status: BookingStatus;
    date: string; time: string; totalPrice: number; createdAt: string; notes?: string;
}
export interface Message {
    id: string; senderId: string; receiverId: string; text: string; timestamp: string; read: boolean;
}
export interface Conversation {
    id: string; participant: Provider; lastMessage: string; lastTime: string; unread: number;
}
export interface Review {
    id: string; user: string; avatar: string; rating: number; comment: string; date: string;
}
export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface Category {
    slug: string; name: string; icon: string; count: number; color: string;
}

// ═══ Categories ═══
export const categories: Category[] = [
    { slug: 'plumbing', name: 'Plumbing', icon: '🔧', count: 48, color: '#3498db' },
    { slug: 'electrical', name: 'Electrical', icon: '⚡', count: 35, color: '#f39c12' },
    { slug: 'carpentry', name: 'Carpentry', icon: '🪚', count: 27, color: '#e67e22' },
    { slug: 'cleaning', name: 'Cleaning', icon: '🧹', count: 62, color: '#2ecc71' },
    { slug: 'painting', name: 'Painting', icon: '🎨', count: 19, color: '#e74c3c' },
    { slug: 'tailoring', name: 'Tailoring', icon: '🧵', count: 33, color: '#9b59b6' },
    { slug: 'beauty', name: 'Beauty & Spa', icon: '💅', count: 41, color: '#fd79a8' },
    { slug: 'tutoring', name: 'Tutoring', icon: '📚', count: 55, color: '#00cec9' },
];

// ═══ Providers ═══
export const providers: Provider[] = [
    { id: 'p1', name: 'Rajesh Kumar', avatar: 'https://i.pravatar.cc/150?img=11', rating: 4.8, reviewCount: 127, skills: ['Pipe Fitting', 'Leak Repair', 'Bathroom'], experience: '12 years', bio: 'Master plumber with 12 years of experience in residential and commercial plumbing.', location: 'Koramangala, Bangalore', isOnline: true, isVerified: true },
    { id: 'p2', name: 'Suresh Sharma', avatar: 'https://i.pravatar.cc/150?img=12', rating: 4.5, reviewCount: 89, skills: ['Wiring', 'MCB', 'Fan Installation'], experience: '8 years', bio: 'Certified electrician specializing in home wiring and smart installations.', location: 'Indiranagar, Bangalore', isOnline: true, isVerified: true },
    { id: 'p3', name: 'Anita Devi', avatar: 'https://i.pravatar.cc/150?img=5', rating: 4.9, reviewCount: 203, skills: ['Deep Clean', 'Kitchen', 'Bathroom'], experience: '6 years', bio: 'Professional cleaning expert. Eco-friendly products only.', location: 'HSR Layout, Bangalore', isOnline: false, isVerified: true },
    { id: 'p4', name: 'Mohammad Ali', avatar: 'https://i.pravatar.cc/150?img=14', rating: 4.7, reviewCount: 156, skills: ['Furniture', 'Doors', 'Cabinet'], experience: '15 years', bio: 'Third-generation carpenter crafting custom furniture.', location: 'Jayanagar, Bangalore', isOnline: true, isVerified: true },
    { id: 'p5', name: 'Lakshmi Narayana', avatar: 'https://i.pravatar.cc/150?img=15', rating: 4.6, reviewCount: 74, skills: ['Wall Paint', 'Texture', 'Waterproof'], experience: '10 years', bio: 'Painting specialist with expertise in decorative and waterproof coatings.', location: 'Whitefield, Bangalore', isOnline: false, isVerified: false },
    { id: 'p6', name: 'Priya Menon', avatar: 'https://i.pravatar.cc/150?img=9', rating: 4.9, reviewCount: 312, skills: ['Blouse Stitching', 'Alterations', 'Designer'], experience: '20 years', bio: 'Expert tailor with 20 years in designer wear and alterations.', location: 'MG Road, Bangalore', isOnline: true, isVerified: true },
    { id: 'p7', name: 'Deepa Kumari', avatar: 'https://i.pravatar.cc/150?img=25', rating: 4.8, reviewCount: 198, skills: ['Facial', 'Haircut', 'Bridal'], experience: '9 years', bio: 'Beauty specialist offering premium salon services at your doorstep.', location: 'BTM Layout, Bangalore', isOnline: true, isVerified: true },
    { id: 'p8', name: 'Vikram Singh', avatar: 'https://i.pravatar.cc/150?img=33', rating: 4.7, reviewCount: 145, skills: ['Math', 'Physics', 'JEE Prep'], experience: '7 years', bio: 'IIT graduate offering personalized coaching for competitive exams.', location: 'Electronic City, Bangalore', isOnline: false, isVerified: true },
];

// ═══ Services ═══
export const services: ServiceItem[] = [
    { id: 's1', title: 'Complete Bathroom Plumbing', description: 'Full bathroom plumbing including pipe fitting, tap installation, and leak repair. Includes material inspection.', price: 800, duration: '2-3 hrs', category: 'Plumbing', categorySlug: 'plumbing', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format', provider: providers[0], rating: 4.8, bookings: 234 },
    { id: 's2', title: 'Kitchen Sink Repair', description: 'Expert kitchen sink repair, drain cleaning, and garbage disposal installation.', price: 400, duration: '1-2 hrs', category: 'Plumbing', categorySlug: 'plumbing', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format', provider: providers[0], rating: 4.7, bookings: 189 },
    { id: 's3', title: 'Home Wiring & MCB Setup', description: 'Complete home electrical wiring, MCB panel installation, and safety audit.', price: 1500, duration: '4-5 hrs', category: 'Electrical', categorySlug: 'electrical', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format', provider: providers[1], rating: 4.5, bookings: 156 },
    { id: 's4', title: 'Fan & Light Installation', description: 'Ceiling fan installation, light fitting, and switchboard replacement.', price: 350, duration: '1 hr', category: 'Electrical', categorySlug: 'electrical', image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&auto=format', provider: providers[1], rating: 4.6, bookings: 312 },
    { id: 's5', title: 'Deep Home Cleaning', description: 'Comprehensive deep cleaning of your entire home including kitchen, bathrooms, and living areas.', price: 1200, duration: '4-6 hrs', category: 'Cleaning', categorySlug: 'cleaning', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format', provider: providers[2], rating: 4.9, bookings: 478 },
    { id: 's6', title: 'Bathroom Deep Clean', description: 'Intensive bathroom cleaning with limescale removal and sanitization.', price: 500, duration: '1-2 hrs', category: 'Cleaning', categorySlug: 'cleaning', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format', provider: providers[2], rating: 4.8, bookings: 367 },
    { id: 's7', title: 'Custom Furniture Making', description: 'Bespoke furniture crafted to your specifications. Wardrobes, tables, beds, and more.', price: 5000, duration: '3-5 days', category: 'Carpentry', categorySlug: 'carpentry', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format', provider: providers[3], rating: 4.7, bookings: 89 },
    { id: 's8', title: 'Door & Window Repair', description: 'Repair and maintenance of wooden doors, windows, and frames.', price: 600, duration: '2-3 hrs', category: 'Carpentry', categorySlug: 'carpentry', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&auto=format', provider: providers[3], rating: 4.6, bookings: 145 },
    { id: 's9', title: 'Full Room Painting', description: 'Complete room painting with primer, two coats, and clean finish. Asian Paints premium.', price: 3500, duration: '1-2 days', category: 'Painting', categorySlug: 'painting', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format', provider: providers[4], rating: 4.6, bookings: 67 },
    { id: 's10', title: 'Designer Blouse Stitching', description: 'Custom blouse stitching with designer patterns, embroidery, and perfect fitting.', price: 800, duration: '2-3 days', category: 'Tailoring', categorySlug: 'tailoring', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&auto=format', provider: providers[5], rating: 4.9, bookings: 523 },
    { id: 's11', title: 'Bridal Makeup Package', description: 'Complete bridal makeup with HD finish, hairstyling, and draping assistance.', price: 8000, duration: '3-4 hrs', category: 'Beauty & Spa', categorySlug: 'beauty', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format', provider: providers[6], rating: 4.8, bookings: 178 },
    { id: 's12', title: 'JEE/NEET Coaching', description: 'Personalized coaching for JEE & NEET aspirants. Physics, Chemistry, and Mathematics.', price: 1500, duration: '2 hrs/session', category: 'Tutoring', categorySlug: 'tutoring', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format', provider: providers[7], rating: 4.7, bookings: 234 },
    { id: 's13', title: 'Water Tank Cleaning', description: 'Professional water tank cleaning and disinfection service.', price: 600, duration: '2-3 hrs', category: 'Cleaning', categorySlug: 'cleaning', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format', provider: providers[2], rating: 4.7, bookings: 198 },
    { id: 's14', title: 'Inverter & UPS Setup', description: 'Inverter installation, battery setup, and electrical backup solutions.', price: 800, duration: '2-3 hrs', category: 'Electrical', categorySlug: 'electrical', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format', provider: providers[1], rating: 4.4, bookings: 112 },
    { id: 's15', title: 'Hair Spa & Treatment', description: 'Premium hair spa with deep conditioning, keratin treatment, and scalp massage.', price: 1200, duration: '1.5 hrs', category: 'Beauty & Spa', categorySlug: 'beauty', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format', provider: providers[6], rating: 4.9, bookings: 267 },
    { id: 's16', title: 'Suit Stitching', description: 'Premium suit stitching with Italian fabric options and perfect tailoring.', price: 3500, duration: '5-7 days', category: 'Tailoring', categorySlug: 'tailoring', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format', provider: providers[5], rating: 4.8, bookings: 156 },
];

// ═══ Products ═══
export const products: ProductItem[] = [
    { id: 'pr1', title: 'Handmade Terracotta Vase', description: 'Beautiful hand-crafted terracotta vase with traditional Indian motifs. Perfect for home décor.', price: 650, images: ['https://images.unsplash.com/photo-1578749556935-ef38ab034c1c?w=600&auto=format'], artisan: providers[3], category: 'Home Décor', stock: 12, rating: 4.8, reviews: 45 },
    { id: 'pr2', title: 'Woven Bamboo Basket Set', description: 'Set of 3 hand-woven bamboo baskets. Eco-friendly and multipurpose.', price: 450, images: ['https://images.unsplash.com/photo-1595188730873-ce1df250325b?w=600&auto=format'], artisan: providers[3], category: 'Home Décor', stock: 8, rating: 4.6, reviews: 32 },
    { id: 'pr3', title: 'Handloom Cotton Saree', description: 'Premium handloom cotton saree with traditional weave patterns from Kanchipuram.', price: 2200, images: ['https://images.unsplash.com/photo-1610189012906-e7e01db05987?w=600&auto=format'], artisan: providers[5], category: 'Textiles', stock: 5, rating: 4.9, reviews: 89 },
    { id: 'pr4', title: 'Madhubani Painting', description: 'Authentic Madhubani painting on handmade paper. Traditional Bihar folk art.', price: 1800, images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format'], artisan: providers[4], category: 'Art', stock: 3, rating: 4.9, reviews: 67 },
    { id: 'pr5', title: 'Brass Diya Set (6 pcs)', description: 'Hand-forged brass diyas with intricate carvings. Perfect for festivals.', price: 850, images: ['https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format'], artisan: providers[3], category: 'Home Décor', stock: 20, rating: 4.7, reviews: 112 },
    { id: 'pr6', title: 'Jute Tote Bag', description: 'Handcrafted jute tote bag with leather handles. Sustainable and stylish.', price: 350, images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format'], artisan: providers[5], category: 'Accessories', stock: 25, rating: 4.5, reviews: 56 },
    { id: 'pr7', title: 'Wooden Chess Set', description: 'Hand-carved wooden chess set with Sheesham wood pieces and walnut board.', price: 1500, images: ['https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&auto=format'], artisan: providers[3], category: 'Games', stock: 7, rating: 4.8, reviews: 34 },
    { id: 'pr8', title: 'Embroidered Cushion Covers', description: 'Set of 4 hand-embroidered cushion covers with mirror work.', price: 900, images: ['https://images.unsplash.com/photo-1584100936595-c0c2989dae49?w=600&auto=format'], artisan: providers[5], category: 'Home Décor', stock: 15, rating: 4.6, reviews: 78 },
    { id: 'pr9', title: 'Copper Water Bottle', description: 'Pure copper water bottle with Ayurvedic health benefits. 1L capacity.', price: 550, images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format'], artisan: providers[3], category: 'Kitchen', stock: 30, rating: 4.7, reviews: 145 },
    { id: 'pr10', title: 'Block Print Bedsheet', description: 'King-size hand block-printed cotton bedsheet with 2 pillow covers. Jaipur style.', price: 1100, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format'], artisan: providers[5], category: 'Textiles', stock: 10, rating: 4.8, reviews: 92 },
    { id: 'pr11', title: 'Terracotta Tea Set', description: 'Hand-molded terracotta tea set with 4 cups and a kettle. Kulhad style.', price: 400, images: ['https://images.unsplash.com/photo-1563826904577-6b72c5d75e53?w=600&auto=format'], artisan: providers[3], category: 'Kitchen', stock: 18, rating: 4.5, reviews: 67 },
    { id: 'pr12', title: 'Kalamkari Wall Hanging', description: 'Hand-painted Kalamkari art on cotton canvas. Andhra Pradesh traditional art.', price: 2500, images: ['https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=600&auto=format'], artisan: providers[4], category: 'Art', stock: 4, rating: 4.9, reviews: 38 },
];

// ═══ Mock Bookings ═══
export const mockBookings: Booking[] = [
    { id: 'b1', service: services[0], provider: providers[0], status: 'in_progress', date: '2026-02-19', time: '10:00 AM', totalPrice: 800, createdAt: '2026-02-18T09:30:00', notes: 'Please bring extra pipe fittings' },
    { id: 'b2', service: services[4], provider: providers[2], status: 'accepted', date: '2026-02-20', time: '09:00 AM', totalPrice: 1200, createdAt: '2026-02-18T14:00:00' },
    { id: 'b3', service: services[9], provider: providers[5], status: 'pending', date: '2026-02-22', time: '11:00 AM', totalPrice: 800, createdAt: '2026-02-19T08:00:00', notes: 'Red silk fabric, round neck pattern' },
    { id: 'b4', service: services[2], provider: providers[1], status: 'completed', date: '2026-02-15', time: '02:00 PM', totalPrice: 1500, createdAt: '2026-02-14T16:00:00' },
    { id: 'b5', service: services[10], provider: providers[6], status: 'completed', date: '2026-02-10', time: '06:00 AM', totalPrice: 8000, createdAt: '2026-02-08T10:00:00' },
];

// ═══ Mock Conversations ═══
export const mockConversations: Conversation[] = [
    { id: 'c1', participant: providers[0], lastMessage: 'I will arrive by 10 AM with all necessary tools.', lastTime: '2 min ago', unread: 2 },
    { id: 'c2', participant: providers[2], lastMessage: 'Your booking is confirmed for tomorrow!', lastTime: '15 min ago', unread: 0 },
    { id: 'c3', participant: providers[5], lastMessage: 'Please send the fabric sample photo.', lastTime: '1 hr ago', unread: 1 },
    { id: 'c4', participant: providers[1], lastMessage: 'The wiring work has been completed. Please check.', lastTime: '2 days ago', unread: 0 },
];

// ═══ Mock Messages ═══
export const mockMessages: Record<string, Message[]> = {
    c1: [
        { id: 'm1', senderId: 'p1', receiverId: 'me', text: 'Hello! I received your booking for bathroom plumbing.', timestamp: '10:15 AM', read: true },
        { id: 'm2', senderId: 'me', receiverId: 'p1', text: 'Great! Can you bring extra pipe fittings just in case?', timestamp: '10:18 AM', read: true },
        { id: 'm3', senderId: 'p1', receiverId: 'me', text: 'Sure, I always carry extra materials. No worries!', timestamp: '10:20 AM', read: true },
        { id: 'm4', senderId: 'p1', receiverId: 'me', text: 'I will arrive by 10 AM with all necessary tools.', timestamp: '10:25 AM', read: false },
    ],
    c3: [
        { id: 'm5', senderId: 'p6', receiverId: 'me', text: 'Hi! I saw your order for designer blouse stitching.', timestamp: '9:00 AM', read: true },
        { id: 'm6', senderId: 'me', receiverId: 'p6', text: 'Yes, I want a round neck with puff sleeves.', timestamp: '9:05 AM', read: true },
        { id: 'm7', senderId: 'p6', receiverId: 'me', text: 'Please send the fabric sample photo.', timestamp: '9:10 AM', read: false },
    ],
};

// ═══ Reviews ═══
export const mockReviews: Review[] = [
    { id: 'r1', user: 'Meera Nair', avatar: 'https://i.pravatar.cc/150?img=1', rating: 5, comment: 'Rajesh was fantastic! Fixed our leaking tap quickly and professionally. Highly recommend!', date: '3 days ago' },
    { id: 'r2', user: 'Arun Kumar', avatar: 'https://i.pravatar.cc/150?img=3', rating: 4, comment: 'Good work on the electrical wiring. Arrived on time and was very professional.', date: '1 week ago' },
    { id: 'r3', user: 'Sneha Patel', avatar: 'https://i.pravatar.cc/150?img=10', rating: 5, comment: 'Anita did an amazing deep cleaning job. My house has never been this clean!', date: '2 weeks ago' },
    { id: 'r4', user: 'Rohit Verma', avatar: 'https://i.pravatar.cc/150?img=7', rating: 5, comment: 'Mohammad crafted a beautiful wardrobe exactly as per my design. True artist!', date: '3 weeks ago' },
    { id: 'r5', user: 'Kavya Reddy', avatar: 'https://i.pravatar.cc/150?img=20', rating: 4, comment: 'Priya stitched the most beautiful blouse for my wedding. Perfect fitting!', date: '1 month ago' },
];

// ═══ Stats ═══
export const platformStats = {
    providers: 2500, customers: 15000, bookings: 45000, cities: 12,
};

// ═══ Testimonials ═══
export const testimonials = [
    { name: 'Kavitha M.', role: 'Homeowner', text: 'Connect connected me with an amazing plumber within minutes. The real-time tracking gave me peace of mind!', avatar: 'https://i.pravatar.cc/150?img=21' },
    { name: 'Ravi Shankar', role: 'Carpenter', text: 'As a provider, this platform has doubled my income. I get consistent bookings and the payments are always on time.', avatar: 'https://i.pravatar.cc/150?img=22' },
    { name: 'Fatima B.', role: 'Artisan', text: 'I sell my handmade products to customers all over the city. Connect gave my craft a digital storefront.', avatar: 'https://i.pravatar.cc/150?img=23' },
];
