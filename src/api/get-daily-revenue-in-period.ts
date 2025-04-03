import { api } from "@/lib/axios";

export type GetDailyRevenueInPeriodResponse = {
  date: string;
  receipt: number;
}[];

export interface GetdailyRevenueInPeriodQuery {
  from?: Date;
  to?: Date;
}

export async function getDailyRevenueInPeriod({
  to,
  from,
}: GetdailyRevenueInPeriodQuery) {
  const response = await api.get<GetDailyRevenueInPeriodResponse>(
    "/metrics/daily-receipt-in-period",
    {
      params: {
        from,
        to,
      },
    },
  );

  return response.data;
}
