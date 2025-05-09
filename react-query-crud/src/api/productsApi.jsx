export const fetchProducts = async ({ queryKey }) => {
    const [_key, page, sortBy, sortOrder, searchTerm] = queryKey;
    const limit = 10;
    const skip = (page - 1) * limit;
  
    const res = await fetch(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}&sortBy=${sortBy}&sortOrder=${sortOrder}&q=${searchTerm || ''}`
    );
  
    if (!res.ok) throw new Error("Failed to fetch products");
  
    const data = await res.json();
    return {
      products: data.products,
      total: data.total,
    };
  };
  
  export const addProduct = async (newProduct) => {
    const res = await fetch("https://dummyjson.com/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
  
    if (!res.ok) throw new Error("Failed to add product");
    return res.json();
  };
  
  export const editProduct = async (id, updatedProduct) => {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
  
    if (!res.ok) throw new Error("Failed to update product");
    return res.json();
  };
  
  export const deleteProduct = async (id) => {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      method: "DELETE",
    });
  
    if (!res.ok) throw new Error("Failed to delete product");
    return res.json();
  };
  