'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes'
import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function AdminChartPage() {
    const [period, setPeriod] = useState('7days');
    const [view, setView] = useState('daily');
    const [data, setData] = useState<DataPoint[]>([]);
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    interface DataPoint {
        date: string;
        signups: number;
    }

    const processDataByView = useCallback((rawData: DataPoint[], view: string) => {
        if (view === 'daily') return rawData;

        const groupedData = rawData.reduce((acc: Record<string, DataPoint>, curr: DataPoint) => {
            const date = new Date(curr.date);
            let key: string;

            if (view === 'weekly') {
                // Get the Monday of the week
                const day = date.getDay();
                const diff = date.getDate() - day + (day === 0 ? -6 : 1);
                const monday = new Date(date.setDate(diff));
                key = monday.toISOString().split('T')[0];
            } else { // monthly
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
            }

            if (!acc[key]) {
                acc[key] = { date: key, signups: 0 };
            }
            acc[key].signups += curr.signups;
            return acc;
        }, {});

        return Object.values(groupedData);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(`/api/users?period=${period}`);
                if (!response.ok) throw new Error('Failed to fetch data');
                const { users } = await response.json() as { users: DataPoint[] };
                const processedData = processDataByView(users, view);
                setData(processedData as DataPoint[]);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [period, view, processDataByView]);

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-destructive">{error}</div>;

    // Update the chart colors based on theme
    const chartColors = {
        grid: theme === 'dark' ? '#374151' : '#e5e7eb',
        text: theme === 'dark' ? '#9ca3af' : '#6b7280',
        line: theme === 'dark' ? '#60a5fa' : '#2563eb',
        tooltip: {
            bg: theme === 'dark' ? '#1f2937' : '#ffffff',
            border: theme === 'dark' ? '#374151' : '#e5e7eb',
            text: theme === 'dark' ? '#ffffff' : '#000000',
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-medium">Signups</CardTitle>
                    <Select defaultValue="7days" onValueChange={(value) => setPeriod(value)}>
                        <SelectTrigger className="w-[140px] h-8">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7days">Last 7 days</SelectItem>
                            <SelectItem value="30days">Last 30 days</SelectItem>
                            <SelectItem value="90days">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Select defaultValue="daily" onValueChange={(value) => setView(value)}>
                    <SelectTrigger className="w-[100px] h-8">
                        <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke={chartColors.grid}
                        />
                        <XAxis
                            dataKey="date"
                            stroke={chartColors.text}
                            tickFormatter={(date) => {
                                const d = new Date(date);
                                if (view === 'monthly') {
                                    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                                } else if (view === 'weekly') {
                                    return `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                                }
                                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            }}
                        />
                        <YAxis 
                            stroke={chartColors.text}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: chartColors.tooltip.bg,
                                border: `1px solid ${chartColors.tooltip.border}`,
                                color: chartColors.tooltip.text,
                            }}
                            labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            formatter={(value) => [`${value} signups`, 'Signups']}
                        />
                        <Line
                            type="monotone"
                            dataKey="signups"
                            stroke={chartColors.line}
                            strokeWidth={2}
                            dot={{ fill: chartColors.line }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}