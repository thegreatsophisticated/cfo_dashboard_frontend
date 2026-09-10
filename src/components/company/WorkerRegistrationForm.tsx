import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DISTRICTS, LANGUAGES, EXPERIENCE_LEVELS, WORK_TYPES } from '@/types/worker';
import { useToast } from '@/hooks/use-toast';

const workerSchema = z.object({
  nationalId: z.string().min(16, 'National ID must be 16 characters').max(16),
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  phone: z.string().min(10, 'Valid phone number required').max(15),
  gender: z.enum(['male', 'female']),
  age: z.number().min(18, 'Must be at least 18').max(65, 'Must be under 65'),
  district: z.string().min(1, 'District is required'),
  sector: z.string().min(1, 'Sector is required'),
  experience: z.string().min(1, 'Experience level is required'),
  salaryMin: z.number().min(0, 'Minimum salary required'),
  salaryMax: z.number().min(0, 'Maximum salary required'),
  hasInsurance: z.boolean(),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  workTypes: z.array(z.string()).min(1, 'Select at least one work type'),
  refereeInfo: z.string().optional(),
});

type WorkerFormData = z.infer<typeof workerSchema>;

interface WorkerRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorkerFormData) => void;
}

export const WorkerRegistrationForm = ({
  isOpen,
  onClose,
  onSubmit,
}: WorkerRegistrationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Kinyarwanda']);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<WorkerFormData>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      hasInsurance: false,
      languages: ['Kinyarwanda'],
      workTypes: [],
    },
  });

  const handleLanguageToggle = (lang: string) => {
    const updated = selectedLanguages.includes(lang)
      ? selectedLanguages.filter((l) => l !== lang)
      : [...selectedLanguages, lang];
    setSelectedLanguages(updated);
    setValue('languages', updated);
  };

  const handleWorkTypeToggle = (type: string) => {
    const updated = selectedWorkTypes.includes(type)
      ? selectedWorkTypes.filter((t) => t !== type)
      : [...selectedWorkTypes, type];
    setSelectedWorkTypes(updated);
    setValue('workTypes', updated);
  };

  const onFormSubmit = async (data: WorkerFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onSubmit(data);
      toast({
        title: 'Worker Registered',
        description: `${data.firstName} ${data.lastName} has been registered successfully.`,
      });
      reset();
      setSelectedLanguages(['Kinyarwanda']);
      setSelectedWorkTypes([]);
      onClose();
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'Failed to register worker. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Register New Worker</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Photo Upload */}
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <Button type="button" variant="outline" size="sm">
                Upload Photo
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">
                JPG or PNG, max 2MB
              </p>
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nationalId">National ID (NIDA)</Label>
              <Input
                id="nationalId"
                placeholder="1199XXXXXXXXXX"
                {...register('nationalId')}
              />
              {errors.nationalId && (
                <p className="text-xs text-destructive">{errors.nationalId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+250788XXXXXX"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="First name"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Last name"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => setValue('gender', value as 'male' | 'female')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-destructive">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                {...register('age', { valueAsNumber: true })}
              />
              {errors.age && (
                <p className="text-xs text-destructive">{errors.age.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Select onValueChange={(value) => setValue('district', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district && (
                <p className="text-xs text-destructive">{errors.district.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
                placeholder="Enter sector"
                {...register('sector')}
              />
              {errors.sector && (
                <p className="text-xs text-destructive">{errors.sector.message}</p>
              )}
            </div>
          </div>

          {/* Experience & Salary */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
              <Select onValueChange={(value) => setValue('experience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.experience && (
                <p className="text-xs text-destructive">{errors.experience.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryMin">Min Salary (RWF)</Label>
              <Input
                id="salaryMin"
                type="number"
                placeholder="30000"
                {...register('salaryMin', { valueAsNumber: true })}
              />
              {errors.salaryMin && (
                <p className="text-xs text-destructive">{errors.salaryMin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryMax">Max Salary (RWF)</Label>
              <Input
                id="salaryMax"
                type="number"
                placeholder="50000"
                {...register('salaryMax', { valueAsNumber: true })}
              />
              {errors.salaryMax && (
                <p className="text-xs text-destructive">{errors.salaryMax.message}</p>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <Label>Languages Spoken</Label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <Button
                  key={lang}
                  type="button"
                  variant={selectedLanguages.includes(lang) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleLanguageToggle(lang)}
                >
                  {lang}
                </Button>
              ))}
            </div>
            {errors.languages && (
              <p className="text-xs text-destructive">{errors.languages.message}</p>
            )}
          </div>

          {/* Work Types */}
          <div className="space-y-2">
            <Label>Work Type Preferences</Label>
            <div className="flex flex-wrap gap-2">
              {WORK_TYPES.map((type) => (
                <Button
                  key={type.value}
                  type="button"
                  variant={selectedWorkTypes.includes(type.value) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleWorkTypeToggle(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
            {errors.workTypes && (
              <p className="text-xs text-destructive">{errors.workTypes.message}</p>
            )}
          </div>

          {/* Insurance */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="hasInsurance"
              onCheckedChange={(checked) => setValue('hasInsurance', !!checked)}
            />
            <Label htmlFor="hasInsurance" className="cursor-pointer">
              Worker has health insurance
            </Label>
          </div>

          {/* Referee Info */}
          <div className="space-y-2">
            <Label htmlFor="refereeInfo">Referee Information (Optional)</Label>
            <Textarea
              id="refereeInfo"
              placeholder="Enter referee name, phone, and relationship"
              {...register('refereeInfo')}
            />
          </div>

          {/* Payment Notice */}
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-sm text-foreground">
              <strong>Registration Fee:</strong> 500 RWF will be charged for this worker registration.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Worker
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
