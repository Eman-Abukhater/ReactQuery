export const fetchProducts = async ({ queryKey }) => {
    const [_key, page, sortBy, sortOrder] = queryKey; // Destructure to get sortBy and sortOrder from queryKey
  
    const limit = 10;
    const skip = (page - 1) * limit;
    
    // Add sorting parameters to the API request
    const res = await fetch(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
    
    if (!res.ok) throw new Error("Failed to fetch products");
    
    const data = await res.json();
    return {
      products: data.products,
      total: data.total,
    };
  };
  