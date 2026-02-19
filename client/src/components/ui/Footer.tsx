import { Link } from 'react-router-dom';

const Footer = () => (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', marginTop: 80 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px 30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
                {/* Brand */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <img src="/connect.jpg" alt="Connect Logo" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }} />
                        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>Connect</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 280 }}>
                        Connecting local service providers and artisans with their communities. Empowering Tier-2 & Tier-3 India.
                    </p>
                </div>

                {/* Services */}
                <div>
                    <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>Services</h4>
                    {['Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Beauty & Spa', 'Tutoring'].map(s => (
                        <Link key={s} to="/services" style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', padding: '4px 0', fontSize: '0.85rem', transition: 'color 0.2s' }}
                            onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--accent-light)'}
                            onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--text-muted)'}
                        >{s}</Link>
                    ))}
                </div>

                {/* Company */}
                <div>
                    <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>Company</h4>
                    {['About Us', 'Careers', 'Partner with Us', 'Blog', 'Press Kit'].map(s => (
                        <a key={s} href="#" style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', padding: '4px 0', fontSize: '0.85rem' }}>{s}</a>
                    ))}
                </div>

                {/* Newsletter */}
                <div>
                    <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>Stay Updated</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 12 }}>Get the latest updates on new services and offers.</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input className="input" placeholder="your@email.com" style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem' }} />
                        <button className="btn-primary" style={{ padding: '10px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Subscribe</button>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
                        {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map(s => (
                            <a key={s} href="#" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={e => (e.target as HTMLElement).style.color = 'var(--accent-light)'}
                                onMouseLeave={e => (e.target as HTMLElement).style.color = 'var(--text-muted)'}
                            >{s}</a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>© {new Date().getFullYear()} Connect. Built for Bharat 🇮🇳</p>
                <div style={{ display: 'flex', gap: 20 }}>
                    {['Privacy Policy', 'Terms of Service', 'Support'].map(s => (
                        <a key={s} href="#" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>{s}</a>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
