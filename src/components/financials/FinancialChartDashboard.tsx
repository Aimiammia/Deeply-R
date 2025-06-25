
'use client';

import { useMemo, useState } from 'react';
import type { FinancialTransaction } from '@/types';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { parseISO, getMonth, getYear, isSameMonth } from 'date-fns';
import { PieChart as ChartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';


const persianMonthNames = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const CHART_COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(160, 70%, 40%)",
    "hsl(30, 85%, 60%)",
    "hsl(260, 60%, 65%)",
];

interface FinancialChartDashboardProps {
  transactions: FinancialTransaction[];
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="hsl(var(--foreground))" className="text-sm">{`${formatCurrency(value)}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="hsl(var(--muted-foreground))" className="text-xs">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};


export function FinancialChartDashboard({ transactions }: FinancialChartDashboardProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const monthlyData = useMemo(() => {
    const monthlyMap: { [key: string]: { year: number; monthIndex: number; name: string; درآمد: number; هزینه: number } } = {};
    transactions.forEach(transaction => {
      const date = parseISO(transaction.date);
      const year = getYear(date);
      const monthIndex = getMonth(date);
      const key = `${year}-${monthIndex}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { year, monthIndex, name: `${persianMonthNames[monthIndex]}`, درآمد: 0, هزینه: 0 };
      }
      if (transaction.type === 'income') monthlyMap[key].درآمد += transaction.amount;
      else monthlyMap[key].هزینه += transaction.amount;
    });
    return Object.values(monthlyMap).sort((a, b) => a.year !== b.year ? a.year - b.year : a.monthIndex - b.monthIndex).slice(-12); // Last 12 months
  }, [transactions]);
  
  const categoryData = useMemo(() => {
    const now = new Date();
    const currentMonthExpenses = transactions.filter(t => 
        t.type === 'expense' && 
        isSameMonth(parseISO(t.date), now) &&
        getYear(parseISO(t.date)) === getYear(now)
    );

    const expensesByCategory = currentMonthExpenses.reduce((acc, t) => {
        const category = t.category || 'متفرقه';
        if (!acc[category]) {
            acc[category] = { value: 0, name: category };
        }
        acc[category].value += t.amount;
        return acc;
    }, {} as Record<string, { value: number; name: string }>);

    return Object.values(expensesByCategory).sort((a,b) => b.value - a.value);
}, [transactions]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  if (transactions.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><ChartIcon className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />تحلیل نموداری</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">داده‌ای برای نمایش در نمودارها وجود ندارد.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>نمودار ماهانه درآمد و هزینه</CardTitle>
                <CardDescription>نمایش روند مالی شما در ماه‌های اخیر.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 30, bottom: 5 }} dir="rtl">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} stroke="hsl(var(--foreground))"/>
                        <YAxis tickFormatter={value => new Intl.NumberFormat('fa-IR').format(Number(value) / 1000) + 'k'} tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} stroke="hsl(var(--foreground))"/>
                        <Tooltip
                            formatter={(value: number, name: string) => [formatCurrency(value), name === 'درآمد' ? 'درآمد' : 'هزینه']}
                            wrapperClassName="rounded-md shadow-lg !bg-popover !border-border text-sm"
                            contentStyle={{backgroundColor: 'hsl(var(--popover))', direction: 'rtl', borderRadius: '0.375rem'}}
                            itemStyle={{color: 'hsl(var(--popover-foreground))'}}
                            labelStyle={{color: 'hsl(var(--primary))', marginBottom: '0.25rem', fontWeight: 'bold'}}
                            cursor={{fill: 'hsl(var(--accent))', opacity: 0.5}}
                        />
                        <Legend
                            formatter={(value) => <span className="text-sm" style={{color: 'hsl(var(--foreground))'}}>{value}</span>}
                            wrapperStyle={{direction: 'rtl', paddingTop: '10px'}}
                        />
                        <Bar dataKey="درآمد" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="درآمد" />
                        <Bar dataKey="هزینه" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="هزینه" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
             <CardHeader>
                <CardTitle>تفکیک هزینه‌های این ماه</CardTitle>
                <CardDescription>هزینه‌های شما بر اساس دسته‌بندی.</CardDescription>
            </CardHeader>
            <CardContent>
                {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                fill="hsl(var(--primary))"
                                dataKey="value"
                                onMouseEnter={onPieEnter}
                                paddingAngle={2}
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend
                                iconSize={10}
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                wrapperStyle={{
                                    fontSize: '12px',
                                    lineHeight: '20px',
                                    direction: 'rtl',
                                    right: -20,
                                    
                                }}
                                payload={
                                    categoryData.map((entry, index) => ({
                                        id: entry.name,
                                        type: 'square',
                                        value: <span className="text-foreground">{entry.name}</span>,
                                        color: CHART_COLORS[index % CHART_COLORS.length]
                                    }))
                                }
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[350px]">
                        <p className="text-muted-foreground">هزینه‌ای در این ماه ثبت نشده است.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
