import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

interface MonthSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  return (
    <div className="flex items-center gap-4 bg-card/80 backdrop-blur-sm p-6 rounded-lg border border-border/50 shadow-sm">
      <Calendar className="h-5 w-5 text-court-green" />
      <div className="flex-1 max-w-xs">
        <Label htmlFor="month-selector" className="text-sm font-medium mb-2 block">
          Select Month
        </Label>
        <Input
          id="month-selector"
          type="month"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-background"
        />
      </div>
    </div>
  );
}
