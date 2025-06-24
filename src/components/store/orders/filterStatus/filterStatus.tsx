"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export default function FilterStatus({
  statusList,
  onChangeStatus
}: {
  statusList: string[]
  onChangeStatus: (status: string) => void
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ステータス絞り込み</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={onChangeStatus} defaultValue="all">
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="ステータスを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全て</SelectItem>
            {statusList.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}