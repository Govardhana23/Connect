import { useState, useMemo, useEffect } from 'react';
import { Search, ShoppingCart, ChevronDown } from 'lucide-react';
import { productAPI } from '../lib/api';
import { products as mockProducts } from '../lib/mockData';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

const Marketplace = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [sortBy, setSortBy] = useState('popular');
    const { addItem, totalItems } = useCart();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productAPI.getProducts();
                if (res.data && res.data.length > 0) {
                    setProducts(res.data);
                } else {
                    // Fallback to mock data if API returns empty
                    setProducts(mockProducts.map(p => ({
                        ...p,
                        images: p.images.join(','),
                        artisan: { name: p.artisan.name }
                    })));
                }
            } catch (err) {
                console.warn('API unavailable, using local data');
                setProducts(mockProducts.map(p => ({
                    ...p,
                    images: p.images.join(','),
                    artisan: { name: p.artisan.name }
                })));
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const productCategories = useMemo(() => ['All', ...new Set(products.map(p => p.category || 'Other'))], [products]);

    const filtered = useMemo(() => {
        let result = [...products];
        if (category !== 'All') result = result.filter(p => p.category === category);
        if (search) result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
        if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
        return result;
    }, [search, category, sortBy, products]);

    if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Loading marketplace...</div>;

    return (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Artisan Marketplace</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Buy authentic handmade products directly from local artisans</p>
                </div>
                <Link to="/checkout" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', position: 'relative' }}>
                    <ShoppingCart size={20} /> Cart
                    {totalItems > 0 && <span className="badge badge-accent">{totalItems}</span>}
                </Link>
            </div>

            {/* Search + Sort */}
            <div className="glass" style={{ padding: 16, borderRadius: 'var(--radius)', marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 2, minWidth: 200, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ paddingLeft: 40 }} />
                </div>
                <div style={{ position: 'relative', minWidth: 160 }}>
                    <select className="input" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ appearance: 'none', paddingRight: 32, cursor: 'pointer' }}>
                        <option value="popular">Most Popular</option>
                        <option value="price-low">Price: Low → High</option>
                        <option value="price-high">Price: High → Low</option>
                    </select>
                    <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                </div>
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 32, paddingBottom: 8 }}>
                {productCategories.map(cat => (
                    <button key={cat as string} onClick={() => setCategory(cat as string)} style={{
                        padding: '8px 20px', border: 'none', borderRadius: 999, cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 500, fontSize: '0.85rem', transition: 'all 0.2s',
                        background: category === cat ? 'var(--accent)' : 'var(--bg-card)',
                        color: category === cat ? '#fff' : 'var(--text-secondary)',
                    }}>{cat as string}</button>
                ))}
            </div>

            {/* Product Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                {filtered.map(product => (
                    <div key={product.id} className="card" style={{ overflow: 'hidden' }}>
                        <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                            <img src={product.images ? (typeof product.images === 'string' ? product.images.split(',')[0] : product.images[0]) : 'https://placehold.co/400'} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {product.stock < 5 && <span className="badge badge-warning" style={{ position: 'absolute', top: 12, right: 12 }}>Only {product.stock} left</span>}
                        </div>
                        <div style={{ padding: 20 }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>{product.category || 'General'}</span>
                            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', margin: '6px 0', fontSize: '1rem' }}>{product.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>

                            {product.artisan && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>By {typeof product.artisan === 'string' ? product.artisan : product.artisan.name}</span>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                                <span style={{ fontWeight: 700, color: 'var(--accent-light)', fontSize: '1.1rem' }}>₹{product.price}</span>
                                <button onClick={() => { addItem(product); addToast(`${product.title} added to cart`, 'success'); }} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                        No products found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
