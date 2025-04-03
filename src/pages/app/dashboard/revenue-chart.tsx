import { getDailyRevenueInPeriod } from "@/api/get-daily-revenue-in-period";
import { DatePickerWithRange } from "@/components/date-range-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";

import colors from 'tailwindcss/colors';

export function RevenueChart() {
  // subDays pega a data desejada e subtrai 7 dias
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  const { data: dailyRevenueInPeriod } = useQuery({
    queryKey: ['metrics', 'daily-revenue-in-period', dateRange],
    queryFn: () => getDailyRevenueInPeriod({ from: dateRange?.from, to: dateRange?.to })
  })

  const chartData = useMemo(() => {
    return dailyRevenueInPeriod?.map(chartItem => {
      return {
        date: chartItem.date,
        receipt: chartItem.receipt / 100
      }
    })
  }, [dailyRevenueInPeriod])

  return (
    <Card className="col-span-6">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Receita no período</CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Label>Periodo</Label>
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
        </div>
      </CardHeader>
      <CardContent>
        {chartData &&
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} style={{ fontSize: 12 }}>
              {/* o Y axis mostra pra gente o valor no gráfico em reais e o X a data os dataKey refere-se aos campos que colocamos no data*/}
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                dy={16}
              />
              <YAxis
                stroke="#888"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                width={80}
              />
              <CartesianGrid vertical={false} className="stroke-muted" />
              <Line
                type="linear"
                strokeWidth={2}
                dataKey="receipt"
                stroke={colors.violet['500']}
              />
            </LineChart>
          </ResponsiveContainer>
        }
      </CardContent>
    </Card>
  )
}