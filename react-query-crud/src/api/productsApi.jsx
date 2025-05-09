export const fetchProducts = async ({ queryKey }) => {
    const [_key, page] = queryKey;
    const limit = 10;
    const skip = (page - 1) * limit;
  
    const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error("Failed to fetch products");
  
    const data = await res.json();
    return {
      products: data.products,
      total: data.total,
    };
  };
  