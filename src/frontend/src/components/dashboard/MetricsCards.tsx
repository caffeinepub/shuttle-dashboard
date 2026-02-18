import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Users, Percent } from 'lucide-react';

interface MetricsCardsProps {
  revenue: number;
  target: number;
  totalCoachSalaries: number;
  salaryOutputPercent: number;
}

export function MetricsCards({
  revenue,
  target,
  totalCoachSalaries,
  salaryOutputPercent,
}: MetricsCardsProps) {
  const targetProgress = target > 0 ? (revenue / target) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Revenue Card */}
      <Card className="bg-gradient-to-br from-court-green/10 to-court-green/5 border-court-green/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-court-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${revenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Monthly earnings</p>
        </CardContent>
      </Card>

      {/* Target Card */}
      <Card className="bg-gradient-to-br from-court-line/10 to-court-line/5 border-court-line/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Target</CardTitle>
          <Target className="h-4 w-4 text-court-line" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${target.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {targetProgress.toFixed(1)}% achieved
          </p>
        </CardContent>
      </Card>

      {/* Coaches Salary Card */}
      <Card className="bg-gradient-to-br from-shuttle-yellow/10 to-shuttle-yellow/5 border-shuttle-yellow/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Coaches Salary</CardTitle>
          <Users className="h-4 w-4 text-shuttle-yellow" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalCoachSalaries.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Total payroll</p>
        </CardContent>
      </Card>

      {/* Salary Output % Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Salary Output</CardTitle>
          <Percent className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {revenue > 0 ? salaryOutputPercent.toFixed(1) : '0.0'}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {revenue > 0 ? 'Of revenue' : 'N/A'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
