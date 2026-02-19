import { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video } from 'lucide-react';
import { mockConversations, mockMessages } from '../lib/mockData';
import type { Message, Conversation } from '../lib/mockData';

const Chat = () => {
    const [activeConv, setActiveConv] = useState<Conversation>(mockConversations[0]);
    const [messages, setMessages] = useState<Message[]>(mockMessages[activeConv.id] || []);
    const [input, setInput] = useState('');
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMessages(mockMessages[activeConv.id] || []); }, [activeConv]);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const send = () => {
        if (!input.trim()) return;
        const msg: Message = { id: 'm_' + Date.now(), senderId: 'me', receiverId: activeConv.participant.id, text: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: true };
        setMessages(p => [...p, msg]);
        setInput('');
        setTimeout(() => {
            const replies = ['Sure, I will be there on time!', 'No problem!', 'Thank you! 👍', 'Absolutely!', 'Let me check.', 'Great, see you then!'];
            const reply: Message = { id: 'mr_' + Date.now(), senderId: activeConv.participant.id, receiverId: 'me', text: replies[Math.floor(Math.random() * replies.length)], timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false };
            setMessages(p => [...p, reply]);
        }, 1500);
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 24 }}>Messages</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: 550, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
                    {mockConversations.map(c => (
                        <div key={c.id} onClick={() => setActiveConv(c)} style={{ padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer', background: activeConv.id === c.id ? 'rgba(108,92,231,0.1)' : 'transparent', borderLeft: activeConv.id === c.id ? '3px solid var(--accent)' : '3px solid transparent' }}>
                            <div style={{ position: 'relative' }}>
                                <img src={c.participant.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                                {c.participant.isOnline && <span className="online-dot" style={{ position: 'absolute', bottom: 0, right: 0, border: '2px solid var(--bg-secondary)', width: 10, height: 10 }} />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.participant.name}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{c.lastTime}</span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMessage}</p>
                            </div>
                            {c.unread > 0 && <span style={{ minWidth: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.unread}</span>}
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src={activeConv.participant.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{activeConv.participant.name}</div>
                                <div style={{ fontSize: '0.7rem', color: activeConv.participant.isOnline ? 'var(--success)' : 'var(--text-muted)' }}>{activeConv.participant.isOnline ? 'Online' : 'Offline'}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Phone size={16} /></button>
                            <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Video size={16} /></button>
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {messages.map(m => (
                            <div key={m.id} style={{ display: 'flex', justifyContent: m.senderId === 'me' ? 'flex-end' : 'flex-start' }}>
                                <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: m.senderId === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.senderId === 'me' ? 'var(--accent)' : 'var(--bg-card)', color: m.senderId === 'me' ? '#fff' : 'var(--text-primary)' }}>
                                    <p style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>{m.text}</p>
                                    <p style={{ fontSize: '0.68rem', opacity: 0.6, marginTop: 3, textAlign: 'right' }}>{m.timestamp}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={endRef} />
                    </div>
                    <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, background: 'var(--bg-secondary)' }}>
                        <input className="input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type a message..." style={{ flex: 1 }} />
                        <button onClick={send} className="btn-primary" style={{ padding: '10px 14px' }}><Send size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
