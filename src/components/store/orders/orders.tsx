"use client"

import { useState } from "react"
import FilterStatus from "./filterStatus/filterStatus"
import OrderList from "./orderList/orderList"
import SearchCustomer from "./searchCustomer/searchCustomer"

type Order = {
  id: number
  user_id: number
  store_stock_id: number
  quantity: number
  total_price: number
  status: '予約中' | '受取済み' | 'キャンセル'
  ordered_at: string
  updated_at: string
}

type User = {
  id: number
  name: string
}

type StoreStock = {
  id: number
  store_id: number
  product_name: string
  price: number
}

// ダミーデータ
const users: User[] = [
  { id: 1, name: '田中 太郎' },
  { id: 2, name: '山田 花子' },
  { id: 3, name: '佐藤 次郎' },
]

const storeStocks: StoreStock[] = [
  { id: 201, store_id: 1, product_name: 'にんじん', price: 100 },
  { id: 202, store_id: 1, product_name: 'キャベツ', price: 80 },
  { id: 203, store_id: 2, product_name: 'にんにく', price: 120 },
]

const orders: Order[] = [
  {
    id: 101,
    user_id: 1,
    store_stock_id: 201,
    quantity: 2,
    total_price: 1200,
    status: '予約中',
    ordered_at: '2025-06-16T10:00:00Z',
    updated_at: '2025-06-16T10:05:00Z',
  },
  {
    id: 102,
    user_id: 2,
    store_stock_id: 202,
    quantity: 1,
    total_price: 600,
    status: '受取済み',
    ordered_at: '2025-06-15T14:30:00Z',
    updated_at: '2025-06-15T15:00:00Z',
  },
  {
    id: 103,
    user_id: 3,
    store_stock_id: 203,
    quantity: 3,
    total_price: 1500,
    status: 'キャンセル',
    ordered_at: '2025-06-14T09:00:00Z',
    updated_at: '2025-06-14T09:10:00Z',
  },
]

// ユーザー名と商品名を追加
const ordersWithDetails = orders.map(order => {
  const user = users.find(u => u.id === order.user_id)
  const stock = storeStocks.find(s => s.id === order.store_stock_id)
  return {
    ...order,
    user_name: user ? user.name : '名無し',
    product_name: stock ? stock.product_name : '不明'
  }
})

const nameList = Array.from(new Set(ordersWithDetails.map(o => o.user_name)))
const statusList = Array.from(new Set(ordersWithDetails.map(o => o.status)))

export default function Orders() {
  const [filterName, setFilterName] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredOrders = ordersWithDetails.filter(order => {
    const matchName = filterName === "" || order.user_name.includes(filterName)
    const matchStatus = filterStatus === "all" || order.status === filterStatus
    return matchName && matchStatus
  })

  return (
    <div className="space-y-4">
      <SearchCustomer nameList={nameList} onSelectName={setFilterName} />
      <FilterStatus statusList={statusList} onChangeStatus={setFilterStatus} />
      <OrderList storeOrdersList={filteredOrders} />
    </div>
  )
}