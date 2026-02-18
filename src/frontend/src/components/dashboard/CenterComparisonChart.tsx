import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MonthlyDashboard } from '@/backend';

interface CenterComparisonChartProps {
  dashboards: MonthlyDashboard[];
  selectedMonth: number;
  selectedYear: number;
}

export function CenterComparisonChart({ dashboards, selectedMonth, selectedYear }: CenterComparisonChartProps) {
  // Filter dashboards for the selected month/year
  const filteredDashboards = dashboards.filter(
    (d) => Number(d.month) === selectedMonth && Number(d.year) === selectedYear
  );

  // Transform data for the chart
  const chartData = filteredDashboards.map((d) => ({
    center: d.centerName,
    'Revenue Done': d.revenue,
    'Target': d.target,
  }));

  // Empty state
  if (chartData.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Center Comparison</CardTitle>
          <CardDescription>
            Revenue vs Target by Center for {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No data available for the selected month
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle>Center Comparison</CardTitle>
        <CardDescription>
          Revenue vs Target by Center for {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="center" 
              angle={-45}
              textAnchor="end"
              height={100}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            <Bar 
              dataKey="Revenue Done" 
              fill="hsl(var(--court-green))" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Target" 
              fill="hsl(var(--destructive))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
