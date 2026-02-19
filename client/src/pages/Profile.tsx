import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { MapPin, Mail, Phone, Edit2, Save, User as UserIcon, LogOut } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const { addToast } = useToast();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');

    const save = () => { setEditing(false); addToast('Profile updated!', 'success'); };

    const getInitials = (n: string) => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const memberSince = user ? new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '';

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 32 }}>My Profile</h1>

            <div className="card" style={{ padding: 32, marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 24, alignItems: 'start', marginBottom: 32 }}>
                    {user?.avatar ? (
                        <img src={user.avatar} alt="" style={{ width: 90, height: 90, borderRadius: '50%', border: '3px solid var(--accent)', objectFit: 'cover' }} />
                    ) : (
                        <div style={{
                            width: 90, height: 90, borderRadius: '50%', border: '3px solid var(--accent)',
                            background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.8rem', fontWeight: 800, color: '#fff',
                        }}>
                            {user?.name ? getInitials(user.name) : <UserIcon size={36} />}
                        </div>
                    )}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: 4 }}>{user?.name || 'Guest'}</h2>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                    <span className="badge badge-accent">{user?.role || 'CUSTOMER'}</span>
                                </div>
                                {user?.email && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> {user.email}</p>
                                )}
                                {user?.phone && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}><Phone size={14} /> {user.phone}</p>
                                )}
                                {location && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}><MapPin size={14} /> {location}</p>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => editing ? save() : setEditing(true)} className={editing ? 'btn-primary' : 'btn-ghost'} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {editing ? <><Save size={16} />Save</> : <><Edit2 size={16} />Edit</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Full Name</label>
                        <input className="input" value={name} onChange={e => setName(e.target.value)} disabled={!editing} style={{ opacity: editing ? 1 : 0.6 }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Phone</label>
                        <input className="input" value={phone} onChange={e => setPhone(e.target.value)} disabled={!editing} placeholder={editing ? 'Enter phone number' : 'Not set'} style={{ opacity: editing ? 1 : 0.6 }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Location</label>
                        <input className="input" value={location} onChange={e => setLocation(e.target.value)} disabled={!editing} placeholder={editing ? 'Enter your location' : 'Not set'} style={{ opacity: editing ? 1 : 0.6 }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Bio</label>
                        <textarea className="input" value={bio} onChange={e => setBio(e.target.value)} disabled={!editing} rows={3} placeholder={editing ? 'Tell us about yourself' : 'Not set'} style={{ opacity: editing ? 1 : 0.6, resize: 'vertical' }} />
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Account Info</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {[
                        { label: 'Auth Method', value: user?.email ? 'Email' : user?.phone ? 'Phone' : 'Google', icon: '🔐' },
                        { label: 'Role', value: user?.role || 'Customer', icon: '👤' },
                        { label: 'Member Since', value: memberSince, icon: '📅' },
                    ].map((s, i) => (
                        <div key={i} style={{ textAlign: 'center', padding: 16, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.icon}</div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-light)' }}>{s.value}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={logout} className="btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                <LogOut size={16} /> Sign Out
            </button>
        </div>
    );
};

export default Profile;
