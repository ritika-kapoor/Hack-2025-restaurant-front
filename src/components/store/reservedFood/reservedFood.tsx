import { Calendar } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ReservedFood() {
  // Dummy data for today's reservations
  const todayReservations = 16;
  
  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-blue-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-xl font-semibold text-blue-900">当日予約数</CardTitle>
        </div>
        <CardDescription className="text-blue-600">Today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <span className="text-5xl font-bold tracking-tight text-blue-700">{todayReservations}</span>
            <p className="text-sm text-blue-500 mt-1">件の予約</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}