import { env } from "@/env";
import axios from "axios";

// agora que colocamos a authenticação, precisamos colocar as credenciais nas requisições, colocando o withCredentials como true, faz com que os cookies sejam enviados para o backend
export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});

// se tiver a variavel de ambiente VITE_ENABLE_API_DELAY, então vamos fazer delay nas requisições
if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return config;
  });
}
