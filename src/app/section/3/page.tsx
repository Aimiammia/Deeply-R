
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, CircleDollarSign, Landmark, PiggyBank, Wallet, Settings2, BarChartBig, BellRing, Building, TrendingUp, PackageSearch, Save, Sigma, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useMemo, useCallback } from 'react'; 
import dynamic from 'next/dynamic'; 
import type { FinancialTransaction, Budget, FinancialAsset, FinancialInvestment, SavingsGoal } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { parseISO, getMonth, getYear, isSameMonth, startOfMonth } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebouncedLocalStorage } from '@/hooks/useDebouncedLocalStorage';
import { ClientOnly } from '@/components/ClientOnly';
import { cn } from '@/lib/utils';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers';
import { Skeleton } from '@/components/ui/skeleton'; 
import { generateId } from '@/lib/utils';


const FormLoadingSkeleton = () => (
  <div className="space-y-6 p-4 border rounded-lg shadow-sm bg-card mb-8 animate-pulse">
    <Skeleton className="h-8 w-1/3 mb-4 rounded" />
    <Skeleton className="h-10 w-full rounded" />
    <Skeleton className="h-10 w-full rounded" />
    <div className="flex gap-4">
      <Skeleton className="h-10 flex-1 rounded" />
      <Skeleton className="h-10 flex-1 rounded" />
    </div>
    <Skeleton className="h-10 w-full rounded" />
  </div>
);

const ListLoadingSkeleton = () => (
  <div className="mt-8 animate-pulse">
    <Skeleton className="h-8 w-1/2 mb-4 rounded" />
    <div className="space-y-4">
      <Skeleton className="h-20 w-full rounded-lg" />
      <Skeleton className="h-20 w-full rounded-lg" />
      <Skeleton className="h-20 w-full rounded-lg" />
    </div>
  </div>
);

const DynamicAddTransactionForm = dynamic(() => import('@/components/financials/AddTransactionForm').then(mod => mod.AddTransactionForm), { ssr: false, loading: () => <FormLoadingSkeleton /> });
const DynamicTransactionList = dynamic(() => import('@/components/financials/TransactionList').then(mod => mod.TransactionList), { ssr: false, loading: () => <ListLoadingSkeleton /> });
const DynamicCreateBudgetForm = dynamic(() => import('@/components/financials/CreateBudgetForm').then(mod => mod.CreateBudgetForm), { ssr: false, loading: () => <FormLoadingSkeleton /> });
const DynamicBudgetList = dynamic(() => import('@/components/financials/BudgetList').then(mod => mod.BudgetList), { ssr: false, loading: () => <ListLoadingSkeleton /> });
const DynamicCreateAssetForm = dynamic(() => import('@/components/financials/CreateAssetForm').then(mod => mod.CreateAssetForm), { ssr: false, loading: () => <FormLoadingSkeleton /> });
const DynamicAssetList = dynamic(() => import('@/components/financials/AssetList').then(mod => mod.AssetList), { ssr: false, loading: () => <ListLoadingSkeleton /> });
const DynamicCreateInvestmentForm = dynamic(() => import('@/components/financials/CreateInvestmentForm').then(mod => mod.CreateInvestmentForm), { ssr: false, loading: () => <FormLoadingSkeleton /> });
const DynamicInvestmentList = dynamic(() => import('@/components/financials/InvestmentList').then(mod => mod.InvestmentList), { ssr: false, loading: () => <ListLoadingSkeleton /> });
const DynamicCreateSavingsGoalForm = dynamic(() => import('@/components/financials/CreateSavingsGoalForm').then(mod => mod.CreateSavingsGoalForm), { ssr: false, loading: () => <FormLoadingSkeleton /> });
const DynamicSavingsGoalList = dynamic(() => import('@/components/financials/SavingsGoalList').then(mod => mod.SavingsGoalList), { ssr: false, loading: () => <ListLoadingSkeleton /> });


const persianMonthNames = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const fetchMockLivePrice = async (currentPrice: number, investmentType: FinancialInvestment['type']): Promise<number> => {
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  const volatilityFactor = investmentType === 'crypto' ? 0.15 : (investmentType === 'stocks' ? 0.05 : 0.02);
  const priceChangePercentage = (Math.random() - 0.5) * 2 * volatilityFactor; 
  let newPrice = currentPrice * (1 + priceChangePercentage);
  newPrice = Math.max(0.01, newPrice); 
  return parseFloat(newPrice.toFixed(2));
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
};


export default function FinancialManagementPage() {
  const sectionTitle = "مدیریت مالی";
  const sectionPageDescription = "هزینه‌ها، درآمدها، بودجه، دارایی‌ها، سرمایه‌گذاری‌ها و اهداف پس‌انداز خود را در اینجا پیگیری و مدیریت کنید.";

  const { toast } = useToast();
  const [transactions, setTransactions] = useDebouncedLocalStorage<FinancialTransaction[]>('financialTransactions', []);
  
  const [budgets, setBudgets] = useDebouncedLocalStorage<Budget[]>('financialBudgets', []);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  
  const [assets, setAssets] = useDebouncedLocalStorage<FinancialAsset[]>('financialAssets', []);
  const [editingAsset, setEditingAsset] = useState<FinancialAsset | null>(null);

  const [investments, setInvestments] = useDebouncedLocalStorage<FinancialInvestment[]>('financialInvestments', []);
  const [editingInvestment, setEditingInvestment] = useState<FinancialInvestment | null>(null);
  const [updatingPriceForId, setUpdatingPriceForId] = useState<string | null>(null);


  const [savingsGoals, setSavingsGoals] = useDebouncedLocalStorage<SavingsGoal[]>('financialSavingsGoals', []);
  const [editingSavingsGoal, setEditingSavingsGoal] = useState<SavingsGoal | null>(null);


  const handleAddTransaction = useCallback((transactionData: Omit<FinancialTransaction, 'id' | 'createdAt'>) => {
    const newTransaction: FinancialTransaction = {
      ...transactionData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    toast({
      title: "تراکنش ثبت شد",
      description: `تراکنش "${transactionData.description}" با موفقیت ثبت شد.`,
      variant: "default",
    });
  }, [setTransactions, toast]);

  const handleDeleteTransaction = useCallback((id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== id));
    if (transactionToDelete) {
      toast({
        title: "تراکنش حذف شد",
        description: `تراکنش "${transactionToDelete.description}" حذف شد.`,
        variant: "destructive",
      });
    }
  }, [transactions, setTransactions, toast]);
  
  const handleSetBudget = useCallback((category: string, amount: number) => {
    setBudgets(prevBudgets => {
      const existingBudgetIndex = prevBudgets.findIndex(b => b.category === category);
      if (existingBudgetIndex > -1 && editingBudget && prevBudgets[existingBudgetIndex].id === editingBudget.id) {
        const updatedBudgets = [...prevBudgets];
        updatedBudgets[existingBudgetIndex] = { ...updatedBudgets[existingBudgetIndex], amount, createdAt: new Date().toISOString() };
        return updatedBudgets;
      } else if (existingBudgetIndex === -1 && !editingBudget) { 
        const newBudget: Budget = {
          id: generateId(), 
          category,
          amount,
          createdAt: new Date().toISOString(),
        };
        return [newBudget, ...prevBudgets];
      }
      return prevBudgets;
    });
    toast({
      title: editingBudget ? "بودجه ویرایش شد" : "بودجه تنظیم شد",
      description: `بودجه برای دسته‌بندی "${category}" به مبلغ ${formatCurrency(amount)} تنظیم شد.`,
    });
    setEditingBudget(null); 
  }, [setBudgets, toast, editingBudget]);

  const handleDeleteBudget = useCallback((budgetId: string) => { 
    const budgetToDelete = budgets.find(b => b.id === budgetId);
    setBudgets(prevBudgets => prevBudgets.filter(b => b.id !== budgetId));
     if (budgetToDelete) {
        toast({
        title: "بودجه حذف شد",
        description: `بودجه برای دسته‌بندی "${budgetToDelete.category}" حذف شد.`,
        variant: "destructive",
        });
    }
     if (editingBudget?.id === budgetId) {
      setEditingBudget(null);
    }
  }, [budgets, setBudgets, toast, editingBudget]);
  
  const handleEditBudget = useCallback((budgetToEdit: Budget) => {
    setEditingBudget(budgetToEdit);
  }, []);

  const handleSaveAsset = useCallback((assetData: Omit<FinancialAsset, 'id' | 'createdAt' | 'lastValueUpdate'>, isEditingExisting: boolean) => {
    if (isEditingExisting && editingAsset) {
      const updatedAsset: FinancialAsset = {
        ...editingAsset,
        ...assetData,
        lastValueUpdate: new Date().toISOString(),
      };
      setAssets(prevAssets => prevAssets.map(a => a.id === editingAsset.id ? updatedAsset : a));
      toast({ title: "دارایی ویرایش شد", description: `دارایی "${assetData.name}" با موفقیت ویرایش شد.` });
      setEditingAsset(null);
    } else {
      const newAsset: FinancialAsset = {
        ...assetData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        lastValueUpdate: new Date().toISOString(),
      };
      setAssets(prevAssets => [newAsset, ...prevAssets]);
      toast({ title: "دارایی اضافه شد", description: `دارایی "${assetData.name}" با موفقیت اضافه شد.` });
    }
  }, [setAssets, toast, editingAsset]);

  const handleDeleteAsset = useCallback((id: string) => {
    const assetToDelete = assets.find(a => a.id === id);
    setAssets(prevAssets => prevAssets.filter(a => a.id !== id));
    if (assetToDelete) {
      toast({ title: "دارایی حذف شد", description: `دارایی "${assetToDelete.name}" حذف شد.`, variant: "destructive" });
    }
    if (editingAsset?.id === id) {
        setEditingAsset(null); 
    }
  }, [assets, setAssets, toast, editingAsset]);

  const handleSaveInvestment = useCallback((investmentData: Omit<FinancialInvestment, 'id' | 'createdAt' | 'lastPriceUpdateDate'>, isEditingExisting: boolean) => {
    const nowISO = new Date().toISOString();
    if (isEditingExisting && editingInvestment) {
        const updatedInvestment: FinancialInvestment = {
            ...editingInvestment,
            ...investmentData,
            lastPriceUpdateDate: nowISO, 
        };
        setInvestments(prevInvestments => prevInvestments.map(i => i.id === editingInvestment.id ? updatedInvestment : i));
        toast({ title: "سرمایه‌گذاری ویرایش شد", description: `سرمایه‌گذاری "${investmentData.name}" ویرایش شد.` });
        setEditingInvestment(null); 
    } else {
        const newInvestment: FinancialInvestment = {
            ...investmentData,
            id: generateId(),
            createdAt: nowISO,
            lastPriceUpdateDate: nowISO,
        };
        setInvestments(prevInvestments => [newInvestment, ...prevInvestments]);
        toast({ title: "سرمایه‌گذاری اضافه شد", description: `سرمایه‌گذاری "${investmentData.name}" اضافه شد.` });
    }
  }, [setInvestments, toast, editingInvestment]);

  const handleDeleteInvestment = useCallback((id: string) => {
    const investmentToDelete = investments.find(i => i.id === id);
    setInvestments(prevInvestments => prevInvestments.filter(i => i.id !== id));
    if (investmentToDelete) {
      toast({ title: "سرمایه‌گذاری حذف شد", description: `سرمایه‌گذاری "${investmentToDelete.name}" حذف شد.`, variant: "destructive" });
    }
    if (editingInvestment?.id === id) {
        setEditingInvestment(null);
    }
  }, [investments, setInvestments, toast, editingInvestment]);

  const handleUpdateInvestmentPrice = useCallback(async (investmentId: string) => {
    const investmentToUpdate = investments.find(inv => inv.id === investmentId);
    if (!investmentToUpdate) {
      toast({ title: "خطا", description: "سرمایه‌گذاری مورد نظر یافت نشد.", variant: "destructive" });
      return;
    }

    setUpdatingPriceForId(investmentId);
    try {
      toast({ title: "در حال دریافت قیمت...", description: `درحال شبیه‌سازی دریافت قیمت لحظه‌ای برای "${investmentToUpdate.name}"...` });
      const newPrice = await fetchMockLivePrice(investmentToUpdate.currentPricePerUnit, investmentToUpdate.type);
      
      setInvestments(prevInvestments => 
        prevInvestments.map(inv => 
          inv.id === investmentId 
            ? { ...inv, currentPricePerUnit: newPrice, lastPriceUpdateDate: new Date().toISOString() } 
            : inv
        )
      );
      toast({ title: "قیمت به‌روز شد (شبیه‌سازی شده)", description: `قیمت "${investmentToUpdate.name}" به ${formatCurrency(newPrice)} تغییر یافت.` });
    } catch (error) {
      console.error("Error updating mock price:", error);
      toast({ title: "خطا در به‌روزرسانی قیمت", description: "هنگام شبیه‌سازی دریافت قیمت مشکلی پیش آمد.", variant: "destructive" });
    } finally {
      setUpdatingPriceForId(null);
    }
  }, [investments, setInvestments, toast]);


  const handleSaveSavingsGoal = useCallback((goalData: Omit<SavingsGoal, 'id' | 'createdAt' | 'currentAmount' | 'status'>, isEditing: boolean) => {
    if (isEditing && editingSavingsGoal) {
      const updatedGoal: SavingsGoal = {
        ...editingSavingsGoal,
        name: goalData.name,
        targetAmount: goalData.targetAmount,
        targetDate: goalData.targetDate,
      };
      setSavingsGoals(prevGoals => prevGoals.map(g => g.id === editingSavingsGoal.id ? updatedGoal : g));
      toast({ title: "هدف پس‌انداز ویرایش شد", description: `هدف "${goalData.name}" با موفقیت ویرایش شد.` });
      setEditingSavingsGoal(null);
    } else {
      const newGoal: SavingsGoal = {
        ...goalData,
        id: generateId(),
        currentAmount: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      setSavingsGoals(prevGoals => [newGoal, ...prevGoals]);
      toast({ title: "هدف پس‌انداز اضافه شد", description: `هدف "${goalData.name}" با موفقیت اضافه شد.` });
    }
  }, [setSavingsGoals, toast, editingSavingsGoal]);

  const handleDeleteSavingsGoal = useCallback((id: string) => {
    const goalToDelete = savingsGoals.find(g => g.id === id);
    setSavingsGoals(prevGoals => prevGoals.filter(g => g.id !== id));
    if (goalToDelete) {
      toast({ title: "هدف پس‌انداز حذف شد", description: `هدف "${goalToDelete.name}" حذف شد.`, variant: "destructive" });
    }
    if (editingSavingsGoal?.id === id) {
      setEditingSavingsGoal(null);
    }
  }, [savingsGoals, setSavingsGoals, toast, editingSavingsGoal]);

  const handleAddFundsToSavingsGoal = useCallback((id: string, amount: number) => {
    setSavingsGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          const newCurrentAmount = goal.currentAmount + amount;
          return { 
            ...goal, 
            currentAmount: newCurrentAmount,
            status: newCurrentAmount >= goal.targetAmount && goal.status === 'active' ? 'achieved' : goal.status 
          };
        }
        return goal;
      })
    );
    toast({ title: "وجه اضافه شد", description: `مبلغ ${formatCurrency(amount)} به هدف اضافه شد.` });
  }, [setSavingsGoals, toast]);
  
  const handleSetSavingsGoalStatus = useCallback((id: string, status: SavingsGoal['status']) => {
     setSavingsGoals(prevGoals =>
      prevGoals.map(goal => goal.id === id ? { ...goal, status } : goal)
    );
    const statusText = status === 'achieved' ? 'رسیده شده' : status === 'cancelled' ? 'لغو شده' : 'فعال';
    toast({ title: "وضعیت هدف تغییر کرد", description: `وضعیت هدف به "${statusText}" تغییر یافت.` });
  }, [setSavingsGoals, toast]);


  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: { year: number; monthIndex: number; name: string; درآمد: number; هزینه: number } } = {};
    transactions.forEach(transaction => {
      const date = parseISO(transaction.date);
      const year = getYear(date);
      const monthIndex = getMonth(date);
      const key = `${year}-${monthIndex}`;
      if (!monthlyData[key]) {
        monthlyData[key] = { year, monthIndex, name: `${persianMonthNames[monthIndex]} - ${year}`, درآمد: 0, هزینه: 0 };
      }
      if (transaction.type === 'income') monthlyData[key].درآمد += transaction.amount;
      else monthlyData[key].هزینه += transaction.amount;
    });
    return Object.values(monthlyData).sort((a, b) => a.year !== b.year ? a.year - b.year : a.monthIndex - b.monthIndex);
  }, [transactions]);

  const totalInvestmentProfitLoss = useMemo(() => {
    return investments.reduce((sum, investment) => {
      const purchaseCost = (investment.quantity * investment.purchasePricePerUnit) + investment.fees;
      const currentValue = investment.quantity * investment.currentPricePerUnit;
      return sum + (currentValue - purchaseCost);
    }, 0);
  }, [investments]);


  return (
    <ClientOnly fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <CircleDollarSign className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">{sectionTitle}</h1>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              بازگشت به خانه
            </Link>
          </Button>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          {sectionPageDescription}
        </p>

        <Card className="shadow-lg bg-card">
          <CardContent className="p-6">
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-5 mb-6 rounded-full bg-primary/10 p-1 h-auto">
                <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none py-2.5">
                  <Wallet className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> تراکنش‌ها
                </TabsTrigger>
                <TabsTrigger value="budgeting" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none py-2.5">
                  <Landmark className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> بودجه‌بندی
                </TabsTrigger>
                <TabsTrigger value="assets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none py-2.5">
                  <Building className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> دارایی‌ها
                </TabsTrigger>
                <TabsTrigger value="investments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none py-2.5">
                  <TrendingUp className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> سرمایه‌گذاری
                </TabsTrigger>
                <TabsTrigger value="savings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none py-2.5">
                  <PiggyBank className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> اهداف پس‌انداز
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transactions" className="space-y-8">
                <DynamicAddTransactionForm onAddTransaction={handleAddTransaction} />
                <DynamicTransactionList transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />
                <div className="mt-8 p-4 border rounded-lg bg-secondary/30">
                  <h4 className="text-lg font-semibold text-primary mb-4 text-center">نمودار درآمد و هزینه (به تومان)</h4>
                  {chartData.length > 0 ? (
                      <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 30, bottom: 70 }} dir="rtl">
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={50} interval={0} tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} stroke="hsl(var(--foreground))"/>
                            <YAxis tickFormatter={value => formatCurrency(value)} tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} stroke="hsl(var(--foreground))"/>
                            <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name === 'درآمد' ? 'درآمد' : 'هزینه']} wrapperClassName="rounded-md shadow-lg !bg-popover !border-border" contentStyle={{backgroundColor: 'hsl(var(--popover))', direction: 'rtl', borderRadius: '0.375rem'}} itemStyle={{color: 'hsl(var(--popover-foreground))'}} labelStyle={{color: 'hsl(var(--primary))', marginBottom: '0.25rem', fontWeight: 'bold'}} cursor={{fill: 'hsl(var(--muted))'}}/>
                            <Legend formatter={(value) => <span className="text-sm" style={{color: 'hsl(var(--foreground))'}}>{value === 'درآمد' ? 'درآمد' : 'هزینه'}</span>} wrapperStyle={{direction: 'rtl', paddingTop: '10px'}} payload={[{ value: 'درآمد', type: 'square', id: 'ID01', color: 'hsl(var(--chart-2))' }, { value: 'هزینه', type: 'square', id: 'ID02', color: 'hsl(var(--chart-1))' }]}/>
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
                  }
                  <p className="text-muted-foreground text-sm mt-4 text-center">این نمودار، درآمدها و هزینه‌های ثبت شده شما را به تفکیک ماه نمایش می‌دهد.</p>
                </div>
              </TabsContent>

              <TabsContent value="budgeting" className="space-y-6">
                 <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl flex items-center text-foreground">
                      <Landmark className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                      بودجه‌بندی ماهانه
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground pt-1">بودجه ماهانه خود را برای دسته‌بندی‌های مختلف هزینه تنظیم و پیگیری کنید.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                     <DynamicCreateBudgetForm onSetBudget={handleSetBudget} existingBudget={editingBudget} />
                     <DynamicBudgetList budgets={budgets} transactions={transactions} onDeleteBudget={handleDeleteBudget} onEditBudget={handleEditBudget} />
                     
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
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl flex items-center text-foreground">
                       <PackageSearch className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                      مدیریت دارایی‌ها
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground pt-1">لیست دارایی‌های خود (مانند ملک، خودرو، حساب بانکی، سهام و ...) را ثبت و ارزش آن‌ها را پیگیری کنید.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <DynamicCreateAssetForm onSaveAsset={handleSaveAsset} existingAsset={editingAsset} />
                    <DynamicAssetList assets={assets} onDeleteAsset={handleDeleteAsset} onEditAsset={setEditingAsset} onSetEditingAsset={setEditingAsset} />
                    
                    <div className="mt-8 p-4 border rounded-md bg-secondary/30">
                        <h4 className="text-lg font-semibold text-primary mb-3 flex items-center">
                          <BarChartBig className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                          نمودار تغییرات ارزش کل دارایی‌ها
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          (قابلیت آینده) نمایش نموداری از تغییرات ارزش کل دارایی‌های شما در طول زمان.
                        </p>
                      </div>
                      <div className="mt-6 p-4 border rounded-md bg-secondary/30">
                        <h4 className="text-lg font-semibold text-primary mb-3 flex items-center">
                          <CircleDollarSign className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
                           محاسبه خالص دارایی (Net Worth)
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          (قابلیت آینده) محاسبه و نمایش خالص دارایی شما (مجموع ارزش دارایی‌ها منهای مجموع بدهی‌ها). این قابلیت نیازمند بخش مدیریت بدهی‌ها نیز خواهد بود.
                        </p>
                      </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="investments" className="space-y-6">
                <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl flex items-center text-foreground">
                       <TrendingUp className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                      پیگیری سرمایه‌گذاری‌ها
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground pt-1">سرمایه‌گذاری‌های خود (سهام، ارز دیجیتال، طلا و ...) را ثبت و عملکرد آن‌ها را دنبال کنید. قیمت‌ها می‌توانند به صورت دستی یا (در آینده) از طریق API به‌روز شوند.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <DynamicCreateInvestmentForm onSaveInvestment={handleSaveInvestment} existingInvestment={editingInvestment} />
                    {investments.length > 0 && (
                        <Card className="mt-6 bg-primary/10 p-4">
                            <CardHeader className="p-2 pb-1">
                                <CardTitle className="text-md text-primary flex items-center">
                                    <Sigma className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0"/>
                                    خلاصه پورتفوی سرمایه‌گذاری
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 text-sm">
                                <p>مجموع سود/زیان کل: 
                                    <span className={cn("font-semibold", totalInvestmentProfitLoss >= 0 ? "text-green-600" : "text-red-600")}>
                                        {formatCurrency(totalInvestmentProfitLoss)}
                                    </span>
                                </p>
                            </CardContent>
                        </Card>
                    )}
                    <DynamicInvestmentList 
                        investments={investments} 
                        onDeleteInvestment={handleDeleteInvestment} 
                        onEditInvestment={setEditingInvestment}
                        onUpdatePrice={handleUpdateInvestmentPrice}
                        updatingPriceForId={updatingPriceForId}
                    />
                    
                     <div className="mt-8 p-4 border rounded-md bg-secondary/30">
                        <h4 className="text-lg font-semibold text-primary mb-2">قابلیت‌های آینده:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-left rtl:text-right text-foreground/80">
                          <li>نمودار عملکرد پورتفوی سرمایه‌گذاری و مقایسه با شاخص‌ها.</li>
                          <li className="flex items-start">
                            <RefreshCw className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>
                             اتصال به API واقعی برای دریافت قیمت‌های لحظه‌ای (نیاز به انتخاب و پیاده‌سازی API توسط شما).
                          </li>
                        </ul>
                      </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="savings" className="space-y-6">
                <Card className="shadow-md hover:shadow-lg transition-shadow bg-card">
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl flex items-center text-foreground">
                       <PiggyBank className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                      اهداف پس‌انداز
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground pt-1">اهداف پس‌انداز خود را مشخص و پیشرفت خود را مشاهده کنید.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                     <DynamicCreateSavingsGoalForm onSaveGoal={handleSaveSavingsGoal} existingGoal={editingSavingsGoal} />
                     <DynamicSavingsGoalList 
                        goals={savingsGoals} 
                        onDeleteGoal={handleDeleteSavingsGoal} 
                        onEditGoal={setEditingSavingsGoal}
                        onAddFunds={handleAddFundsToSavingsGoal}
                        onSetStatus={handleSetSavingsGoalStatus}
                      />
                    <div className="mt-8 p-4 border rounded-md bg-secondary/30">
                        <h4 className="text-lg font-semibold text-primary mb-2">قابلیت‌های آینده:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-left rtl:text-right text-foreground/80">
                          <li>اختصاص دادن بخشی از درآمد یا تراکنش‌های خاص به هر هدف (اتصال به تراکنش‌ها).</li>
                          <li>نمودار تجسمی برای پیگیری پیشرفت اهداف پس‌انداز.</li>
                          <li>یادآوری برای واریز به اهداف پس‌انداز.</li>
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
    </ClientOnly>
  );
}

