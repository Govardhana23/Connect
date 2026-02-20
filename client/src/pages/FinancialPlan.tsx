import { useState, useEffect } from 'react'; // Fixed imports
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FinancialPlan = () => {
    const { user, token } = useAuth();
    const { addToast } = useToast();
    const queryClient = useQueryClient();

    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [savingsGoal, setSavingsGoal] = useState(0);
    const [expenseLimit, setExpenseLimit] = useState(0);

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
        mutation.mutate({ monthlyIncome, savingsGoal, expenseLimit });
    };

    // Simple projection logic
    const data = [
        { name: 'Month 1', savings: (monthlyIncome - expenseLimit) * 1 },
        { name: 'Month 2', savings: (monthlyIncome - expenseLimit) * 2 },
        { name: 'Month 3', savings: (monthlyIncome - expenseLimit) * 3 },
        { name: 'Month 4', savings: (monthlyIncome - expenseLimit) * 4 },
        { name: 'Month 5', savings: (monthlyIncome - expenseLimit) * 5 },
        { name: 'Month 6', savings: (monthlyIncome - expenseLimit) * 6 },
    ];

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold mb-4">Financial Growth Plan</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white rounded-lg shadow">
                    <label className="block text-sm font-medium text-gray-700">Projected Monthly Income (₹)</label>
                    <input
                        type="number"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                    <label className="block text-sm font-medium text-gray-700">Monthly Expense Limit (₹)</label>
                    <input
                        type="number"
                        value={expenseLimit}
                        onChange={(e) => setExpenseLimit(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                    <label className="block text-sm font-medium text-gray-700">Savings Goal (Total) (₹)</label>
                    <input
                        type="number"
                        value={savingsGoal}
                        onChange={(e) => setSavingsGoal(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
                Save Plan
            </button>

            <div className="mt-8 bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Projected Savings Growth (6 Months)</h2>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <Line type="monotone" dataKey="savings" stroke="#8884d8" strokeWidth={2} />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p className="mt-4 text-gray-600 text-sm">
                    This chart projects your potential savings over the next 6 months based on your current income and expense limit.
                </p>
            </div>
        </div>
    );
};

export default FinancialPlan;
