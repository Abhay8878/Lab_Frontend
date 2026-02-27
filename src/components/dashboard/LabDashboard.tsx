// src/components/dashboard/LabDashboard.tsx
import strings from "../../language";
import { useLanguage } from "../../language/useLanguage";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "../ui/chart";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const productByCategory = [
  { category: "Crown", value: 120 },
  { category: "Bridge", value: 80 },
  { category: "Aligner", value: 45 },
  { category: "Implant", value: 60 },
];

const productStatusData = [
  { status: "In Production", value: 75 },
  { status: "Completed", value: 40 },
  { status: "On Hold", value: 15 },
  { status: "Cancelled", value: 5 },
];

const monthlyBillingData = [
  { month: "Jan", amount: 120000, profit: 38000 },
  { month: "Feb", amount: 95000, profit: 30000 },
  { month: "Mar", amount: 132000, profit: 44000 },
  { month: "Apr", amount: 110000, profit: 36000 },
  { month: "May", amount: 145000, profit: 51000 },
  { month: "Jun", amount: 138000, profit: 48000 },
];

const billingByProductType = [
  { type: "Crown", amount: 75000 },
  { type: "Bridge", amount: 54000 },
  { type: "Aligner", amount: 32000 },
  { type: "Implant", amount: 61000 },
];

const productChartConfig = {
  value: {
    label: "Products",
  },
} satisfies ChartConfig;

const statusChartConfig = {
  value: {
    label: "Orders",
  },
} satisfies ChartConfig;

const monthlyBillingChartConfig = {
  amount: {
    label: "Billing ($)",
  },
  profit: {
    label: "Profit ($)",
  },
} satisfies ChartConfig;

const billingTypeChartConfig = {
  amount: {
    label: "Billing ($)",
  },
} satisfies ChartConfig;

const CHART_COLORS = {
  primary: "#38c7bb",
  secondary: "#2860da",
  accent: "#fb822b",
  muted: "#a46cd8", // purple
};

// Pie slice colors
const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.muted,
];

const latestMonth = monthlyBillingData[monthlyBillingData.length - 1];
const latestMargin = Math.round(
  (latestMonth.profit / latestMonth.amount) * 100,
);

export default function LabDashboard() {
  const { language } = useLanguage();
  const t = strings[language];
  return (
    <section className="w-full space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-muted">
          <CardHeader className="pb-2">
            <CardTitle className=" font-medium textblack">
              {t.dashboard.genInfo1.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight text-black">
              305
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t.dashboard.genInfo1.disc}
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-foreground text-black">
              {t.dashboard.genInfo2.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold  text-black">90</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t.dashboard.genInfo2.disc}
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted">
          <CardHeader className="pb-2">
            <CardTitle className=" font-medium text-foreground">
              {t.dashboard.genInfo3.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight text-[#85BB65]">
              $1.45M
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t.dashboard.genInfo3.disc}
            </p>
          </CardContent>
        </Card>

        <Card className="border-muted">
          <CardHeader className="pb-2">
            <CardTitle className=" font-medium text-foreground">
              {t.dashboard.genInfo4.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight ">92%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t.dashboard.genInfo4.disc}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              {t.dashboard.chart1.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={productChartConfig}
              className="h-[260px] w-full"
            >
              <BarChart data={productByCategory}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={32}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  fill={CHART_COLORS.primary}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              {t.dashboard.chart2.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer
              config={statusChartConfig}
              className="h-[260px] w-full"
            >
              <ResponsiveContainer>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Pie
                    data={productStatusData}
                    dataKey="value"
                    nameKey="status"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {productStatusData.map((entry, index) => (
                      <Cell
                        key={entry.status}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              {t.dashboard.chart3.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={monthlyBillingChartConfig}
              className="h-[260px] w-full"
            >
              <LineChart data={monthlyBillingData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />

                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Billing"
                  stroke={CHART_COLORS.secondary}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke={CHART_COLORS.accent}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Latest Month</p>
                <p className="font-medium">{latestMonth.month}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Billing</p>
                <p className="font-medium">
                  ${(latestMonth.amount / 1000).toFixed(1)}k
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Profit Margin</p>
                <p className="font-medium">{latestMargin}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              {t.dashboard.chart4.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={billingTypeChartConfig}
              className="h-[260px] w-full"
            >
              <BarChart data={billingByProductType}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="type"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="amount"
                  radius={[6, 6, 0, 0]}
                  fill={CHART_COLORS.accent}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
