import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-hero)', padding: 24, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(108,92,231,0.08)', top: -100, right: -100 }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(162,155,254,0.06)', bottom: -50, left: -50 }} />

        <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
                <img src="/connect.jpg" alt="Connect Logo" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }} />
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Connect</span>
            </Link>
            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: 36 }}>
                <Outlet />
            </div>
        </div>
    </div>
);

export default AuthLayout;
