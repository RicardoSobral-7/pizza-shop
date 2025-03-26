type OrderStatus = "pending" | "canceled" | "processing" | "delivering" | "delivered";

interface OrderStatusProps {
  status: OrderStatus
}

// isso faz com que as chaves que estão no orderStatus possam receber um valor
const orderStatusMap: Record<OrderStatus, string> = {
  pending: 'Pendente',
  canceled: 'Cancelado',
  delivered: 'Entregue',
  delivering: 'Saiu para entrega',
  processing: 'Em preparo'
}

export function OrderStatus({ status }: OrderStatusProps) {
  return (
    <div className="flex items-center gap-2">

      {status === 'pending' && (
        <span className="h-2 w-2 rounded-full bg-slate-400" />
      )}

      {status === 'canceled' && (
        <span className="h-2 w-2 rounded-full bg-rose-500" />
      )}

      {status === 'delivered' && (
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
      )}

      {['delivering', 'processing'].includes(status) && (
        <span className="h-2 w-2 rounded-full bg-amber-500" />
      )}

      <span className="font-medium text-muted-foreground">{orderStatusMap[status]}</span>
    </div>
  )
}