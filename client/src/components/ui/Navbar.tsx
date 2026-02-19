import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Bell, LogOut, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { totalItems } = useCart();
    const location = useLocation();

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/services', label: 'Services' },
        { to: '/marketplace', label: 'Marketplace' },
        ...(isAuthenticated ? [
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/bookings', label: 'Bookings' },
            { to: '/chat', label: 'Chat' },
        ] : []),
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border)' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src="/connect.jpg" alt="Connect Logo" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }} />
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Connect</span>
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
                    {navLinks.map(link => (
                        <Link key={link.to} to={link.to} style={{
                            textDecoration: 'none', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s',
                            color: isActive(link.to) ? 'var(--accent-light)' : 'var(--text-secondary)',
                            background: isActive(link.to) ? 'rgba(108,92,231,0.15)' : 'transparent',
                        }}>
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {isAuthenticated && (
                        <>
                            <Link to="/chat" style={{ position: 'relative', color: 'var(--text-secondary)', padding: 8 }}>
                                <MessageCircle size={20} />
                                <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)' }} />
                            </Link>
                            <button onClick={() => setShowNotif(!showNotif)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 8 }}>
                                <Bell size={20} />
                                <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
                            </button>
                        </>
                    )}

                    <Link to="/marketplace" style={{ position: 'relative', color: 'var(--text-secondary)', padding: 8 }}>
                        <ShoppingCart size={20} />
                        {totalItems > 0 && (
                            <span style={{ position: 'absolute', top: 0, right: 0, width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                                <img src={user?.avatar || 'https://i.pravatar.cc/150?img=68'} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--accent)' }} />
                                <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }} className="desktop-nav">{user?.name}</span>
                            </Link>
                            <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }} className="desktop-nav">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
                            <Link to="/login" className="btn-ghost" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Log In</Link>
                            <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem', textDecoration: 'none' }}>Sign Up</Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-toggle" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: 4, display: 'none' }}>
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Notification Dropdown */}
                {showNotif && (
                    <div className="glass animate-fade-in" style={{ position: 'absolute', top: 70, right: 80, width: 320, borderRadius: 'var(--radius)', padding: 16 }}>
                        <h4 style={{ fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Notifications</h4>
                        {[
                            { text: 'Rajesh accepted your booking', time: '2m ago', color: 'var(--success)' },
                            { text: 'New message from Priya', time: '15m ago', color: 'var(--accent-light)' },
                            { text: 'Your order has been shipped', time: '1h ago', color: 'var(--warning)' },
                        ].map((n, i) => (
                            <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', display: 'flex', gap: 10, alignItems: 'center' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.color, flexShrink: 0 }} />
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{n.text}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="glass animate-fade-in" style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
                    {navLinks.map(link => (
                        <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                            style={{ display: 'block', padding: '12px 16px', textDecoration: 'none', color: isActive(link.to) ? 'var(--accent-light)' : 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', fontWeight: 500 }}>
                            {link.label}
                        </Link>
                    ))}
                    {!isAuthenticated && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <Link to="/login" className="btn-ghost" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Log In</Link>
                            <Link to="/register" className="btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>Sign Up</Link>
                        </div>
                    )}
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
