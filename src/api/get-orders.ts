import { api } from "@/lib/axios";

interface GetOrdersSearchParams {
  pageIndex?: number | null;
}

interface GetOrdersResponse {
  orders: {
    orderId: string;
    createdAt: string;
    status: "pending" | "canceled" | "processing" | "delivering" | "delivered";
    customerName: string;
    total: number;
  }[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getOrders({ pageIndex }: GetOrdersSearchParams) {
  // forma de enviar parametros na url
  const response = await api.get<GetOrdersResponse>("/orders", {
    params: {
      pageIndex: pageIndex,
    },
  });

  return response.data;
}
