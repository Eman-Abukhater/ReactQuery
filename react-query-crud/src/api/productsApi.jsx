export const fetchProducts = async () => {
    const res = await fetch('https://dummyjson.com/products?limit=10');
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.products; // get only the list, not metadata
  };
  