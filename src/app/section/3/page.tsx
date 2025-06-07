
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, CircleDollarSign, Landmark, Wallet, CreditCard, PiggyBank, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

export default function FinancialManagementPage() {
  const sectionTitle = "مدیریت مالی";
  const sectionPageDescription = "هزینه‌ها، درآمدها و بودجه خود را در اینجا پیگیری و مدیریت کنید.";

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sampleChartData = [
    { name: 'فروردین', درآمد: 4000000, هزینه: 2400000 },
    { name: 'اردیبهشت', درآمد: 3000000, هزینه: 1398000 },
    { name: 'خرداد', درآمد: 2000000, هزینه: 9800000 },
    { name: 'تیر', درآمد: 2780000, هزینه: 3908000 },
    { name: 'مرداد', درآمد: 1890000, هزینه: 4800000 },
    { name: 'شهریور', درآمد: 2390000, هزینه: 3800000 },
  ];

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center text-foreground">
                    <TrendingUp className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                    ثبت درآمد
                  </CardTitle>
                  <CardDescription>درآمدهای خود را اینجا وارد کنید.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">فرم و لیست درآمدها در اینجا نمایش داده خواهد شد.</p>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center text-foreground">
                    <TrendingDown className="mr-2 h-5 w-5 text-destructive rtl:ml-2 rtl:mr-0" />
                    ثبت هزینه
                  </CardTitle>
                  <CardDescription>هزینه‌های خود را اینجا وارد کنید.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">فرم و لیست هزینه‌ها در اینجا نمایش داده خواهد شد.</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
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
              <h4 className="text-lg font-semibold text-primary mb-4 text-center">نمودار نمونه درآمد و هزینه (به تومان)</h4>
              {isClient ? (
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={sampleChartData}
                      margin={{
                        top: 5,
                        right: 5,
                        left: 30, // Increased left margin for Y-axis labels
                        bottom: 70, // Increased bottom margin for angled X-axis labels
                      }}
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
                        formatter={(value: number, name: string) => [`${formatCurrency(value)} تومان`, name]}
                        wrapperClassName="rounded-md shadow-lg !bg-popover !border-border"
                        contentStyle={{backgroundColor: 'hsl(var(--popover))', direction: 'rtl', borderRadius: '0.375rem'}}
                        itemStyle={{color: 'hsl(var(--popover-foreground))'}}
                        labelStyle={{color: 'hsl(var(--primary))', marginBottom: '0.25rem', fontWeight: 'bold'}}
                        cursor={{fill: 'hsl(var(--muted))'}}
                      />
                      <Legend 
                        formatter={(value) => <span className="text-sm" style={{color: 'hsl(var(--foreground))'}}>{value}</span>} 
                        wrapperStyle={{direction: 'rtl', paddingTop: '10px'}}
                      />
                      <Bar dataKey="درآمد" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="درآمد" />
                      <Bar dataKey="هزینه" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="هزینه" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ width: '100%', height: 350 }} className="flex items-center justify-center text-muted-foreground">
                  در حال بارگذاری نمودار...
                </div>
              )}
              <p className="text-muted-foreground text-sm mt-4 text-center">
                این یک نمودار نمونه است. قابلیت‌های کامل گزارش‌گیری مالی به زودی اضافه خواهد شد.
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

    