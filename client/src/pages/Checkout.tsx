import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ArrowRight, CreditCard, Smartphone, Banknote, Lock, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useState } from 'react';

type Step = 'cart' | 'address' | 'payment' | 'confirm' | 'verify' | 'success';
type PaymentMethod = 'upi' | 'card' | 'cod' | null;

const STEPS: { key: Step; label: string }[] = [
    { key: 'cart', label: 'Cart' },
    { key: 'address', label: 'Address' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirm', label: 'Confirm' },
];

const Checkout = () => {
    const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
    const { addToast } = useToast();
    const [step, setStep] = useState<Step>('cart');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [processing, setProcessing] = useState(false);
    const [pin, setPin] = useState('');
    const [otp, setOtp] = useState('');
    const [savedTotal, setSavedTotal] = useState(0);
    const [pinError, setPinError] = useState('');
    const [address, setAddress] = useState({ name: '', phone: '', line1: '', line2: '', city: '', pincode: '', state: 'Karnataka' });
    const [orderId] = useState('JGR-' + Math.random().toString(36).substring(2, 8).toUpperCase());

    const deliveryFee = totalPrice > 999 ? 0 : 49;
    const grandTotal = totalPrice + deliveryFee;

    const validateAddress = () => {
        if (!address.name || !address.phone || !address.line1 || !address.city || !address.pincode) {
            addToast('Please fill all required address fields', 'warning'); return false;
        }
        if (address.phone.length < 10) { addToast('Enter a valid phone number', 'warning'); return false; }
        if (address.pincode.length < 6) { addToast('Enter a valid 6-digit pincode', 'warning'); return false; }
        return true;
    };

    const validatePayment = () => {
        if (!paymentMethod) { addToast('Please select a payment method', 'warning'); return false; }
        if (paymentMethod === 'upi' && !upiId.includes('@')) { addToast('Enter a valid UPI ID (e.g. name@upi)', 'warning'); return false; }
        if (paymentMethod === 'card') {
            if (cardNumber.replace(/\s/g, '').length < 16) { addToast('Enter a valid 16-digit card number', 'warning'); return false; }
            if (!cardExpiry.includes('/')) { addToast('Enter card expiry as MM/YY', 'warning'); return false; }
            if (cardCvv.length < 3) { addToast('Enter a valid CVV', 'warning'); return false; }
            if (!cardName) { addToast('Enter cardholder name', 'warning'); return false; }
        }
        return true;
    };

    const goNext = () => {
        if (step === 'cart') setStep('address');
        else if (step === 'address' && validateAddress()) setStep('payment');
        else if (step === 'payment' && validatePayment()) setStep('confirm');
    };

    const goBack = () => {
        if (step === 'address') setStep('cart');
        else if (step === 'payment') setStep('address');
        else if (step === 'confirm') setStep('payment');
        else if (step === 'verify') setStep('confirm');
    };

    const startPayment = () => {
        if (paymentMethod === 'cod') {
            setProcessing(true);
            setTimeout(() => {
                setProcessing(false);
                setSavedTotal(grandTotal);
                setStep('success');
                clearCart();
                addToast('Order confirmed! Pay on delivery.', 'success');
            }, 1500);
            return;
        }
        setPin('');
        setOtp('');
        setPinError('');
        setStep('verify');
    };

    const verifyAndPay = () => {
        if (paymentMethod === 'upi') {
            if (pin.length < 4) { setPinError('Enter your 4 or 6-digit UPI PIN'); return; }
        }
        if (paymentMethod === 'card') {
            if (otp.length < 6) { setPinError('Enter the 6-digit OTP sent to your phone'); return; }
        }
        setPinError('');
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setSavedTotal(grandTotal);
            setStep('success');
            clearCart();
            addToast('Payment successful! Order placed.', 'success');
        }, 2500);
    };

    const formatCard = (val: string) => {
        const nums = val.replace(/\D/g, '').substring(0, 16);
        return nums.replace(/(.{4})/g, '$1 ').trim();
    };

    const stepIndex = STEPS.findIndex(s => s.key === step);

    if (step === 'success') return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
            <div className="animate-fade-in-up">
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,184,148,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <CheckCircle size={40} style={{ color: 'var(--success)' }} />
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Payment Successful!</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>Your order has been confirmed</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 32 }}>Order ID: <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>{orderId}</span></p>
                <div className="card" style={{ padding: 20, marginBottom: 32, textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Amount Paid</span>
                        <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹{savedTotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Payment Method</span>
                        <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>{paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Delivery to</span>
                        <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>{address.city}, {address.pincode}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <Link to="/marketplace" className="btn-primary" style={{ textDecoration: 'none' }}>Continue Shopping</Link>
                    <Link to="/dashboard" className="btn-ghost" style={{ textDecoration: 'none' }}>Go to Dashboard</Link>
                </div>
            </div>
        </div>
    );

    if (items.length === 0 && step === 'cart') return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🛒</div>
            <h2 style={{ fontWeight: 700, marginBottom: 12 }}>Your cart is empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Browse the marketplace to find handmade treasures.</p>
            <Link to="/marketplace" className="btn-primary" style={{ textDecoration: 'none' }}>Browse Marketplace</Link>
        </div>
    );

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
            <Link to="/marketplace" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 24, fontSize: '0.9rem' }}><ArrowLeft size={16} /> Back to Marketplace</Link>

            {/* Step Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
                {STEPS.map((s, i) => (
                    <div key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.3s',
                                background: i <= stepIndex ? 'var(--accent)' : 'var(--bg-card)',
                                color: i <= stepIndex ? '#fff' : 'var(--text-muted)',
                                border: i <= stepIndex ? 'none' : '1px solid var(--border)',
                            }}>{i < stepIndex ? '✓' : i + 1}</div>
                            <span style={{ fontSize: '0.75rem', fontWeight: i === stepIndex ? 600 : 400, color: i === stepIndex ? 'var(--accent-light)' : 'var(--text-muted)' }}>{s.label}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div style={{ width: 60, height: 2, margin: '0 8px', marginBottom: 20, background: i < stepIndex ? 'var(--accent)' : 'var(--border)', transition: 'background 0.3s' }} />
                        )}
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
                <div>
                    {/* CART */}
                    {step === 'cart' && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 20 }}>Your Cart ({items.length} items)</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {items.map(({ product, quantity }) => (
                                    <div key={product.id} className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                                        <img src={product.images[0]} alt="" style={{ width: 80, height: 80, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.95rem' }}>{product.title}</h4>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>By {product.artisan.name}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <button onClick={() => updateQuantity(product.id, quantity - 1)} style={{ width: 30, height: 30, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
                                            <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{quantity}</span>
                                            <button onClick={() => updateQuantity(product.id, quantity + 1)} style={{ width: 30, height: 30, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
                                        </div>
                                        <span style={{ fontWeight: 700, color: 'var(--accent-light)', minWidth: 70, textAlign: 'right' }}>₹{product.price * quantity}</span>
                                        <button onClick={() => { removeItem(product.id); addToast('Item removed', 'info'); }} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 4 }}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ADDRESS */}
                    {step === 'address' && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 20 }}>Delivery Address</h2>
                            <div className="card" style={{ padding: 24 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Full Name *</label>
                                        <input className="input" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Phone Number *</label>
                                        <input className="input" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} placeholder="+91 98765 43210" maxLength={10} />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Address Line 1 *</label>
                                        <input className="input" value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} placeholder="House/Flat No., Building Name" />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Address Line 2</label>
                                        <input className="input" value={address.line2} onChange={e => setAddress({ ...address, line2: e.target.value })} placeholder="Street, Locality (optional)" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>City *</label>
                                        <input className="input" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} placeholder="Bangalore" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Pincode *</label>
                                        <input className="input" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} placeholder="560001" maxLength={6} />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>State</label>
                                        <input className="input" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PAYMENT */}
                    {step === 'payment' && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 20 }}>Payment Method</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {/* UPI */}
                                <div onClick={() => setPaymentMethod('upi')} className="card" style={{ padding: 20, cursor: 'pointer', border: paymentMethod === 'upi' ? '2px solid var(--accent)' : undefined }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'rgba(108,92,231,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Smartphone size={22} style={{ color: 'var(--accent-light)' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>UPI Payment</h4>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Google Pay, PhonePe, Paytm, BHIM</p>
                                        </div>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${paymentMethod === 'upi' ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {paymentMethod === 'upi' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />}
                                        </div>
                                    </div>
                                    {paymentMethod === 'upi' && (
                                        <div className="animate-fade-in" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>UPI ID</label>
                                            <input className="input" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={{ maxWidth: 300 }} />
                                        </div>
                                    )}
                                </div>
                                {/* Card */}
                                <div onClick={() => setPaymentMethod('card')} className="card" style={{ padding: 20, cursor: 'pointer', border: paymentMethod === 'card' ? '2px solid var(--accent)' : undefined }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'rgba(0,184,148,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CreditCard size={22} style={{ color: 'var(--success)' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Credit / Debit Card</h4>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Visa, Mastercard, RuPay</p>
                                        </div>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${paymentMethod === 'card' ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {paymentMethod === 'card' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />}
                                        </div>
                                    </div>
                                    {paymentMethod === 'card' && (
                                        <div className="animate-fade-in" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, maxWidth: 400 }}>
                                                <div>
                                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Card Number</label>
                                                    <input className="input" value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Cardholder Name</label>
                                                    <input className="input" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Name on card" />
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                                    <div>
                                                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>Expiry</label>
                                                        <input className="input" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 6 }}>CVV</label>
                                                        <input className="input" type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value)} placeholder="•••" maxLength={4} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* COD */}
                                <div onClick={() => setPaymentMethod('cod')} className="card" style={{ padding: 20, cursor: 'pointer', border: paymentMethod === 'cod' ? '2px solid var(--accent)' : undefined }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'rgba(253,203,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Banknote size={22} style={{ color: 'var(--warning)' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Cash on Delivery</h4>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pay when you receive</p>
                                        </div>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${paymentMethod === 'cod' ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {paymentMethod === 'cod' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                <Lock size={14} /> Your payment information is encrypted and secure
                            </div>
                        </div>
                    )}

                    {/* VERIFY PAYMENT */}
                    {step === 'verify' && (
                        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="card" style={{ padding: 32, maxWidth: 400, width: '100%', textAlign: 'center' }}>
                                {paymentMethod === 'upi' && (
                                    <>
                                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(108,92,231,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                            <Smartphone size={28} style={{ color: 'var(--accent-light)' }} />
                                        </div>
                                        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Enter UPI PIN</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 6 }}>Paying ₹{grandTotal} via UPI</p>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 20 }}>{upiId}</p>
                                        <input className="input" type="password" value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setPinError(''); }}
                                            placeholder="Enter UPI PIN" maxLength={6} style={{ textAlign: 'center', letterSpacing: 8, fontSize: '1.1rem', marginBottom: 8 }}
                                        />
                                    </>
                                )}
                                {paymentMethod === 'card' && (
                                    <>
                                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,184,148,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                            <CreditCard size={28} style={{ color: 'var(--success)' }} />
                                        </div>
                                        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Enter OTP</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 6 }}>Paying ₹{grandTotal} via Card •••• {cardNumber.slice(-4)}</p>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 20 }}>OTP sent to your registered mobile number</p>
                                        <input className="input" type="text" value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setPinError(''); }}
                                            placeholder="Enter 6-digit OTP" maxLength={6} style={{ textAlign: 'center', letterSpacing: 8, fontSize: '1.1rem', marginBottom: 8 }}
                                        />
                                    </>
                                )}
                                {pinError && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: 8 }}>{pinError}</p>}
                                <button onClick={verifyAndPay} disabled={processing} className="btn-primary"
                                    style={{ width: '100%', padding: 14, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: processing ? 0.7 : 1 }}>
                                    {processing ? (
                                        <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />Verifying Payment...</>
                                    ) : (
                                        <><Lock size={16} />Confirm & Pay ₹{grandTotal}</>
                                    )}
                                </button>
                                <button onClick={goBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginTop: 12, fontSize: '0.85rem' }}>Cancel</button>
                            </div>
                        </div>
                    )}

                    {/* CONFIRM */}
                    {step === 'confirm' && (
                        <div className="animate-fade-in">
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 20 }}>Review & Confirm</h2>
                            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                                <h4 style={{ fontWeight: 600, marginBottom: 12, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>ITEMS ({items.length})</h4>
                                {items.map(({ product, quantity }) => (
                                    <div key={product.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                                        <img src={product.images[0]} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                                        <div style={{ flex: 1 }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{product.title}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}> × {quantity}</span>
                                        </div>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>₹{product.price * quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <h4 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>DELIVERY ADDRESS</h4>
                                    <button onClick={() => setStep('address')} style={{ background: 'none', border: 'none', color: 'var(--accent-light)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Change</button>
                                </div>
                                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{address.name}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{address.city} - {address.pincode}, {address.state}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📞 {address.phone}</p>
                            </div>
                            <div className="card" style={{ padding: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <h4 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>PAYMENT METHOD</h4>
                                    <button onClick={() => setStep('payment')} style={{ background: 'none', border: 'none', color: 'var(--accent-light)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Change</button>
                                </div>
                                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                                    {paymentMethod === 'upi' && `UPI — ${upiId}`}
                                    {paymentMethod === 'card' && `Card — •••• ${cardNumber.slice(-4)}`}
                                    {paymentMethod === 'cod' && 'Cash on Delivery'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    {step !== 'confirm' && step !== 'verify' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                            {step !== 'cart' ? (
                                <button onClick={goBack} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <ArrowLeft size={16} /> Back
                                </button>
                            ) : <div />}
                            <button onClick={goNext} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                Continue <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div>
                    <div className="card" style={{ padding: 24, position: 'sticky', top: 90 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Subtotal ({items.length} items)</span><span>₹{totalPrice}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                            <span style={{ color: deliveryFee === 0 ? 'var(--success)' : 'var(--text-primary)' }}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                        </div>
                        {deliveryFee > 0 && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--accent-light)', marginBottom: 10 }}>Add ₹{1000 - totalPrice} more for free delivery</p>
                        )}
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.15rem' }}>
                            <span>Total</span><span style={{ color: 'var(--accent-light)' }}>₹{grandTotal}</span>
                        </div>

                        {step === 'confirm' && (
                            <button onClick={startPayment} disabled={processing} className="btn-primary"
                                style={{ width: '100%', marginTop: 20, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: processing ? 0.7 : 1 }}>
                                {processing ? (
                                    <>
                                        <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                                        Processing...
                                    </>
                                ) : (
                                    <><Lock size={16} /> Pay ₹{grandTotal}</>
                                )}
                            </button>
                        )}
                        {step !== 'confirm' && step !== 'verify' && (
                            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                <Lock size={12} /> Secure checkout
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Checkout;
