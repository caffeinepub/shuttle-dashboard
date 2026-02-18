import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import type { Coach } from '@/pages/DashboardPage';

interface CoachesTableEditorProps {
  coaches: Coach[];
  onChange: (coaches: Coach[]) => void;
  errors: Record<string, string>;
}

export function CoachesTableEditor({ coaches, onChange, errors }: CoachesTableEditorProps) {
  const handleAddCoach = () => {
    const newCoach: Coach = {
      id: `coach-${Date.now()}`,
      name: '',
      salary: 0,
      center: '',
    };
    onChange([...coaches, newCoach]);
  };

  const handleRemoveCoach = (id: string) => {
    onChange(coaches.filter((coach) => coach.id !== id));
  };

  const handleUpdateCoach = (id: string, field: 'name' | 'salary' | 'center', value: string | number) => {
    onChange(
      coaches.map((coach) =>
        coach.id === id ? { ...coach, [field]: value } : coach
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[35%]">Coach Name</TableHead>
              <TableHead className="w-[30%]">Center</TableHead>
              <TableHead className="w-[25%]">Salary ($)</TableHead>
              <TableHead className="w-[10%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coaches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No coaches added yet. Click "Add Coach" to get started.
                </TableCell>
              </TableRow>
            ) : (
              coaches.map((coach, index) => (
                <TableRow key={coach.id}>
                  <TableCell>
                    <Input
                      value={coach.name}
                      onChange={(e) => handleUpdateCoach(coach.id, 'name', e.target.value)}
                      placeholder="Enter coach name"
                      className={errors[`coach-name-${index}`] ? 'border-destructive' : ''}
                    />
                    {errors[`coach-name-${index}`] && (
                      <p className="text-xs text-destructive mt-1">
                        {errors[`coach-name-${index}`]}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      value={coach.center}
                      onChange={(e) => handleUpdateCoach(coach.id, 'center', e.target.value)}
                      placeholder="Enter center name"
                      className={errors[`coach-center-${index}`] ? 'border-destructive' : ''}
                    />
                    {errors[`coach-center-${index}`] && (
                      <p className="text-xs text-destructive mt-1">
                        {errors[`coach-center-${index}`]}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={coach.salary}
                      onChange={(e) =>
                        handleUpdateCoach(coach.id, 'salary', parseFloat(e.target.value) || 0)
                      }
                      placeholder="0.00"
                      className={errors[`coach-salary-${index}`] ? 'border-destructive' : ''}
                    />
                    {errors[`coach-salary-${index}`] && (
                      <p className="text-xs text-destructive mt-1">
                        {errors[`coach-salary-${index}`]}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCoach(coach.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddCoach}
        className="w-full border-dashed border-court-green/50 text-court-green hover:bg-court-green/10 hover:text-court-green"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Coach
      </Button>
    </div>
  );
}
