
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, CircleDollarSign, Landmark, PiggyBank, Wallet, BarChartBig, TrendingUp, Loader2, RefreshCw, Sigma, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useMemo, useCallback } from 'react'; 
import dynamic from 'next/dynamic'; 
import type { FinancialTransaction, Budget, FinancialAsset, FinancialInvestment, SavingsGoal } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { parseISO, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSharedState } from '@/hooks/useSharedState';
import { ClientOnly } from '@/components/ClientOnly';
import { cn, formatCurrency, generateId } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton'; 


const FormLoadingSkeleton = () => (
  <div className="space-y-6 p-4 border rounded-2xl shadow-sm bg-card mb-8 animate-pulse">
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
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  </div>
);

const DynamicFinancialChartDashboard = dynamic(() => import('@/components/financials/FinancialChartDashboard').then(mod => mod.FinancialChartDashboard), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full" /> });
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


const fetchMockLivePrice = async (currentPrice: number, investmentType: FinancialInvestment['type']): Promise<number> => {
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  const volatilityFactor = investmentType === 'crypto' ? 0.15 : (investmentType === 'stocks' ? 0.05 : 0.02);
  const priceChangePercentage = (Math.random() - 0.5) * 2 * volatilityFactor; 
  let newPrice = currentPrice * (1 + priceChangePercentage);
  newPrice = Math.max(0.01, newPrice); 
  return parseFloat(newPrice.toFixed(2));
};


export default function FinancialManagementPage() {
  const sectionTitle = "مدیریت مالی";
  const sectionPageDescription = "هزینه‌ها، درآمدها، بودجه، دارایی‌ها، سرمایه‌گذاری‌ها و اهداف پس‌انداز خود را در اینجا پیگیری و مدیریت کنید.";

  const { toast } = useToast();
  
  const [transactions, setTransactions, transactionsLoading] = useSharedState<FinancialTransaction[]>('financialTransactions', []);
  const [budgets, setBudgets, budgetsLoading] = useSharedState<Budget[]>('financialBudgets', []);
  const [assets, setAssets, assetsLoading] = useSharedState<FinancialAsset[]>('financialAssets', []);
  const [investments, setInvestments, investmentsLoading] = useSharedState<FinancialInvestment[]>('financialInvestments', []);
  const [savingsGoals, setSavingsGoals, savingsGoalsLoading] = useSharedState<SavingsGoal[]>('financialSavingsGoals', []);

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editingAsset, setEditingAsset] = useState<FinancialAsset | null>(null);
  const [editingInvestment, setEditingInvestment] = useState<FinancialInvestment | null>(null);
  const [updatingPriceForId, setUpdatingPriceForId] = useState<string | null>(null);
  const [editingSavingsGoal, setEditingSavingsGoal] = useState<SavingsGoal | null>(null);

  const pageIsLoading = transactionsLoading || budgetsLoading || assetsLoading || investmentsLoading || savingsGoalsLoading;


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


  const summaryData = useMemo(() => {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    const monthlyTransactions = transactions.filter(t => isWithinInterval(parseISO(t.date), { start: startOfCurrentMonth, end: endOfCurrentMonth }));

    const totalIncome = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const netWorth = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    
    const investmentProfitLoss = investments.reduce((sum, inv) => {
      const purchaseCost = (inv.quantity * inv.purchasePricePerUnit) + inv.fees;
      const currentValue = inv.quantity * inv.currentPricePerUnit;
      return sum + (currentValue - purchaseCost);
    }, 0);

    return { totalIncome, totalExpenses, netWorth, investmentProfitLoss };
  }, [transactions, assets, investments]);


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

        <Card className="mb-8 bg-secondary/30">
            <CardHeader>
                <CardTitle className="text-xl text-primary">خلاصه وضعیت مالی</CardTitle>
                <CardDescription>نمای کلی از وضعیت مالی شما در این ماه و ارزش کل دارایی‌ها.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">درآمد این ماه</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(summaryData.totalIncome)}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">هزینه این ماه</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(summaryData.totalExpenses)}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">خالص دارایی‌ها</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(summaryData.netWorth)}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">سود/زیان سرمایه‌گذاری</CardTitle>
                        <Sigma className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", summaryData.investmentProfitLoss >= 0 ? 'text-green-600' : 'text-red-600')}>
                            {formatCurrency(summaryData.investmentProfitLoss)}
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>

        <Card className="shadow-lg bg-card">
          <CardContent className="p-6">
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 mb-6 rounded-full bg-primary/10 p-1">
                <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none">
                  <Wallet className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> تراکنش‌ها
                </TabsTrigger>
                <TabsTrigger value="charts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none">
                  <BarChartBig className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> نمودارها
                </TabsTrigger>
                <TabsTrigger value="budgeting" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none">
                  <Landmark className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> بودجه‌بندی
                </TabsTrigger>
                <TabsTrigger value="assets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none">
                  <Wallet className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> دارایی‌ها
                </TabsTrigger>
                <TabsTrigger value="investments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none">
                  <TrendingUp className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> سرمایه‌گذاری
                </TabsTrigger>
                <TabsTrigger value="savings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none">
                  <PiggyBank className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> اهداف پس‌انداز
                </TabsTrigger>
              </TabsList>
              
              {pageIsLoading ? (
                <div className="flex justify-center items-center p-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <TabsContent value="transactions" className="space-y-8">
                    <DynamicAddTransactionForm onAddTransaction={handleAddTransaction} />
                    <DynamicTransactionList transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />
                  </TabsContent>

                   <TabsContent value="charts" className="space-y-8">
                      <DynamicFinancialChartDashboard transactions={transactions} />
                  </TabsContent>

                  <TabsContent value="budgeting" className="space-y-6">
                    <DynamicCreateBudgetForm onSetBudget={handleSetBudget} existingBudget={editingBudget} />
                    <DynamicBudgetList budgets={budgets} transactions={transactions} onDeleteBudget={handleDeleteBudget} onEditBudget={handleEditBudget} />
                  </TabsContent>

                  <TabsContent value="assets" className="space-y-6">
                      <DynamicCreateAssetForm onSaveAsset={handleSaveAsset} existingAsset={editingAsset} />
                      <DynamicAssetList assets={assets} onDeleteAsset={handleDeleteAsset} onEditAsset={setEditingAsset} onSetEditingAsset={setEditingAsset} />
                  </TabsContent>

                  <TabsContent value="investments" className="space-y-6">
                      <DynamicCreateInvestmentForm onSaveInvestment={handleSaveInvestment} existingInvestment={editingInvestment} />
                      <DynamicInvestmentList 
                          investments={investments} 
                          onDeleteInvestment={handleDeleteInvestment} 
                          onEditInvestment={setEditingInvestment}
                          onUpdatePrice={handleUpdateInvestmentPrice}
                          updatingPriceForId={updatingPriceForId}
                      />
                  </TabsContent>

                  <TabsContent value="savings" className="space-y-6">
                    <DynamicCreateSavingsGoalForm onSaveGoal={handleSaveSavingsGoal} existingGoal={editingSavingsGoal} />
                    <DynamicSavingsGoalList 
                        goals={savingsGoals} 
                        onDeleteGoal={handleDeleteSavingsGoal} 
                        onEditGoal={setEditingSavingsGoal}
                        onAddFunds={handleAddFundsToSavingsGoal}
                        onSetStatus={handleSetSavingsGoalStatus}
                    />
                  </TabsContent>
                </>
              )}
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
