import { useState } from 'react';
import { Calendar, Clock, Star } from 'lucide-react';
import { mockBookings } from '../lib/mockData';
import { useToast } from '../context/ToastContext';
import type { BookingStatus } from '../lib/mockData';

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: 'var(--warning)', bg: 'rgba(253,203,110,0.15)' },
    accepted: { label: 'Accepted', color: 'var(--accent-light)', bg: 'rgba(108,92,231,0.15)' },
    in_progress: { label: 'In Progress', color: 'var(--success)', bg: 'rgba(0,184,148,0.15)' },
    completed: { label: 'Completed', color: 'var(--text-muted)', bg: 'rgba(100,100,150,0.15)' },
    cancelled: { label: 'Cancelled', color: 'var(--danger)', bg: 'rgba(225,112,85,0.15)' },
};

const allStatuses: BookingStatus[] = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];

const Bookings = () => {
    const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
    const { addToast } = useToast();
    const [bookings, setBookings] = useState(mockBookings);

    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

    const cancelBooking = (id: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as BookingStatus } : b));
        addToast('Booking cancelled', 'info');
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>My Bookings</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Manage all your service bookings</p>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 32, paddingBottom: 8 }}>
                <button onClick={() => setFilter('all')} style={{
                    padding: '8px 20px', border: 'none', borderRadius: 999, cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', transition: 'all 0.2s',
                    background: filter === 'all' ? 'var(--accent)' : 'var(--bg-card)', color: filter === 'all' ? '#fff' : 'var(--text-secondary)',
                }}>All ({bookings.length})</button>
                {allStatuses.map(status => {
                    const cfg = statusConfig[status];
                    const count = bookings.filter(b => b.status === status).length;
                    return (
                        <button key={status} onClick={() => setFilter(status)} style={{
                            padding: '8px 20px', border: 'none', borderRadius: 999, cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', transition: 'all 0.2s', whiteSpace: 'nowrap',
                            background: filter === status ? cfg.bg : 'var(--bg-card)', color: filter === status ? cfg.color : 'var(--text-secondary)',
                        }}>{cfg.label} ({count})</button>
                    );
                })}
            </div>

            {/* Booking List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filtered.map(booking => {
                    const status = statusConfig[booking.status];
                    return (
                        <div key={booking.id} className="card animate-fade-in" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', gap: 20, alignItems: 'start' }}>
                                <img src={booking.service.image} alt="" style={{ width: 100, height: 100, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                                        <div>
                                            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{booking.service.title}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <img src={booking.provider.avatar} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} />
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{booking.provider.name}</span>
                                            </div>
                                        </div>
                                        <span style={{ padding: '6px 16px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600, color: status.color, background: status.bg }}>{status.label}</span>
                                    </div>

                                    <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.85rem' }}><Calendar size={14} /> {booking.date}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.85rem' }}><Clock size={14} /> {booking.time}</span>
                                        <span style={{ fontWeight: 700, color: 'var(--accent-light)' }}>₹{booking.totalPrice}</span>
                                    </div>
                                    {booking.notes && <p style={{ marginTop: 10, color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>📝 {booking.notes}</p>}

                                    {/* Actions */}
                                    {(booking.status === 'pending' || booking.status === 'accepted') && (
                                        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                                            <button onClick={() => cancelBooking(booking.id)} style={{ padding: '8px 16px', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>Cancel</button>
                                        </div>
                                    )}

                                    {booking.status === 'completed' && (
                                        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Rate this service:</span>
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} style={{ cursor: 'pointer', color: 'var(--warning)', fill: s <= 4 ? 'var(--warning)' : 'transparent' }} />)}
                                        </div>
                                    )}

                                    {booking.status === 'in_progress' && (
                                        <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(0,184,148,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span className="online-dot" /> <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>Provider is working • Live tracking active</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Bookings;
