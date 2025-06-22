import AllRegisterdFood from "@/components/store/Products/AllRegisterdFood/allRegisterdFood";
import ReservedFood from "@/components/store/reservedFood/reservedFood";
import ChartPieSimple from "@/components/store/soldFood/soldFood";

export default function Page() {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <ReservedFood />
          </div>
          <div className="col-span-1">
            <ChartPieSimple />
          </div>
        </div>
        <div className="mt-6">
          <AllRegisterdFood/>
        </div>
      </div>
    );
  }