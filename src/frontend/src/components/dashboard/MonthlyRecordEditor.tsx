import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CoachesTableEditor } from './CoachesTableEditor';
import { Save, Trash2, Loader2 } from 'lucide-react';
import { validateNumber, validateRequired } from '@/lib/validation';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { DashboardData } from '@/pages/DashboardPage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MonthlyRecordEditorProps {
  data: DashboardData;
  onChange: (data: DashboardData) => void;
  onSave: (data: DashboardData) => Promise<void>;
  onDelete: () => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
  hasExistingRecord: boolean;
  centerOptions: string[];
}

export function MonthlyRecordEditor({
  data,
  onChange,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  hasExistingRecord,
  centerOptions,
}: MonthlyRecordEditorProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRevenueChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    const error = validateNumber(numValue, 'Revenue');
    setErrors((prev) => ({ ...prev, revenue: error }));
    onChange({ ...data, revenue: numValue });
  };

  const handleTargetChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    const error = validateNumber(numValue, 'Target');
    setErrors((prev) => ({ ...prev, target: error }));
    onChange({ ...data, target: numValue });
  };

  const handleCenterNameChange = (value: string) => {
    const error = validateRequired(value, 'Center name');
    setErrors((prev) => ({ ...prev, centerName: error }));
    onChange({ 
      ...data, 
      centerName: value
    });
  };

  const handleSaveClick = async () => {
    const newErrors: Record<string, string> = {};
    
    const revenueError = validateNumber(data.revenue, 'Revenue');
    if (revenueError) newErrors.revenue = revenueError;
    
    const targetError = validateNumber(data.target, 'Target');
    if (targetError) newErrors.target = targetError;

    const centerNameError = validateRequired(data.centerName, 'Center name');
    if (centerNameError) newErrors.centerName = centerNameError;

    // Validate coaches
    data.coaches.forEach((coach, index) => {
      const nameError = validateRequired(coach.name, 'Coach name');
      if (nameError) newErrors[`coach-name-${index}`] = nameError;
      
      const salaryError = validateNumber(coach.salary, 'Salary');
      if (salaryError) newErrors[`coach-salary-${index}`] = salaryError;

      const centerError = validateRequired(coach.center, 'Coach center');
      if (centerError) newErrors[`coach-center-${index}`] = centerError;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await onSave(data);
    }
  };

  const hasErrors = Object.values(errors).some((error) => error !== '');

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Edit Monthly Record
        </CardTitle>
        <CardDescription>
          Update revenue, target, and manage coach salaries for the selected month
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Center Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Center Information</h3>
          <div className="space-y-2">
            <Label htmlFor="centerName">Center Name</Label>
            <Input
              id="centerName"
              type="text"
              placeholder="Enter center name"
              value={data.centerName}
              onChange={(e) => handleCenterNameChange(e.target.value)}
              className={errors.centerName ? 'border-destructive' : ''}
              list="center-options"
            />
            <datalist id="center-options">
              {centerOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
            {errors.centerName && (
              <p className="text-sm text-destructive">{errors.centerName}</p>
            )}
          </div>
        </div>

        {/* Revenue and Target */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="revenue">Revenue ($)</Label>
            <Input
              id="revenue"
              type="number"
              min="0"
              step="0.01"
              value={data.revenue}
              onChange={(e) => handleRevenueChange(e.target.value)}
              className={errors.revenue ? 'border-destructive' : ''}
            />
            {errors.revenue && (
              <p className="text-sm text-destructive">{errors.revenue}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target ($)</Label>
            <Input
              id="target"
              type="number"
              min="0"
              step="0.01"
              value={data.target}
              onChange={(e) => handleTargetChange(e.target.value)}
              className={errors.target ? 'border-destructive' : ''}
            />
            {errors.target && (
              <p className="text-sm text-destructive">{errors.target}</p>
            )}
          </div>
        </div>

        {/* Coaches Table */}
        <div className="space-y-2">
          <Label>Coaches</Label>
          <CoachesTableEditor
            coaches={data.coaches}
            onChange={(coaches) => onChange({ ...data, coaches })}
            errors={errors}
            centerOptions={centerOptions}
          />
        </div>

        {/* Error Alert */}
        {hasErrors && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the validation errors before saving.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSaveClick}
            disabled={isSaving || isDeleting}
            className="bg-court-green hover:bg-court-green/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>

          {hasExistingRecord && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isSaving || isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Record
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the record for this month. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
