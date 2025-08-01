"use client"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { useState } from "react"

export default function SearchCustomer({
  nameList,
  onSelectName
}: {
  nameList: string[]
  onSelectName: (name: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNames = nameList.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">顧客検索</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="顧客名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="mt-4">
          <ScrollArea className="h-[100px] rounded-md border p-4">
            {filteredNames.length > 0 ? (
              filteredNames.map((name) => (
                <div
                  key={name}
                  onClick={() => onSelectName(name)}
                  className="py-2 px-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  {name}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                該当する顧客が見つかりません
              </p>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}