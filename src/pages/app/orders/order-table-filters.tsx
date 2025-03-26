import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { z } from "zod";

const orderFiltersSchema = z.object({
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  status: z.string().optional(),
})

type OrderFiltersSchema = z.infer<typeof orderFiltersSchema>

export function OrderTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const orderId = searchParams.get('orderId') || ''
  const customerName = searchParams.get('customerName') || ''
  const status = searchParams.get('status') || 'all'


  const { register, handleSubmit, control, reset } = useForm<OrderFiltersSchema>({
    resolver: zodResolver(orderFiltersSchema),
    defaultValues: {
      orderId,
      customerName,
      status
    }
  })

  async function handleFilter({ orderId, customerName, status }: OrderFiltersSchema) {
    setSearchParams(prev => {
      if (orderId) {
        prev.set('orderId', orderId)
      } else {
        prev.delete('orderId')
      }

      if (customerName) {
        prev.set('customerName', customerName)

      } else {
        prev.delete('customerName')
      }

      if (status) {
        prev.set('status', status)

      } else {
        prev.delete('status')
      }
      // como filtramos é necessário voltar para página 1 pois pode não haver a página que estavamos
      prev.set('page', '1')

      return prev
    })
  }

  function handleClearFilters() {
    setSearchParams(prev => {
      prev.delete('orderId')
      prev.delete('customerName')
      prev.delete('status')
      prev.set('page', '1')
      return prev
    })
    reset({
      orderId: '',
      customerName: '',
      status: 'all'
    })
  }


  return (
    <form onSubmit={handleSubmit(handleFilter)} className="flex items-center gap-2">
      <span className="text-sm font-semibold">Filtros:</span>
      <Input placeholder="ID do pedido" className="h-8 w-auto" {...register('orderId')} />
      <Input placeholder="Nome do cliente" className="h-8 w-[320px]" {...register('customerName')} />
      {/* quando quiser usar o hook form em um componente não nativo do html */}
      {/* refere a um value do select item */}
      <Controller
        name="status"
        control={control}
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              defaultValue="all"
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[180px]">
                {/* o select value mostra o valor que foi selecionado do select */}
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
                <SelectItem value="processing">Em preparo</SelectItem>
                <SelectItem value="delivering">Em entrega</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
              </SelectContent>
            </Select>
          )
        }}
      />


      <Button type="submit" variant={"secondary"} size={"xs"}>
        <Search className="h-4 w-4 mr-2" />
        Filtrar resultados
      </Button>
      <Button
        type="button"
        variant={"outline"}
        size={"xs"}
        onClick={handleClearFilters}
      >
        <X className="h-4 w-4 mr-2" />
        Remover filtros
      </Button>
    </form>
  )
}