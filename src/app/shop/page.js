import ShopClient from './shop';

export const metadata = {
  title: 'Խանութ | Բոլոր ապրանքները',
  description: 'Գտեք լավագույն ապրանքները մեր առցանց խանութում',
};

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: 'no-store',
    });
    
    if (!res.ok) throw new Error('Failed to fetch products');
    
    return await res.json();
  } catch (error) {
    console.error("Ошибка при загрузке товаров на сервере:", error);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main>
      <ShopClient initialProducts={products} />
    </main>
  );
}