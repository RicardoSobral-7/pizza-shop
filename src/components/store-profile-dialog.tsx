import { getManagedRestaurant } from "@/api/get-managed-restaurant";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod";
import { Button } from "./ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const storeProfileSchema = z.object({
  name: z.string().min(3),
  description: z.string()
})

type StoreProfileSchema = z.infer<typeof storeProfileSchema>

export function StoreProfileDialog() {
  // copiamos e colamos a mesma request lá do menu account e ela não será feita novamente devido ao cache do react query
  const { data: managedRestaurant } = useQuery({
    queryKey: ['managed-resturant'],
    queryFn: getManagedRestaurant,
  })

  // trocamos o default values para values pois se for preenchido depois  outro valor, vai receber os novos valores
  const { register } = useForm<StoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    values: {
      name: managedRestaurant?.name ?? '',
      description: managedRestaurant?.description ?? '',
    }
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento visíveis ao seu cliente
        </DialogDescription>
      </DialogHeader>
      <form>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">Nome</Label>
            <Input className="col-span-3" id='name' {...register('name')} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="description">Descrição</Label>
            <Textarea className="col-span-3" id='description' {...register('description')} />
          </div>
        </div>

        <DialogFooter>
          <Button variant='ghost' type="button">Cancelar</Button>
          <Button type='submit' variant='sucess'>Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}