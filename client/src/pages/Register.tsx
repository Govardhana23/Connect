import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CUSTOMER');
    const [loading, setLoading] = useState(false);
    const { register, loginWithGoogle } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) { addToast('Password must be at least 6 characters', 'warning'); return; }
        setLoading(true);
        try {
            await register(name, email, password, role);
            addToast('Account created! Welcome to Connect.', 'success');
            navigate('/dashboard');
        } catch { addToast('Registration failed. Email may already exist.', 'error'); }
        finally { setLoading(false); }
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            addToast('Signed up with Google!', 'success');
            navigate('/dashboard');
        } catch { addToast('Google sign-up failed.', 'error'); }
        finally { setLoading(false); }
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 6 }}>Create Account</h2>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: 24, fontSize: '0.9rem' }}>Join the local services revolution</p>

            {/* Google Sign-Up */}
            <button onClick={handleGoogleSignUp} disabled={loading}
                style={{
                    width: '100%', padding: '14px 20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                    background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.3s',
                    marginBottom: 20, opacity: loading ? 0.7 : 1,
                }}>
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                {loading ? 'Connecting...' : 'Sign up with Google'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>or sign up with email</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Full Name</label>
                    <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Email</label>
                    <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Password</label>
                    <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required />
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 10 }}>I want to...</label>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {[{ val: 'CUSTOMER', label: '🛒 Hire Services', desc: 'Find & book pros' }, { val: 'PROVIDER', label: '🔧 Offer Services', desc: 'Grow your business' }].map(opt => (
                            <button key={opt.val} type="button" onClick={() => setRole(opt.val)} style={{
                                flex: 1, padding: '14px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s',
                                background: role === opt.val ? 'rgba(108,92,231,0.2)' : 'var(--bg-secondary)',
                                border: `2px solid ${role === opt.val ? 'var(--accent)' : 'var(--border)'}`,
                                color: role === opt.val ? 'var(--accent-light)' : 'var(--text-secondary)',
                            }}>
                                <div style={{ fontSize: '1.1rem', marginBottom: 4 }}>{opt.label}</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{opt.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 8, opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
            </p>
        </div>
    );
};

export default Register;
