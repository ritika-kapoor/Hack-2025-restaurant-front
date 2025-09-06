import Link from 'next/link';

interface Store {
  id: string;
  name: string;
  prefecture: string;
  city: string;
  street: string;
}

async function getStores(): Promise<Store[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const res = await fetch(`${apiBaseUrl}/api/v1/stores`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch stores');
  }
  const data = await res.json();
  return data.data;
}

export default async function StoresPage() {
  const stores = await getStores();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">店舗一覧</h1>
      <ul className="space-y-2">
        {stores.map((store) => (
          <li key={store.id} className="p-4 border rounded-md shadow-sm hover:bg-gray-50">
            <Link href={`/product_register/${store.id}`} className="block">
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">{store.name}</h2>
              <p className="text-gray-600">{store.prefecture} {store.city} {store.street}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
