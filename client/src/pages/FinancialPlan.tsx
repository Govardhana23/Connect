import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Target, Shield, AlertTriangle, ArrowRight, DollarSign } from 'lucide-react';

const FinancialPlan = () => {
    const { user, token } = useAuth();
    const { addToast } = useToast();
    const queryClient = useQueryClient();

    const [monthlyIncome, setMonthlyIncome] = useState(50000);
    const [expenseLimit, setExpenseLimit] = useState(30000);
    const [savingsGoal, setSavingsGoal] = useState(100000);

    // Demo mode flag
    const isDemo = !user;

    const { data: plan, isLoading } = useQuery({
        queryKey: ['financialPlan'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/financial/financial-plan`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!user && !!token
    });

    useEffect(() => {
        if (plan) {
            setMonthlyIncome(plan.monthlyIncome);
            setSavingsGoal(plan.savingsGoal);
            setExpenseLimit(plan.expenseLimit);
        }
    }, [plan]);

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            return axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/financial/financial-plan`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['financialPlan'] });
            addToast('Financial plan updated successfully', 'success');
        },
        onError: () => {
            addToast('Failed to update financial plan', 'error');
        }
    });

    const handleSave = () => {
        if (isDemo) {
            addToast('Plan updated locally (Sign in to save permanently!)', 'info');
            return;
        }
        mutation.mutate({ monthlyIncome, savingsGoal, expenseLimit });
    };

    // ── Calculations ──
    const monthlySavings = Math.max(0, monthlyIncome - expenseLimit);
    const monthsToGoal = monthlySavings > 0 ? Math.ceil(savingsGoal / monthlySavings) : Infinity;
    const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

    // 50/30/20 Rule Logic
    const needs = monthlyIncome * 0.5;
    const wants = monthlyIncome * 0.3;
    const recommendedSavings = monthlyIncome * 0.2;

    const allocationData = [
        { name: 'Expenses', value: expenseLimit },
        { name: 'Savings', value: monthlySavings },
    ];

    // Projection Data
    const projectionData = useMemo(() => {
        let currentSavings = 0;
        return Array.from({ length: 12 }, (_, i) => {
            currentSavings += monthlySavings;
            return {
                name: `Month ${i + 1}`,
                savings: currentSavings,
                goal: savingsGoal,
            };
        });
    }, [monthlySavings, savingsGoal]);

    const CHART_COLORS = ['#e17055', '#00b894', '#6c5ce7', '#fdcb6e'];

    return (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 40 }} className="animate-fade-in-up">
                <span className="badge badge-accent" style={{ marginBottom: 16, fontSize: '0.85rem' }}>Financial Wellness</span>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 16, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Your Growth Plan
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
                    Visualizing your path to financial freedom. Adjust your inputs to see how your future changes.
                </p>
            </div>

            {isDemo && (
                <div className="glass animate-pulse-glow" style={{ padding: '12px 24px', borderRadius: 'var(--radius)', margin: '0 auto 40px', maxWidth: 800, borderLeft: '4px solid var(--accent)', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <AlertTriangle style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <div>
                        <h4 style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Demo Mode Active</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You are exploring features without signing in. <a href="/login" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Log in</a> to save your progress.</p>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, marginBottom: 32 }}>

                {/* Left Column: Charts & Insights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                    {/* Projection Chart */}
                    <div className="glass animate-fade-in-up stagger-1" style={{ padding: 24, borderRadius: 'var(--radius-lg)', minHeight: 400 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Savings Projection</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>12-Month Forecast</p>
                            </div>
                            <div className="badge badge-success" style={{ fontSize: '1rem', padding: '8px 16px' }}>
                                <TrendingUp size={16} /> +₹{(monthlySavings * 12).toLocaleString()}/yr
                            </div>
                        </div>
                        <div style={{ height: 300, width: '100%' }}>
                            <ResponsiveContainer>
                                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a0a0cc', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a0a0cc', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e1e42', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="savings" stroke="#6c5ce7" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
                                    <Area type="monotone" dataKey="goal" stroke="#fdcb6e" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
                        <div className="card animate-fade-in-up stagger-2" style={{ padding: 24 }}>
                            <div style={{ color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Target size={18} /> Time to Goal
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                {monthsToGoal === Infinity ? '∞' : monthsToGoal} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>months</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8 }}>Based on current savings rate</p>
                        </div>
                        <div className="card animate-fade-in-up stagger-3" style={{ padding: 24 }}>
                            <div style={{ color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Shield size={18} /> Savings Rate
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: savingsRate >= 20 ? 'var(--success)' : 'var(--warning)' }}>
                                {savingsRate.toFixed(1)}%
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8 }}>
                                {savingsRate >= 20 ? 'Great job! You are above the recommended 20%.' : 'Try to reach at least 20% for financial health.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="glass animate-slide-in-right" style={{ padding: 24, borderRadius: 'var(--radius-lg)' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 24 }}>Adjust Plan</h3>

                        {/* Income Control */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem', fontWeight: 500 }}>
                                <span>Monthly Income</span>
                                <span style={{ color: 'var(--accent-light)' }}>₹{monthlyIncome.toLocaleString()}</span>
                            </label>
                            <input
                                type="range"
                                min="10000" max="500000" step="1000"
                                value={monthlyIncome}
                                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                                style={{ width: '100%', marginBottom: 12, accentColor: 'var(--accent)' }}
                            />
                            <div style={{ position: 'relative' }}>
                                <DollarSign size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                                <input
                                    type="number"
                                    className="input"
                                    value={monthlyIncome}
                                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                                    style={{ paddingLeft: 36 }}
                                />
                            </div>
                        </div>

                        {/* Expense Control */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem', fontWeight: 500 }}>
                                <span>Monthly Expenses</span>
                                <span style={{ color: 'var(--danger)' }}>₹{expenseLimit.toLocaleString()}</span>
                            </label>
                            <input
                                type="range"
                                min="5000" max={monthlyIncome} step="1000"
                                value={expenseLimit}
                                onChange={(e) => setExpenseLimit(Number(e.target.value))}
                                style={{ width: '100%', marginBottom: 12, accentColor: 'var(--danger)' }}
                            />
                            <div style={{ position: 'relative' }}>
                                <DollarSign size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                                <input
                                    type="number"
                                    className="input"
                                    value={expenseLimit}
                                    onChange={(e) => setExpenseLimit(Number(e.target.value))}
                                    style={{ paddingLeft: 36 }}
                                />
                            </div>
                        </div>

                        {/* Savings Goal Control */}
                        <div style={{ marginBottom: 32 }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem', fontWeight: 500 }}>
                                <span>Savings Goal</span>
                                <span style={{ color: 'var(--warning)' }}>₹{savingsGoal.toLocaleString()}</span>
                            </label>
                            <input
                                type="range"
                                min="10000" max="5000000" step="5000"
                                value={savingsGoal}
                                onChange={(e) => setSavingsGoal(Number(e.target.value))}
                                style={{ width: '100%', marginBottom: 12, accentColor: 'var(--warning)' }}
                            />
                            <div style={{ position: 'relative' }}>
                                <DollarSign size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                                <input
                                    type="number"
                                    className="input"
                                    value={savingsGoal}
                                    onChange={(e) => setSavingsGoal(Number(e.target.value))}
                                    style={{ paddingLeft: 36 }}
                                />
                            </div>
                        </div>

                        <button onClick={handleSave} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            Save Changes <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Allocation Chart */}
                    <div className="card animate-slide-in-right stagger-1" style={{ padding: 24 }}>
                        <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Budget Allocation</h4>
                        <div style={{ height: 200, width: '100%' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={allocationData}
                                        cx="50%" cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#e17055" />
                                        <Cell fill="#00b894" />
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e1e42', borderRadius: '8px', border: 'none' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: 8 }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Savings: <strong style={{ color: 'var(--success)' }}>₹{monthlySavings.toLocaleString()}</strong></p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                input[type=range] {
                    -webkit-appearance: none; 
                    background: transparent; 
                }
                
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #fff;
                    cursor: pointer;
                    margin-top: -8px; 
                    box-shadow: 0 0 10px rgba(0,0,0,0.3);
                }

                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    cursor: pointer;
                    background: rgba(255,255,255,0.1);
                    border-radius: 2px;
                }
                
                @media (max-width: 900px) {
                    div[style*="grid-template-columns: 1fr 300px"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default FinancialPlan;
