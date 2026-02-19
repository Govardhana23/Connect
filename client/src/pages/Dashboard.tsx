import { Link } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, MessageCircle, Package, ArrowUpRight } from 'lucide-react';
import { mockBookings, mockConversations } from '../lib/mockData';
import { useAuth } from '../context/AuthContext';
import type { BookingStatus } from '../lib/mockData';

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: 'var(--warning)', bg: 'rgba(253,203,110,0.15)' },
    accepted: { label: 'Accepted', color: 'var(--accent-light)', bg: 'rgba(108,92,231,0.15)' },
    in_progress: { label: 'In Progress', color: 'var(--success)', bg: 'rgba(0,184,148,0.15)' },
    completed: { label: 'Completed', color: 'var(--text-muted)', bg: 'rgba(100,100,150,0.15)' },
    cancelled: { label: 'Cancelled', color: 'var(--danger)', bg: 'rgba(225,112,85,0.15)' },
};

const Dashboard = () => {
    const { user } = useAuth();
    const activeBookings = mockBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
    const completedBookings = mockBookings.filter(b => b.status === 'completed');
    const totalSpent = completedBookings.reduce((s, b) => s + b.totalPrice, 0);

    return (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
            {/* Greeting */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 6 }}>Welcome back, {user?.name || 'User'} 👋</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Here's what's happening with your bookings today</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                {[
                    { icon: <Calendar size={22} />, label: 'Active Bookings', value: activeBookings.length, color: 'var(--accent-light)' },
                    { icon: <Package size={22} />, label: 'Completed', value: completedBookings.length, color: 'var(--success)' },
                    { icon: <TrendingUp size={22} />, label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, color: 'var(--warning)' },
                    { icon: <MessageCircle size={22} />, label: 'Unread Messages', value: mockConversations.reduce((s, c) => s + c.unread, 0), color: 'var(--danger)' },
                ].map((stat, i) => (
                    <div key={i} className="card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>{stat.icon}</div>
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{stat.value}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
                {/* Active Bookings */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Active Bookings</h2>
                        <Link to="/bookings" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>View All <ArrowUpRight size={14} /></Link>
                    </div>
                    {activeBookings.length === 0 ? (
                        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                            <p style={{ fontSize: '2rem', marginBottom: 8 }}>📋</p>
                            <p>No active bookings</p>
                            <Link to="/services" className="btn-primary" style={{ marginTop: 16, display: 'inline-block', textDecoration: 'none', padding: '10px 24px', fontSize: '0.85rem' }}>Browse Services</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {activeBookings.map(booking => {
                                const status = statusConfig[booking.status];
                                return (
                                    <div key={booking.id} className="card" style={{ padding: 20 }}>
                                        <div style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
                                            <img src={booking.service.image} alt="" style={{ width: 70, height: 70, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{booking.service.title}</h4>
                                                    <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, color: status.color, background: status.bg }}>{status.label}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                                    <img src={booking.provider.avatar} alt="" style={{ width: 20, height: 20, borderRadius: '50%' }} />
                                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{booking.provider.name}</span>
                                                    {booking.provider.isOnline && <span className="online-dot" style={{ width: 6, height: 6 }} />}
                                                </div>
                                                <div style={{ display: 'flex', gap: 16, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {booking.date}</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {booking.time}</span>
                                                    <span style={{ fontWeight: 600, color: 'var(--accent-light)' }}>₹{booking.totalPrice}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {booking.status === 'in_progress' && (
                                            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span className="online-dot" /> <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>Provider is en route • Live tracking active</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div>
                    {/* Recent Messages */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Messages</h3>
                            <Link to="/chat" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontSize: '0.85rem' }}>View All</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {mockConversations.slice(0, 3).map(conv => (
                                <Link to="/chat" key={conv.id} className="card" style={{ padding: 16, textDecoration: 'none' }}>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <div style={{ position: 'relative' }}>
                                            <img src={conv.participant.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                                            {conv.participant.isOnline && <span className="online-dot" style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, border: '2px solid var(--bg-card)' }} />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{conv.participant.name}</span>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{conv.lastTime}</span>
                                            </div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.lastMessage}</p>
                                        </div>
                                        {conv.unread > 0 && <span style={{ minWidth: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{conv.unread}</span>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card" style={{ padding: 20 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { to: '/services', label: 'Book a Service', icon: '🔧' },
                                { to: '/marketplace', label: 'Browse Marketplace', icon: '🛒' },
                                { to: '/profile', label: 'Edit Profile', icon: '👤' },
                            ].map(action => (
                                <Link key={action.to} to={action.to} className="card" style={{ padding: '12px 16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: '1.2rem' }}>{action.icon}</span>
                                    <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>{action.label}</span>
                                    <ArrowUpRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
