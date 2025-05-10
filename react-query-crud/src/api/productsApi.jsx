export const fetchProducts = async ({ queryKey }) => {
  const [_key, page, sortBy, sortOrder] = queryKey;
  const limit = 10;
  const skip = (page - 1) * limit;

  const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
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
