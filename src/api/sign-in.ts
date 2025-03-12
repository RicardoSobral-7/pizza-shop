import { api } from "@/lib/axios";

export interface SignInBody {
  email: string;
}

// interessante pra cada requisição fazer um arquivo com a função desacoplado do restante do código
export async function signIn({ email }: SignInBody) {
  await api.post("/authenticate", { email });
}
