import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, Clock, ChevronDown } from 'lucide-react';
import { marketplaceAPI } from '../lib/api';
import { services as mockServices, categories as mockCategories } from '../lib/mockData';

const Services = () => {
    const [searchParams] = useSearchParams();
    const [services, setServices] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [sortBy, setSortBy] = useState('popular');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

    const categoryImages: Record<string, string> = {
        plumbing: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format',
        electrical: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format',
        cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format',
        carpentry: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&auto=format',
        painting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format',
        tailoring: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&auto=format',
        beauty: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format',
        tutoring: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, svcsRes] = await Promise.all([
                    marketplaceAPI.getCategories(),
                    marketplaceAPI.getServices()
                ]);
                const cats = catsRes.data;
                const svcs = svcsRes.data;

                if (svcs && svcs.length > 0) {
                    setCategories(cats);
                    setServices(svcs);
                } else {
                    // Fallback to mock
                    setCategories(mockCategories);
                    setServices(mockServices);
                }
            } catch (err) {
                console.warn('API unavailable, using local data');
                setCategories(mockCategories);
                setServices(mockServices);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filtered = useMemo(() => {
        let result = [...services];
        if (selectedCategory !== 'all') {
            result = result.filter(s => {
                // Support both DB format (s.category?.slug) and mock format (s.categorySlug)
                const slug = s.category?.slug || s.categorySlug;
                return slug === selectedCategory;
            });
        }
        if (search) {
            result = result.filter(s => {
                const providerName = s.provider?.user?.name || s.provider?.name || '';
                return s.title.toLowerCase().includes(search.toLowerCase()) || providerName.toLowerCase().includes(search.toLowerCase());
            });
        }
        result = result.filter(s => s.price >= priceRange[0] && s.price <= priceRange[1]);
        if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
        return result;
    }, [search, selectedCategory, sortBy, priceRange, services]);

    if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Loading services...</div>;

    return (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Find Services</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Discover verified service providers near you</p>
            </div>

            {/* Search & Filter Bar */}
            <div className="glass" style={{ padding: 16, borderRadius: 'var(--radius)', marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 2, minWidth: 200, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="input" placeholder="Search services, providers..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
                </div>
                <div style={{ position: 'relative', minWidth: 160 }}>
                    <select className="input" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ appearance: 'none', paddingRight: 32, cursor: 'pointer' }}>
                        <option value="popular">Most Popular</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                    <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                </div>
                <button onClick={() => setShowFilters(!showFilters)} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="glass animate-fade-in" style={{ padding: 20, borderRadius: 'var(--radius)', marginBottom: 24 }}>
                    <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Price Range</h4>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                        <input className="input" type="number" placeholder="Min" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} style={{ width: 120 }} />
                        <span style={{ color: 'var(--text-muted)' }}>to</span>
                        <input className="input" type="number" placeholder="Max" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} style={{ width: 120 }} />
                    </div>
                </div>
            )}

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 8 }}>
                <button onClick={() => setSelectedCategory('all')} className={selectedCategory === 'all' ? 'badge badge-accent' : 'badge'}
                    style={{ cursor: 'pointer', border: 'none', padding: '8px 16px', whiteSpace: 'nowrap', background: selectedCategory === 'all' ? undefined : 'var(--bg-card)', color: selectedCategory === 'all' ? undefined : 'var(--text-secondary)' }}>All</button>
                {categories.map((cat: any) => (
                    <button key={cat.slug} onClick={() => setSelectedCategory(cat.slug)}
                        className={selectedCategory === cat.slug ? 'badge badge-accent' : 'badge'}
                        style={{ cursor: 'pointer', border: 'none', padding: '8px 16px', whiteSpace: 'nowrap', background: selectedCategory === cat.slug ? undefined : 'var(--bg-card)', color: selectedCategory === cat.slug ? undefined : 'var(--text-secondary)' }}>
                        {cat.icon} {cat.name}
                    </button>
                ))}
            </div>

            {/* Service Grid */}
            <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: '0.85rem' }}>{filtered.length} services found</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {filtered.map(svc => {
                    const providerName = svc.provider?.user?.name || svc.provider?.name || 'Unknown';
                    const providerRating = svc.provider?.rating || svc.rating || 4.5;
                    const providerVerified = svc.provider?.isVerified !== undefined ? svc.provider.isVerified : true;
                    const catSlug = svc.category?.slug || svc.categorySlug || '';
                    const catName = svc.category?.name || (typeof svc.category === 'string' ? svc.category : '') || 'General';
                    const catIcon = svc.category?.icon || '🔧';
                    const image = svc.image || categoryImages[catSlug] || '';
                    const durationLabel = typeof svc.duration === 'number' ? `${svc.duration}m` : (svc.duration || 'N/A');

                    return (
                        <Link to={`/services/${svc.id}`} key={svc.id} className="card" style={{ textDecoration: 'none', overflow: 'hidden' }}>
                            <div style={{ height: 170, overflow: 'hidden', position: 'relative' }}>
                                {image ? (
                                    <img src={image} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: '#f3f4f6' }}>
                                        {catIcon}
                                    </div>
                                )}
                                <span className="badge badge-accent" style={{ position: 'absolute', top: 12, left: 12 }}>{catName}</span>
                            </div>
                            <div style={{ padding: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{svc.title}</h3>
                                    <span className="badge badge-success" style={{ flexShrink: 0 }}><Star size={10} /> {providerRating}</span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{svc.description}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    {svc.provider?.avatar ? (
                                        <img src={svc.provider.avatar} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} />
                                    ) : (
                                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                                            {providerName[0]}
                                        </div>
                                    )}
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{providerName}</span>
                                    {providerVerified && <span style={{ color: 'var(--accent-light)', fontSize: '0.75rem' }}>✓</span>}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                                    <span style={{ fontWeight: 700, color: 'var(--accent-light)', fontSize: '1.05rem' }}>₹{svc.price}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {durationLabel}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No services found</p>
                    <p>Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default Services;
