
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, CircleDollarSign, Landmark, PiggyBank, Wallet, Settings2, BarChartBig, BellRing, Building, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useMemo } from 'react';
import { AddTransactionForm } from '@/components/financials/AddTransactionForm';
import { TransactionList } from '@/components/financials/TransactionList';
import type { FinancialTransaction, Budget } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { parseISO, getMonth, getYear, isSameMonth, startOfMonth } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebouncedLocalStorage } from '@/hooks/useDebouncedLocalStorage';

import { CreateBudgetForm } from '@/components/financials/CreateBudgetForm';
import { BudgetList } from '@/components/financials/BudgetList';

const persianMonthNames = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export default function FinancialManagementPage() {
  const sectionTitle = "مدیریت مالی";
  const sectionPageDescription = "هزینه‌ها، درآمدها، بودجه، دارایی‌ها و سرمایه‌گذاری‌های خود را در اینجا پیگیری و مدیریت کنید.";

  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [transactions, setTransactions] = useDebouncedLocalStorage<FinancialTransaction[]>('financialTransactions', []);
  const [budgets, setBudgets] = useDebouncedLocalStorage<Budget[]>('financialBudgets', []);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
  
  const handleSetBudget = (category: string, amount: number) => {
    setBudgets(prevBudgets => {
      const existingBudgetIndex = prevBudgets.findIndex(b => b.category === category);
      if (existingBudgetIndex > -1) {
        const updatedBudgets = [...prevBudgets];
        updatedBudgets[existingBudgetIndex] = { ...updatedBudgets[existingBudgetIndex], amount, createdAt: new Date().toISOString() };
        return updatedBudgets;
      } else {
        const newBudget: Budget = {
          id: category, 
          category,
          amount,
          createdAt: new Date().toISOString(),
        };
        return [newBudget, ...prevBudgets];
      }
    });
    toast({
      title: editingBudget ? "بودجه ویرایش شد" : "بودجه تنظیم شد",
      description: `بودجه برای دسته‌بندی "${category}" به مبلغ ${formatCurrency(amount)} تنظیم شد.`,
    });
    setEditingBudget(null); 
  };

  const handleDeleteBudget = (categoryId: string) => {
    setBudgets(prevBudgets => prevBudgets.filter(b => b.category !== categoryId));
    toast({
      title: "بودجه حذف شد",
      description: `بودجه برای دسته‌بندی "${categoryId}" حذف شد.`,
      variant: "destructive",
    });
     if (editingBudget?.category === categoryId) {
      setEditingBudget(null);
    }
  };
  
  const handleEditBudget = (budgetToEdit: Budget) => {
    setEditingBudget(budgetToEdit);
  };


  const chartData = useMemo(() => {
    if (!isClient || transactions.length === 0) { 
      return [];
    }

    const monthlyData: { [key: string]: { year: number; monthIndex: number; name: string; درآمد: number; هزینه: number } } = {};

    transactions.forEach(transaction => {
      const date = parseISO(transaction.date);
      const year = getYear(date);
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
  }, [transactions, isClient]);


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
          <CardContent className="pt-6">
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-5 mb-6 rounded-full bg-primary/10 p-1">
                <TabsTrigger
                  value="transactions"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none"
                >
                  <Wallet className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> تراکنش‌ها
                </TabsTrigger>
                <TabsTrigger
                  value="budgeting"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none"
                >
                  <Landmark className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> بودجه‌بندی
                </TabsTrigger>
                <TabsTrigger
                  value="assets"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none"
                >
                  <Building className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> دارایی‌ها
                </TabsTrigger>
                <TabsTrigger
                  value="investments"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none"
                >
                  <TrendingUp className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> سرمایه‌گذاری
                </TabsTrigger>
                <TabsTrigger
                  value="savings"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none"
                >
                  <PiggyBank className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> اهداف پس‌انداز
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transactions" className="space-y-8">
                <AddTransactionForm onAddTransaction={handleAddTransaction} />
                <TransactionList transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />
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
                              tickFormatter={value => formatCurrency(value)} 
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
                    این نمودار، درآمدها و هزینه‌های ثبت شده شما را به تفکیک ماه نمایش می‌دهد.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="budgeting" className="space-y-6">
                 <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center text-foreground">
                      <Landmark className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                      بودجه‌بندی ماهانه
                    </CardTitle>
                    <CardDescription>بودجه ماهانه خود را برای دسته‌بندی‌های مختلف هزینه تنظیم و پیگیری کنید.</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <CreateBudgetForm onSetBudget={handleSetBudget} existingBudget={editingBudget} />
                     <BudgetList budgets={budgets} transactions={transactions} onDeleteBudget={handleDeleteBudget} onEditBudget={handleEditBudget} />
                     
                     <div className="mt-8 p-4 border rounded-md bg-secondary/30">
                        <h4 className="text-lg font-semibold text-primary mb-3 flex items-center">
                          <BarChartBig className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                          نمودار پیشرفت بودجه
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          (قابلیت آینده) در این بخش نموداری برای مقایسه بصری هزینه‌های واقعی با بودجه تعیین شده برای هر دسته‌بندی نمایش داده خواهد شد.
                        </p>
                      </div>
                      <div className="mt-6 p-4 border rounded-md bg-secondary/30">
                        <h4 className="text-lg font-semibold text-primary mb-3 flex items-center">
                          <BellRing className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                          هشدارهای بودجه
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          (قابلیت آینده) سیستم هشدار برای اطلاع‌رسانی در مورد نزدیک شدن به سقف بودجه یا عبور از آن در دسته‌بندی‌های مختلف.
                        </p>
                      </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assets" className="space-y-6">
                <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center text-foreground">
                       <Building className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                      مدیریت دارایی‌ها
                    </CardTitle>
                    <CardDescription>لیست دارایی‌های خود (مانند ملک، خودرو، ...) را ثبت و ارزش آن‌ها را پیگیری کنید.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">قابلیت مدیریت دارایی‌ها به زودی اضافه خواهد شد.</p>
                    <div className="mt-4 p-4 border rounded-md bg-secondary/30">
                        <h4 className="text-lg font-semibold text-primary mb-2">قابلیت‌های آینده:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-left rtl:text-right text-foreground/80">
                          <li>ثبت انواع دارایی (ملک، خودرو، موجودی حساب خاص و ...)</li>
                          <li>وارد کردن ارزش اولیه و تاریخ خرید</li>
                          <li>امکان به‌روزرسانی ارزش دارایی‌ها</li>
                          <li>نمودار تغییرات ارزش کل دارایی‌ها در طول زمان</li>
                          <li>محاسبه خالص دارایی (دارایی‌ها منهای بدهی‌ها - نیازمند بخش بدهی‌ها)</li>
                        </ul>
                      </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="investments" className="space-y-6">
                <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center text-foreground">
                       <TrendingUp className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                      پیگیری سرمایه‌گذاری‌ها
                    </CardTitle>
                    <CardDescription>سرمایه‌گذاری‌های خود (سهام، ارز دیجیتال، طلا و ...) را ثبت و عملکرد آن‌ها را دنبال کنید.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">قابلیت پیگیری سرمایه‌گذاری‌ها به زودی اضافه خواهد شد.</p>
                     <div className="mt-4 p-4 border rounded-md bg-secondary/30">
                        <h4 className="text-lg font-semibold text-primary mb-2">قابلیت‌های آینده:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-left rtl:text-right text-foreground/80">
                          <li>ثبت انواع سرمایه‌گذاری (سهام، ارز، طلا، صندوق و ...)</li>
                          <li>وارد کردن مقدار، قیمت خرید و تاریخ</li>
                          <li>امکان به‌روزرسانی قیمت فعلی و محاسبه سود/زیان</li>
                          <li>نمودار عملکرد پورتفوی سرمایه‌گذاری</li>
                          <li>اتصال به API برای دریافت قیمت‌های لحظه‌ای (در صورت امکان)</li>
                        </ul>
                      </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="savings" className="space-y-6">
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
                    <div className="mt-4 p-4 border rounded-md bg-secondary/30">
                        <h4 className="text-lg font-semibold text-primary mb-2">قابلیت‌های آینده:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-left rtl:text-right">
                          <li>تعریف اهداف پس‌انداز با مبلغ و تاریخ هدف</li>
                          <li>اختصاص دادن بخشی از درآمد به هر هدف</li>
                          <li>پیگیری پیشرفت به سمت هر هدف پس‌انداز</li>
                          <li>نمودار تجسمی برای اهداف پس‌انداز</li>
                        </ul>
                      </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}

