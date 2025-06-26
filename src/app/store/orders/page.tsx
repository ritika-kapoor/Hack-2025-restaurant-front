import Orders from "@/components/store/orders/orders";

 * Renders the order list page with a heading and the Orders component.
 *
 * Displays a heading labeled "注文一覧" (Order List) above the list of orders.
 */
export default function Page() {
  return (
    <div>
      <p>注文一覧</p>
      <Orders />
    </div>
  );
}