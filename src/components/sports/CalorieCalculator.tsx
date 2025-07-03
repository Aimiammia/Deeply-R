
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Flame, Scale, Sandwich, Fish, Carrot } from 'lucide-react';
import { cn } from '@/lib/utils';

// Schema for form validation
const formSchema = z.object({
  gender: z.enum(['male', 'female'], { required_error: 'لطفاً جنسیت را انتخاب کنید.' }),
  age: z.number({ required_error: 'لطفاً سن را وارد کنید.' }).min(15, 'سن باید حداقل ۱۵ سال باشد.').max(80, 'سن باید حداکثر ۸۰ سال باشد.'),
  weight: z.number({ required_error: 'لطفاً وزن را وارد کنید.' }).min(40, 'وزن باید حداقل ۴۰ کیلوگرم باشد.').max(200, 'وزن باید حداکثر ۲۰۰ کیلوگرم باشد.'),
  height: z.number({ required_error: 'لطفاً قد را وارد کنید.' }).min(140, 'قد باید حداقل ۱۴۰ سانتی‌متر باشد.').max(220, 'قد باید حداکثر ۲۲۰ سانتی‌متر باشد.'),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very', 'super'], { required_error: 'لطفاً سطح فعالیت را انتخاب کنید.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface CalorieResults {
  maintenance: number;
  mildLoss: number;
  weightLoss: number;
  mildGain: number;
  weightGain: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const activityLevels = [
  { value: 'sedentary', label: 'بی‌تحرک (کار اداری، بدون ورزش)' },
  { value: 'light', label: 'فعالیت کم (ورزش سبک ۱-۳ روز در هفته)' },
  { value: 'moderate', label: 'فعالیت متوسط (ورزش متوسط ۳-۵ روز در هفته)' },
  { value: 'very', label: 'فعالیت زیاد (ورزش سنگین ۶-۷ روز در هفته)' },
  { value: 'super', label: 'فعالیت خیلی زیاد (ورزش سنگین روزانه + شغل فیزیکی)' },
];

const activityFactors: Record<FormValues['activityLevel'], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  super: 1.9,
};

function formatNumber(value: number) {
    return new Intl.NumberFormat('fa-IR').format(value);
}

export function CalorieCalculator() {
  const [results, setResults] = useState<CalorieResults | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    let bmr: number;
    if (data.gender === 'male') {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5;
    } else {
      bmr = 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;
    }

    const tdee = bmr * activityFactors[data.activityLevel];

    const maintenance = Math.round(tdee);
    const mildLoss = Math.round(tdee - 250);
    const weightLoss = Math.round(tdee - 500);
    const mildGain = Math.round(tdee + 250);
    const weightGain = Math.round(tdee + 500);
    
    const proteinGrams = Math.round((maintenance * 0.3) / 4);
    const carbsGrams = Math.round((maintenance * 0.4) / 4);
    const fatGrams = Math.round((maintenance * 0.3) / 9);

    setResults({
      maintenance,
      mildLoss,
      weightLoss,
      mildGain,
      weightGain,
      macros: {
          protein: proteinGrams,
          carbs: carbsGrams,
          fat: fatGrams,
      }
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="ml-2 h-6 w-6 text-primary" />
            محاسبه‌گر کالری روزانه
          </CardTitle>
          <CardDescription>
            اطلاعات خود را وارد کنید تا میزان کالری مورد نیاز روزانه شما بر اساس هدفتان محاسبه شود.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>جنسیت</Label>
                <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                         <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">مرد</Label>
                            </div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">زن</Label>
                            </div>
                        </RadioGroup>
                    )}
                />
                {errors.gender && <p className="text-xs text-destructive mt-1">{errors.gender.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">سن (سال)</Label>
                <Input id="age" type="number" {...register('age', { valueAsNumber: true })} />
                {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">وزن (کیلوگرم)</Label>
                <Input id="weight" type="number" {...register('weight', { valueAsNumber: true })} />
                {errors.weight && <p className="text-xs text-destructive">{errors.weight.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">قد (سانتی‌متر)</Label>
                <Input id="height" type="number" {...register('height', { valueAsNumber: true })} />
                {errors.height && <p className="text-xs text-destructive">{errors.height.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="activityLevel">سطح فعالیت روزانه</Label>
                <Controller
                    control={control}
                    name="activityLevel"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="activityLevel">
                                <SelectValue placeholder="سطح فعالیت خود را انتخاب کنید..." />
                            </SelectTrigger>
                            <SelectContent>
                                {activityLevels.map(level => (
                                <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                 {errors.activityLevel && <p className="text-xs text-destructive mt-1">{errors.activityLevel.message}</p>}
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">محاسبه کن</Button>
          </CardFooter>
        </form>
      </Card>
      
      {results && (
        <Card className="animate-in fade-in-50">
            <CardHeader>
                <CardTitle>نتایج محاسبه شما</CardTitle>
                <CardDescription>بر اساس اطلاعات وارد شده، این مقادیر تخمینی برای اهداف مختلف شماست.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="p-4 border-2 border-primary rounded-lg text-center bg-primary/10">
                    <p className="text-md font-semibold text-primary">کالری برای حفظ وزن فعلی</p>
                    <p className="text-4xl font-bold text-primary mt-1">{formatNumber(results.maintenance)}</p>
                    <p className="text-sm text-primary/80">کالری در روز</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-3 border rounded-lg bg-card">
                        <p className="text-md font-semibold text-red-600 flex items-center"><Flame className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />کاهش وزن</p>
                        <div className="mt-2 space-y-1 text-sm">
                            <p>کاهش وزن ملایم (۰.۲۵ کیلوگرم در هفته): <span className="font-bold">{formatNumber(results.mildLoss)} کالری</span></p>
                            <p>کاهش وزن (۰.۵ کیلوگرم در هفته): <span className="font-bold">{formatNumber(results.weightLoss)} کالری</span></p>
                        </div>
                     </div>
                      <div className="p-3 border rounded-lg bg-card">
                        <p className="text-md font-semibold text-green-600 flex items-center"><Scale className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />افزایش وزن</p>
                         <div className="mt-2 space-y-1 text-sm">
                            <p>افزایش وزن ملایм (۰.۲۵ کیلوگرم در هفته): <span className="font-bold">{formatNumber(results.mildGain)} کالری</span></p>
                            <p>افزایش وزن (۰.۵ کیلوگرم در هفته): <span className="font-bold">{formatNumber(results.weightGain)} کالری</span></p>
                        </div>
                     </div>
                 </div>

                <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">پیشنهاد درشت‌مغذی‌ها (برای حفظ وزن)</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 border rounded-lg bg-blue-500/10">
                            <Carrot className="mx-auto h-8 w-8 text-blue-600 mb-1"/>
                            <p className="font-bold text-blue-800">{formatNumber(results.macros.carbs)} گرم</p>
                            <p className="text-xs text-blue-700">کربوهیدرات</p>
                        </div>
                         <div className="p-3 border rounded-lg bg-orange-500/10">
                            <Fish className="mx-auto h-8 w-8 text-orange-600 mb-1"/>
                            <p className="font-bold text-orange-800">{formatNumber(results.macros.protein)} گرم</p>
                            <p className="text-xs text-orange-700">پروتئین</p>
                        </div>
                         <div className="p-3 border rounded-lg bg-yellow-500/10">
                            <Sandwich className="mx-auto h-8 w-8 text-yellow-600 mb-1"/>
                            <p className="font-bold text-yellow-800">{formatNumber(results.macros.fat)} گرم</p>
                            <p className="text-xs text-yellow-700">چربی</p>
                        </div>
                    </div>
                </div>

            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">توجه: این مقادیر تخمینی هستند و ممکن است بر اساس متابولیسم فردی متفاوت باشند. برای نتایج دقیق‌تر با یک متخصص تغذیه مشورت کنید.</p>
             </CardFooter>
        </Card>
      )}
    </div>
  );
}
