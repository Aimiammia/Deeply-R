
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, CircleDollarSign, Landmark, PiggyBank, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useMemo } from 'react';
import { AddTransactionForm } from '@/components/financials/AddTransactionForm';
import { TransactionList } from '@/components/financials/TransactionList';
import type { FinancialTransaction } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { parseISO, getMonth, getFullYear } from 'date-fns';

const persianMonthNames = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export default function FinancialManagementPage() {
  const sectionTitle = "مدیریت مالی";
  const sectionPageDescription = "هزینه‌ها، درآمدها و بودجه خود را در اینجا پیگیری و مدیریت کنید.";

  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Load transactions from localStorage on initial mount
  useEffect(() => {
    setIsClient(true); // For recharts hydration
    try {
      const storedTransactions = localStorage.getItem('financialTransactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (error) {
      console.error("Failed to parse transactions from localStorage", error);
      localStorage.removeItem('financialTransactions'); // Clear corrupted data
    }
    setIsInitialLoadComplete(true);
  }, []);

  // Save transactions to localStorage whenever they change, but only after initial load
  useEffect(() => {
    if (isInitialLoadComplete) {
      localStorage.setItem('financialTransactions', JSON.stringify(transactions));
    }
  }, [transactions, isInitialLoadComplete]);


  const handleAddTransaction = (transactionData: Omit<FinancialTransaction, 'id' | 'createdAt'>) => {
    const newTransaction: FinancialTransaction = {
      ...transactionData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    toast({
      title: "تراکنش ثبت شد",
      description: `تراکنش "${transactionData.description}" با موفقیت ثبت شد.`,
      variant: "default",
    });
  };

  const handleDeleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== id));
    if (transactionToDelete) {
      toast({
        title: "تراکنش حذف شد",
        description: `تراکنش "${transactionToDelete.description}" حذف شد.`,
        variant: "destructive",
      });
    }
  };

  const chartData = useMemo(() => {
    if (!isInitialLoadComplete || transactions.length === 0) {
      return [];
    }

    const monthlyData: { [key: string]: { year: number; monthIndex: number; name: string; درآمد: number; هزینه: number } } = {};

    transactions.forEach(transaction => {
      const date = parseISO(transaction.date);
      const year = getFullYear(date);
      const monthIndex = getMonth(date);
      const key = `${year}-${monthIndex}`;

      if (!monthlyData[key]) {
        monthlyData[key] = {
          year,
          monthIndex,
          name: `${persianMonthNames[monthIndex]} - ${year}`,
          درآمد: 0,
          هزینه: 0,
        };
      }

      if (transaction.type === 'income') {
        monthlyData[key].درآمد += transaction.amount;
      } else {
        monthlyData[key].هزینه += transaction.amount;
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return a.monthIndex - b.monthIndex;
      });
  }, [transactions, isInitialLoadComplete]);


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fa-IR').format(value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            بازگشت به خانه
          </Link>
        </Button>
        <Card className="shadow-lg bg-card">
          <CardHeader>
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
              <CircleDollarSign className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline text-primary">
                {sectionTitle}
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {sectionPageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            <AddTransactionForm onAddTransaction={handleAddTransaction} />
            
            <TransactionList transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />

            <Card className="shadow-md hover:shadow-lg transition-shadow bg-card mt-10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-foreground">
                  <Landmark className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                  بودجه‌بندی
                </CardTitle>
                <CardDescription>بودجه ماهانه خود را تنظیم و پیگیری کنید.</CardDescription>
              </CardHeader>
              <CardContent>
                 <p className="text-muted-foreground">قابلیت بودجه‌بندی به زودی اضافه خواهد شد.</p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-foreground">
                   <PiggyBank className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                  اهداف پس‌انداز
                </CardTitle>
                <CardDescription>اهداف پس‌انداز خود را مشخص و پیشرفت خود را مشاهده کنید.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">قابلیت اهداف پس‌انداز به زودی اضافه خواهد شد.</p>
              </CardContent>
            </Card>
            
            <div className="mt-8 p-4 border rounded-lg bg-secondary/30">
              <h4 className="text-lg font-semibold text-primary mb-4 text-center">نمودار درآمد و هزینه (به تومان)</h4>
              {isClient ? (
                chartData.length > 0 ? (
                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={chartData}
                        margin={{
                          top: 5,
                          right: 5,
                          left: 30, 
                          bottom: 70, 
                        }}
                        dir="rtl"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          height={50} 
                          interval={0} 
                          tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                          stroke="hsl(var(--foreground))"
                        />
                        <YAxis 
                          tickFormatter={formatCurrency} 
                          tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                          stroke="hsl(var(--foreground))"
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => [`${formatCurrency(value)} تومان`, name === 'درآمد' ? 'درآمد' : 'هزینه']}
                          wrapperClassName="rounded-md shadow-lg !bg-popover !border-border"
                          contentStyle={{backgroundColor: 'hsl(var(--popover))', direction: 'rtl', borderRadius: '0.375rem'}}
                          itemStyle={{color: 'hsl(var(--popover-foreground))'}}
                          labelStyle={{color: 'hsl(var(--primary))', marginBottom: '0.25rem', fontWeight: 'bold'}}
                          cursor={{fill: 'hsl(var(--muted))'}}
                        />
                        <Legend 
                          formatter={(value) => <span className="text-sm" style={{color: 'hsl(var(--foreground))'}}>{value === 'درآمد' ? 'درآمد' : 'هزینه'}</span>} 
                          wrapperStyle={{direction: 'rtl', paddingTop: '10px'}}
                          payload={[{ value: 'درآمد', type: 'square', id: 'ID01', color: 'hsl(var(--chart-2))' }, { value: 'هزینه', type: 'square', id: 'ID02', color: 'hsl(var(--chart-1))' }]}
                        />
                        <Bar dataKey="درآمد" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="درآمد" />
                        <Bar dataKey="هزینه" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="هزینه" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ width: '100%', height: 350 }} className="flex items-center justify-center text-muted-foreground">
                    <p>داده‌ای برای نمایش در نمودار وجود ندارد. لطفاً ابتدا تراکنش‌های خود را ثبت کنید.</p>
                  </div>
                )
              ) : (
                <div style={{ width: '100%', height: 350 }} className="flex items-center justify-center text-muted-foreground">
                  در حال بارگذاری نمودار...
                </div>
              )}
              <p className="text-muted-foreground text-sm mt-4 text-center">
                این نمودار، درآمدها و هزینه‌های ثبت شده شما را نمایش می‌دهد.
              </p>
            </div>

          </CardContent>
        </Card>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}

