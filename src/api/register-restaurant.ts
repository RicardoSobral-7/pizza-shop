import { api } from "@/lib/axios";

export interface RegisterRestaurantBody {
  email: string;
  managerName: string;
  phone: string;
  restaurantName: string;
}

// interessante pra cada requisição fazer um arquivo com a função desacoplado do restante do código
export async function registerRestaurant({
  email,
  managerName,
  phone,
  restaurantName,
}: RegisterRestaurantBody) {
  await api.post("/authenticate", {
    email,
    managerName,
    phone,
    restaurantName,
  });
}
