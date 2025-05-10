export const fetchProducts = async ({ queryKey }) => {
  const [_key, page, sortBy, sortOrder, search] = queryKey;
  const limit = 10;
  const skip = (page - 1) * limit;

  let url;

  if (search) {
    // If there's a search query, use the search endpoint
    url = `https://dummyjson.com/products/search?q=${search}&limit=${limit}&skip=${skip}`;
  } else {
    // Default listing
    url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();

  // Manual sorting
  let sortedProducts = [...data.products];
  if (sortBy) {
    sortedProducts.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (typeof valA === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
    });
  }

  return {
    products: sortedProducts,
    total: data.total,
  };
};

export const deleteProduct = async (id) => {
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json(); // returns deleted product
};

export const updateProduct = async (product) => {
  const res = await fetch(`https://dummyjson.com/products/${product.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json(); // returns updated product
};
