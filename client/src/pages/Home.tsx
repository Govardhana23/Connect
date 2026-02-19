import { Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Star, Shield, Zap, TrendingUp, ChevronRight } from 'lucide-react';
import { categories, services, platformStats, testimonials } from '../lib/mockData';
import { useState, useEffect } from 'react';

const AnimatedCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const duration = 2000;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
            setCount(prev => { const next = prev + step; return next >= target ? target : next; });
        }, 16);
        return () => clearInterval(timer);
    }, [target]);
    return <span>{count.toLocaleString()}{suffix}</span>;
};

const Home = () => {
    const trendingServices = services.sort((a, b) => b.bookings - a.bookings).slice(0, 4);

    return (
        <div>
            {/* ═══ HERO ═══ */}
            <section style={{ background: 'var(--gradient-hero)', padding: '100px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(108,92,231,0.06)', top: -200, right: -100 }} />
                <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(162,155,254,0.04)', bottom: -100, left: -50 }} />

                <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div className="badge badge-accent animate-fade-in" style={{ marginBottom: 20 }}>
                        <Zap size={14} /> Trusted by 15,000+ customers
                    </div>
                    <h1 className="animate-fade-in-up" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
                        Find Local Experts<br />
                        <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Instantly</span>
                    </h1>
                    <p className="animate-fade-in-up stagger-1" style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.7 }}>
                        Connect with verified service providers, artisans, and professionals in your neighborhood. Book, track, and pay — all in real-time.
                    </p>

                    {/* Search Bar */}
                    <div className="animate-fade-in-up stagger-2 glass" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: 12, borderRadius: 'var(--radius-lg)', maxWidth: 700, margin: '0 auto' }}>
                        <div style={{ flex: 1, minWidth: 150, position: 'relative' }}>
                            <MapPin size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input className="input" placeholder="Your Location" style={{ paddingLeft: 40, background: 'var(--bg-card)' }} />
                        </div>
                        <div style={{ flex: 2, minWidth: 200, position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input className="input" placeholder="Search plumber, electrician, tailor..." style={{ paddingLeft: 40, background: 'var(--bg-card)' }} />
                        </div>
                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            Search <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ═══ CATEGORIES ═══ */}
            <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Browse by Category</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Explore 8 service categories across your city</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
                    {categories.map((cat, i) => (
                        <Link to={`/services?category=${cat.slug}`} key={cat.slug} className={`card animate-fade-in-up stagger-${i % 6 + 1}`}
                            style={{ padding: 24, textAlign: 'center', textDecoration: 'none', cursor: 'pointer' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{cat.icon}</div>
                            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, fontSize: '0.95rem' }}>{cat.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══ TRENDING SERVICES ═══ */}
            <section style={{ background: 'var(--bg-secondary)', padding: '80px 24px' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
                                <TrendingUp size={28} style={{ display: 'inline', marginRight: 10, color: 'var(--accent-light)' }} />
                                Trending Services
                            </h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Most booked services this week</p>
                        </div>
                        <Link to="/services" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.9rem' }}>
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                        {trendingServices.map((svc) => (
                            <Link to={`/services/${svc.id}`} key={svc.id} className="card" style={{ textDecoration: 'none', overflow: 'hidden' }}>
                                <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                                    <img src={svc.image} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                        onMouseEnter={e => (e.target as HTMLImageElement).style.transform = 'scale(1.05)'}
                                        onMouseLeave={e => (e.target as HTMLImageElement).style.transform = 'scale(1)'} />
                                    <span className="badge badge-accent" style={{ position: 'absolute', top: 12, right: 12 }}>{svc.bookings} booked</span>
                                </div>
                                <div style={{ padding: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                                        <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{svc.title}</h3>
                                        <span className="badge badge-success"><Star size={12} /> {svc.rating}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                        <img src={svc.provider.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{svc.provider.name}</span>
                                        {svc.provider.isOnline && <span className="online-dot" style={{ width: 6, height: 6 }} />}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--accent-light)', fontSize: '1.1rem' }}>₹{svc.price}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{svc.duration}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ STATS ═══ */}
            <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                    {[
                        { label: 'Service Providers', value: platformStats.providers, suffix: '+', icon: '👷' },
                        { label: 'Happy Customers', value: platformStats.customers, suffix: '+', icon: '😊' },
                        { label: 'Bookings Completed', value: platformStats.bookings, suffix: '+', icon: '📋' },
                        { label: 'Cities Covered', value: platformStats.cities, suffix: '', icon: '🏙️' },
                    ].map((stat, i) => (
                        <div key={i} className="card" style={{ padding: 32, textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{stat.icon}</div>
                            <div className="animate-count-up" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-light)', marginBottom: 4 }}>
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ HOW IT WORKS ═══ */}
            <section style={{ background: 'var(--bg-secondary)', padding: '80px 24px' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 48 }}>How It Works</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
                        {[
                            { step: '01', title: 'Search & Discover', desc: 'Find the perfect service provider near you. Filter by category, rating, and availability.', icon: '🔍' },
                            { step: '02', title: 'Book Instantly', desc: 'Choose your preferred time slot and book with a single tap. No waiting.', icon: '📱' },
                            { step: '03', title: 'Track in Real-Time', desc: 'Follow your provider on the map and get live status updates via chat.', icon: '📡' },
                            { step: '04', title: 'Pay & Review', desc: 'Pay securely after service completion. Rate providers to help the community.', icon: '⭐' },
                        ].map((item, i) => (
                            <div key={i} className={`animate-fade-in-up stagger-${i + 1}`} style={{ position: 'relative' }}>
                                <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-sm)', background: 'rgba(108,92,231,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 16px' }}>{item.icon}</div>
                                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', color: 'var(--accent)', fontSize: '3rem', fontWeight: 900, opacity: 0.1 }}>{item.step}</div>
                                <h3 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ TESTIMONIALS ═══ */}
            <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: 48 }}>What Our Users Say</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                    {testimonials.map((t, i) => (
                        <div key={i} className="card" style={{ padding: 28 }}>
                            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="var(--warning)" color="var(--warning)" />)}
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <img src={t.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t.name}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ TRUST ═══ */}
            <section style={{ background: 'var(--bg-secondary)', padding: '60px 24px' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
                    {[
                        { icon: <Shield size={24} />, text: '100% Verified Providers' },
                        { icon: <Zap size={24} />, text: 'Real-Time Tracking' },
                        { icon: <Star size={24} />, text: '4.8★ Average Rating' },
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-secondary)' }}>
                            <div style={{ color: 'var(--accent-light)' }}>{item.icon}</div>
                            <span style={{ fontWeight: 600 }}>{item.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section style={{ padding: '100px 24px', textAlign: 'center', position: 'relative' }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 16 }}>Ready to Get Started?</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1.1rem' }}>Join 15,000+ users who trust Connect for local services</p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '14px 36px' }}>
                            Sign Up Free <ArrowRight size={18} style={{ display: 'inline', marginLeft: 8 }} />
                        </Link>
                        <Link to="/services" className="btn-ghost" style={{ textDecoration: 'none', fontSize: '1rem', padding: '14px 36px' }}>Browse Services</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
