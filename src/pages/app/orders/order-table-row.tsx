import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { ArrowRight, Search, X } from "lucide-react";
import { OrderDetails } from "./order-details";
import { OrderStatus } from "@/components/order-status";
import { ptBR } from 'date-fns/locale'
import { formatDistanceToNow } from 'date-fns'
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/api/cancel-order";
import { queryClient } from "@/lib/react-query";
import { GetOrdersResponse } from "@/api/get-orders";
import { approveOrder } from "@/api/approve-order";
import { deliverOrder } from "@/api/deliver-order";
import { dispatchOrder } from "@/api/dispatch-order";

export interface OrderTableRowProps {
  order: {
    orderId: string;
    createdAt: string;
    status: "pending" | "canceled" | "processing" | "delivering" | "delivered";
    customerName: string;
    total: number;
  }
}

export function OrderTableRow({ order }: OrderTableRowProps) {
  // nesse momento nos deparamos com um problema no dialog que ele está chamando diversas requisições, pra resolver isso vamos fazer um estado e passar para os dialog, antes dessa mudança ele era uncontrolled agora com esse estado ele é controlled, ai vamos precisar passar para o componente se o details dele está aberto, isso vai para a requisição, onde irá habilitar a requisição
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const queryClient = useQueryClient()

  function updateOrderStatusOnCache(orderId: string, status: OrderStatus) {
    // aqui ele vai pegar todas  as queries datas que possui a querykey orders
    const cached = queryClient.getQueriesData<GetOrdersResponse>({
      queryKey: ['orders']
    })

    //  a baixo fazemos um foreach onde a primeira parte do array é a key a segunda é os dados, sabendo disso vamos ao query client e setaremos o novo dado, pegamos a key que vem ai desestruturamos o que não vamos mudar, vamos apenas no order, ai fazemos um map no order, encontramos por meio do id e ai sim trocamos o status, se os id's não baterem retorna normal
    cached.forEach(([cacheKey, cacheData],) => {
      if (!cacheData) {
        return
      }
      queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
        ...cacheData,
        orders: cacheData.orders.map((order) => {
          if (order.orderId === orderId) {
            return {
              ...order,
              status
            }
          }
          return order
        })
      })
    })
  }

  const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } = useMutation({
    mutationFn: approveOrder,
    async onSuccess(_, { orderId }) {
      updateOrderStatusOnCache(orderId, 'processing')
    },
  })

  const { mutateAsync: cancelOrderFn, isPending: isCancelingOrder } = useMutation({
    mutationFn: cancelOrder,
    async onSuccess(_, { orderId }) {
      updateOrderStatusOnCache(orderId, 'canceled')
    },
  })

  const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } = useMutation({
    mutationFn: dispatchOrder,
    async onSuccess(_, { orderId }) {
      updateOrderStatusOnCache(orderId, 'delivering')
    },
  })

  const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } = useMutation({
    mutationFn: deliverOrder,
    async onSuccess(_, { orderId }) {
      updateOrderStatusOnCache(orderId, 'delivered')
    },
  })

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>
          <OrderDetails orderId={order.orderId} open={isDetailsOpen} />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {order.orderId}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {/* formatamos do momento que foi feito / criado até a data atual */}
        {formatDistanceToNow(order.createdAt, {
          locale: ptBR,
          addSuffix: true
        })}
      </TableCell>
      <TableCell>
        <OrderStatus status={order.status} />
      </TableCell>
      <TableCell className="font-medium">
        {order.customerName}
      </TableCell>
      <TableCell className="font-medium">
        {(order.total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </TableCell>
      <TableCell>
        {order.status === 'pending' && (
          <Button
            onClick={() => approveOrderFn({ orderId: order.orderId })}
            variant="outline"
            disabled={isApprovingOrder}
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Aprovar
          </Button>
        )}

        {order.status === 'processing' && (
          <Button
            onClick={() => dispatchOrderFn({ orderId: order.orderId })}
            variant="outline"
            disabled={isDispatchingOrder}
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Em entrega
          </Button>
        )}

        {order.status === 'delivering' && (
          <Button
            onClick={() => deliverOrderFn({ orderId: order.orderId })}
            variant="outline"
            disabled={isDeliveringOrder}
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Entregue
          </Button>
        )}

      </TableCell>
      <TableCell>
        <Button
          disabled={!['pending', 'processing'].includes(order.status) || isCancelingOrder}
          variant="ghost"
          onClick={() => cancelOrderFn({ orderId: order.orderId })}
          size="xs"
        >
          <X className="mr-2 h-3 w-3" />
          Cancelar
        </Button>
      </TableCell>
    </TableRow>
  )
}