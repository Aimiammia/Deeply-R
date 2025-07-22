
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Calculator, Flame, Goal, Dna, Loader2, Edit, PlusCircle, Trash2, TrendingUp, Dumbbell } from 'lucide-react';
import type { CalorieProfile, FoodLogEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { isSameDay, parseISO, startOfDay } from 'date-fns';
import { generateId, cn } from '@/lib/utils';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers';
import { useData } from '@/contexts/DataContext';

// Helper for formatting numbers with Persian digits
function formatNumber(value: number) {
    return new Intl.NumberFormat('fa-IR').format(Math.round(value));
}

// #region Profile Form Component
const profileFormSchema = z.object({
  gender: z.enum(['male', 'female'], { required_error: 'لطفاً جنسیت را انتخاب کنید.' }),
  age: z.number({ required_error: 'لطفاً سن را وارد کنید.' }).min(15, 'سن باید حداقل ۱۵ سال باشد.').max(80, 'سن باید حداکثر ۸۰ سال باشد.'),
  weight: z.number({ required_error: 'لطفاً وزن را وارد کنید.' }).min(40, 'وزن باید حداقل ۴۰ کیلوگرم باشد.').max(200, 'وزن باید حداکثر ۲۰۰ کیلوگرم باشد.'),
  height: z.number({ required_error: 'لطفاً قد را وارد کنید.' }).min(140, 'قد باید حداقل ۱۴۰ سانتی‌متر باشد.').max(220, 'قد باید حداکثر ۲۲۰ سانتی‌متر باشد.'),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very', 'super'], { required_error: 'لطفاً سطح فعالیت را انتخاب کنید.' }),
  goal: z.enum(['lose', 'maintain', 'gain'], { required_error: 'لطفاً هدف خود را انتخاب کنید.' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const activityLevels = [
  { value: 'sedentary', label: 'بی‌تحرک (کار اداری، بدون ورزش)' },
  { value: 'light', label: 'فعالیت کم (ورزش سبک ۱-۳ روز در هفته)' },
  { value: 'moderate', label: 'فعالیت متوسط (ورزش متوسط ۳-۵ روز در هفته)' },
  { value: 'very', label: 'فعالیت زیاد (ورزش سنگین ۶-۷ روز در هفته)' },
  { value: 'super', label: 'فعالیت خیلی زیاد (ورزش سنگین روزانه + شغل فیزیکی)' },
];

const activityFactors: Record<ProfileFormValues['activityLevel'], number> = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725, super: 1.9,
};

function CalorieProfileForm({ onProfileSet, existingProfile }: { onProfileSet: (profile: CalorieProfile) => void, existingProfile?: CalorieProfile | null }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: existingProfile || { gender: 'male', goal: 'maintain' },
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    let bmr: number;
    if (data.gender === 'male') {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
    } else {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
    }

    const tdee = bmr * activityFactors[data.activityLevel];
    
    let targetCalories = tdee;
    if (data.goal === 'lose') targetCalories -= 500;
    if (data.goal === 'gain') targetCalories += 500;
    
    const heightInMeters = data.height / 100;
    const idealWeight = Math.round(22 * (heightInMeters * heightInMeters));

    const newProfile: CalorieProfile = {
      ...data,
      targetCalories: Math.round(targetCalories),
      idealWeight: idealWeight,
    };
    onProfileSet(newProfile);
  };
    
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><Calculator className="ml-2 h-6 w-6 text-primary" />{existingProfile ? 'ویرایش پروفایل کالری' : 'محاسبه‌گر کالری و پیشنهاد روزانه'}</CardTitle>
        <CardDescription>با وارد کردن اطلاعات، یک تخمین دقیق از کالری مورد نیاز روزانه و وزن ایده‌آل خود دریافت کنید.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>جنسیت</Label>
            <Controller control={control} name="gender" render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse"><RadioGroupItem value="male" id="male" /><Label htmlFor="male">مرد</Label></div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse"><RadioGroupItem value="female" id="female" /><Label htmlFor="female">زن</Label></div>
              </RadioGroup>
            )} />
            {errors.gender && <p className="text-xs text-destructive mt-1">{errors.gender.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2"><Label htmlFor="age">سن (سال)</Label><Input id="age" type="number" {...register('age', { valueAsNumber: true })} />{errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}</div>
            <div className="space-y-2"><Label htmlFor="weight">وزن (کیلوگرم)</Label><Input id="weight" type="number" {...register('weight', { valueAsNumber: true })} />{errors.weight && <p className="text-xs text-destructive">{errors.weight.message}</p>}</div>
            <div className="space-y-2"><Label htmlFor="height">قد (سانتی‌متر)</Label><Input id="height" type="number" {...register('height', { valueAsNumber: true })} />{errors.height && <p className="text-xs text-destructive">{errors.height.message}</p>}</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="activityLevel">سطح فعالیت روزانه</Label>
            <Controller control={control} name="activityLevel" render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="activityLevel"><SelectValue placeholder="سطح فعالیت خود را انتخاب کنید..." /></SelectTrigger>
                <SelectContent>{activityLevels.map(level => (<SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>))}</SelectContent>
              </Select>
            )} />
            {errors.activityLevel && <p className="text-xs text-destructive mt-1">{errors.activityLevel.message}</p>}
          </div>
          <div className="space-y-3 pt-2">
            <Label className="flex items-center"><Goal className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0 text-primary" />هدف شما چیست؟</Label>
            <Controller control={control} name="goal" render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-1">
                <div className="flex items-center space-x-2 rtl:space-x-reverse"><RadioGroupItem value="lose" id="lose" /><Label htmlFor="lose">کاهش وزن</Label></div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse"><RadioGroupItem value="maintain" id="maintain" /><Label htmlFor="maintain">حفظ وزن</Label></div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse"><RadioGroupItem value="gain" id="gain" /><Label htmlFor="gain">افزایش وزن</Label></div>
              </RadioGroup>
            )} />
            {errors.goal && <p className="text-xs text-destructive mt-1">{errors.goal.message}</p>}
          </div>
        </CardContent>
        <CardFooter><Button type="submit" className="w-full">{existingProfile ? 'ذخیره تغییرات' : 'محاسبه و ایجاد پروفایل'}</Button></CardFooter>
      </form>
    </Card>
  );
}
// #endregion

// #region Food Tracker Component
function FoodTracker({ profile, onEditProfile }: { profile: CalorieProfile, onEditProfile: () => void }) {
    const { toast } = useToast();
    const { foodLog, setFoodLog, activities } = useData();
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState<number | ''>('');

    const todaysLog = useMemo(() => {
        return foodLog.filter(entry => isSameDay(parseISO(entry.date), startOfDay(new Date()))).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [foodLog]);

    const consumedCalories = useMemo(() => {
        return todaysLog.reduce((sum, entry) => sum + entry.calories, 0);
    }, [todaysLog]);
    
    const burnedCaloriesToday = useMemo(() => {
        return activities
            .filter(activity => 
                activity.caloriesBurned && isSameDay(parseISO(activity.date), startOfDay(new Date()))
            )
            .reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0);
    }, [activities]);

    const remainingCalories = profile.targetCalories - consumedCalories + burnedCaloriesToday;
    const progress = (consumedCalories / profile.targetCalories) * 100;

    const handleAddFood = (e: React.FormEvent) => {
        e.preventDefault();
        if (!foodName.trim() || calories === '' || Number(calories) <= 0) {
            toast({ title: "اطلاعات نامعتبر", description: "لطفا نام غذا و کالری صحیح را وارد کنید.", variant: "destructive" });
            return;
        }
        const newEntry: FoodLogEntry = {
            id: generateId(),
            date: new Date().toISOString(),
            name: foodName.trim(),
            calories: Number(calories),
        };
        setFoodLog(prev => [newEntry, ...prev]);
        setFoodName('');
        setCalories('');
    };

    const handleDeleteFood = (id: string) => {
        setFoodLog(prev => prev.filter(entry => entry.id !== id));
        toast({ title: "غذا حذف شد", variant: "destructive" });
    };

    return (
        <div className="space-y-8">
            <Card className="bg-primary/5 border-primary">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-primary">داشبورد کالری روزانه</CardTitle>
                            <CardDescription>بر اساس پروفایل شما و فعالیت‌های امروزتان:</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onEditProfile}><Edit className="h-5 w-5"/></Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                        <div className="p-2 border rounded-lg bg-background"><p className="text-xs text-muted-foreground">کالری هدف</p><p className="text-lg font-bold text-green-600">{formatNumber(profile.targetCalories)}</p></div>
                        <div className="p-2 border rounded-lg bg-background"><p className="text-xs text-muted-foreground">مصرفی</p><p className="text-lg font-bold text-blue-600">{formatNumber(consumedCalories)}</p></div>
                        <div className="p-2 border rounded-lg bg-background"><p className="text-xs text-muted-foreground">سوزانده شده (ورزش)</p><p className="text-lg font-bold text-orange-500">{formatNumber(burnedCaloriesToday)}</p></div>
                        <div className="p-2 border rounded-lg bg-background"><p className="text-xs text-muted-foreground">خالص باقی‌مانده</p><p className={cn("text-lg font-bold", remainingCalories < 0 ? "text-red-600" : "text-yellow-600")}>{formatNumber(remainingCalories)}</p></div>
                    </div>
                    <div>
                        <Progress value={progress} className="h-3"/>
                        <p className="text-xs text-muted-foreground text-center mt-1">{formatNumber(progress)}٪ از کالری هدف مصرف شده</p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader><CardTitle className="flex items-center"><PlusCircle className="ml-2 h-5 w-5"/>ثبت غذای مصرفی</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddFood} className="space-y-4">
                            <div><Label htmlFor="foodName">نام غذا</Label><Input id="foodName" value={foodName} onChange={e => setFoodName(e.target.value)} placeholder="مثلا: تخم مرغ آب‌پز"/></div>
                            <div><Label htmlFor="calories">کالری</Label><Input id="calories" type="number" value={calories} onChange={e => setCalories(e.target.value === '' ? '' : Number(e.target.value))} placeholder="مثلا: ۱۵۵"/></div>
                            <Button type="submit" className="w-full">افزودن به لیست امروز</Button>
                        </form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>لیست امروز ({formatJalaliDateDisplay(new Date(), 'jD jMMMM')})</CardTitle></CardHeader>
                    <CardContent>
                        {todaysLog.length > 0 ? (
                            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {todaysLog.map(entry => (
                                    <li key={entry.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                        <p className="font-medium">{entry.name}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm text-muted-foreground">{formatNumber(entry.calories)} کالری</p>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteFood(entry.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">هنوز غذایی برای امروز ثبت نکرده‌اید.</p>
                        )}
                         <div className="border-t mt-4 pt-4 text-right">
                            <p className="text-lg font-bold">مجموع کالری امروز: {formatNumber(consumedCalories)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
// #endregion

export function CalorieCalculator() {
  const { toast } = useToast();
  const { calorieProfile, setCalorieProfile, calorieProfileLoading } = useData();
  const [isEditing, setIsEditing] = useState(false);

  const handleSetProfile = (newProfile: CalorieProfile) => {
    setCalorieProfile(newProfile);
    setIsEditing(false); // Exit editing mode after saving
    toast({
      title: "پروفایل شما تنظیم شد",
      description: `وزن ایده‌آل شما حدود ${formatNumber(newProfile.idealWeight)} کیلوگرم و کالری هدف روزانه ${formatNumber(newProfile.targetCalories)} است.`,
      duration: 7000,
    });
  };

  const startEditing = () => {
    setIsEditing(true);
  };
  
  if (calorieProfileLoading) {
      return (
          <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  if (!calorieProfile || isEditing) {
    return <CalorieProfileForm onProfileSet={handleSetProfile} existingProfile={calorieProfile} />;
  }

  return <FoodTracker profile={calorieProfile} onEditProfile={startEditing} />;
}
