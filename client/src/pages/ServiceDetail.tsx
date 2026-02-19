import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Shield, MapPin, ChevronLeft, Calendar, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { marketplaceAPI } from '../lib/api';
import { services as mockServices, mockReviews } from '../lib/mockData';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [svc, setSvc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [notes, setNotes] = useState('');

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
        const fetchService = async () => {
            if (!id) return;
            try {
                const res = await marketplaceAPI.getServiceById(id);
                if (res.data) {
                    setSvc(res.data);
                } else {
                    // Fallback to mock
                    setSvc(mockServices.find(s => s.id === id) || null);
                }
            } catch (err) {
                console.warn('API unavailable, using local data');
                setSvc(mockServices.find(s => s.id === id) || null);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

    const handleBooking = () => {
        if (!selectedDate || !selectedTime) { addToast('Please select a date and time', 'warning'); return; }
        addToast(`Booking confirmed for ${selectedDate} at ${selectedTime}!`, 'success');
        navigate('/bookings');
    };

    if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Loading service...</div>;
    if (!svc) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}><p style={{ fontSize: '3rem' }}>😕</p><p>Service not found</p><Link to="/services" style={{ color: 'var(--accent-light)' }}>Back to Services</Link></div>;

    // Normalize data for both mock and DB formats
    const providerName = svc.provider?.user?.name || svc.provider?.name || 'Provider';
    const providerAvatar = svc.provider?.avatar || svc.provider?.user?.avatar;
    const providerBio = svc.provider?.bio || 'Professional service provider.';
    const providerLocation = svc.provider?.location || 'Bangalore';
    const providerRating = svc.provider?.rating || svc.rating || 4.5;
    const providerReviewCount = svc.provider?.reviewCount || 0;
    const providerVerified = svc.provider?.isVerified !== undefined ? svc.provider.isVerified : true;
    const providerSkills = typeof svc.provider?.skills === 'string' ? svc.provider.skills.split(',') : (svc.provider?.skills || []);
    const catSlug = svc.category?.slug || svc.categorySlug || '';
    const catName = svc.category?.name || (typeof svc.category === 'string' ? svc.category : '') || 'General';
    const catIcon = svc.category?.icon || '🔧';
    const durationLabel = typeof svc.duration === 'number' ? `${svc.duration}m` : (svc.duration || 'N/A');
    const image = svc.image || categoryImages[catSlug] || '';

    return (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, fontSize: '0.9rem' }}>
                <ChevronLeft size={18} /> Back
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32 }}>
                {/* Left */}
                <div>
                    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 400, marginBottom: 32 }}>
                        {image ? (
                            <img src={image} alt={svc.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '8rem' }}>{catIcon}</span>
                            </div>
                        )}
                    </div>
                    <span className="badge badge-accent" style={{ marginBottom: 12 }}>{catName}</span>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>{svc.title}</h1>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                        <span className="badge badge-success"><Star size={12} /> {providerRating}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {durationLabel}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{providerReviewCount} reviews</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32, fontSize: '1rem' }}>{svc.description}</p>

                    {/* Provider Card */}
                    <div className="card" style={{ padding: 24, marginBottom: 32 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>About the Provider</h3>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
                            {providerAvatar ? (
                                <img src={providerAvatar} alt="" style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid var(--accent)' }} />
                            ) : (
                                <div style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', fontWeight: 800, fontSize: '1.2rem' }}>
                                    {providerName[0]}
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <h4 style={{ fontWeight: 700 }}>{providerName}</h4>
                                    {providerVerified && <span style={{ color: 'var(--accent-light)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 2 }}><Shield size={14} /> Verified</span>}
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}><MapPin size={14} /> {providerLocation}</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 8 }}>{providerBio}</p>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {providerSkills.map((skill: string) => <span key={skill} className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{skill}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Recent Reviews</h3>
                        {mockReviews.slice(0, 3).map(review => (
                            <div key={review.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                                    <img src={review.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{review.user}</p>
                                        <div style={{ display: 'flex', gap: 2 }}>
                                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="#f39c12" color="#f39c12" />)}
                                        </div>
                                    </div>
                                    <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{review.date}</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — Booking Panel */}
                <div>
                    <div className="card" style={{ padding: 28, position: 'sticky', top: 90 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Starting from</p>
                                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-light)' }}>₹{svc.price}</span>
                            </div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{durationLabel}</span>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 8 }}>
                                <Calendar size={14} style={{ display: 'inline', marginRight: 6 }} />Select Date
                            </label>
                            <input className="input" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 8 }}>Select Time</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                {timeSlots.map(time => (
                                    <button key={time} onClick={() => setSelectedTime(time)} style={{
                                        padding: '10px 0', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s',
                                        background: selectedTime === time ? 'var(--accent)' : 'var(--bg-secondary)',
                                        color: selectedTime === time ? '#fff' : 'var(--text-secondary)',
                                        outline: selectedTime === time ? 'none' : `1px solid var(--border)`,
                                    }}>{time}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 8 }}>Notes (optional)</label>
                            <textarea className="input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any specific instructions..." rows={3} style={{ resize: 'vertical' }} />
                        </div>

                        <button onClick={handleBooking} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
                            Book Now — ₹{svc.price}
                        </button>

                        <button className="btn-ghost" style={{ width: '100%', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <MessageCircle size={16} /> Chat with Provider
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
