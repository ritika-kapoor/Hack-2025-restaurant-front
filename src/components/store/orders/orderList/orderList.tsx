import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
  } from "@/components/ui/table"
  import { Badge } from "@/components/ui/badge"
  
  interface StoreOrder {
    id: number
    user_name: string
    product_name: string
    quantity: number
    total_price: number
    status: string
    ordered_at: string
    updated_at: string
  }
  
  interface OrderListProps {
    storeOrdersList: StoreOrder[]
  }
  
  export default function OrderList({ storeOrdersList }: OrderListProps) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableCaption>注文一覧</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>顧客名</TableHead>
              <TableHead>商品名</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>合計金額</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>注文日時</TableHead>
              <TableHead>更新日時</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeOrdersList.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.user_name}</TableCell>
                <TableCell>{order.product_name}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.total_price}</TableCell>
                <TableCell>
                  <Badge>{order.status}</Badge>
                </TableCell>
                <TableCell>{new Date(order.ordered_at).toLocaleString()}</TableCell>
                <TableCell>{new Date(order.updated_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }