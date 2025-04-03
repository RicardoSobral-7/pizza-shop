import { api } from "@/lib/axios";

// unica forma de colocar um array no objeto mais exerno é com type
export type GetPopularProductsResponse = {
  product: string;
  amount: number;
}[];

export async function getPopularProducts() {
  const response = await api.get<GetPopularProductsResponse>(
    "/metrics/popular-products",
  );

  return response.data;
}
