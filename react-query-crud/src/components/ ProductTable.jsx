import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, addProduct, editProduct, deleteProduct } from "../api/productsApi";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Pagination,
  TextField,
  Button,
  Modal,
  TextareaAutosize,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";

// ProductTable component
const ProductTable = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState(""); // For filtering
  const [open, setOpen] = useState(false); // Modal visibility
  const [currentProduct, setCurrentProduct] = useState(null); // For editing product
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  // Fetch products with sorting, pagination, and filtering
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", page, sortBy, sortOrder, searchTerm],
    queryFn: fetchProducts,
    keepPreviousData: true,
  });

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle sorting by column
  const handleSort = (column) => {
    const isAscending = sortBy === column && sortOrder === "asc";
    setSortBy(column);
    setSortOrder(isAscending ? "desc" : "asc");
  };

  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when filtering
  };

  // Handle modal opening for adding/editing products
  const handleOpenModal = (product) => {
    setCurrentProduct(product);
    setOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpen(false);
    setCurrentProduct(null);
  };

  // Add new product
  const handleAddProduct = async (newProduct) => {
    try {
      await addProduct(newProduct);
      queryClient.invalidateQueries("products");
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  // Edit an existing product
  const handleEditProduct = async (updatedProduct) => {
    try {
      await editProduct(updatedProduct.id, updatedProduct);
      queryClient.invalidateQueries("products");
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      queryClient.invalidateQueries("products");
    } catch (error) {
      console.error(error);
    }
  };

  // Handle form submission (add/edit)
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const product = {
      title: form.title.value,
      brand: form.brand.value,
      price: form.price.value,
    };
    if (currentProduct) {
      handleEditProduct({ ...currentProduct, ...product });
    } else {
      handleAddProduct(product);
    }
  };

  // Loading and error handling
  if (isLoading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>Loading products...</Typography>
      </Box>
    );

  if (isError)
    return (
      <Box textAlign="center" mt={4}>
        <Alert severity="error">Error: {error.message}</Alert>
      </Box>
    );

  return (
    <Box maxWidth="md" mx="auto" mt={5}>
      <Typography variant="h5" gutterBottom align="center" mb={5} fontWeight="bold">
        🛍️ Product Table
      </Typography>

      {/* Search bar */}
      <Box mb={3} textAlign="center">
        <TextField
          label="Search by title or brand"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                <strong>ID</strong>
              </TableCell>
              <TableCell onClick={() => handleSort("title")} style={{ cursor: "pointer" }}>
                <strong>Title</strong>
              </TableCell>
              <TableCell onClick={() => handleSort("brand")} style={{ cursor: "pointer" }}>
                <strong>Brand</strong>
              </TableCell>
              <TableCell onClick={() => handleSort("price")} style={{ cursor: "pointer" }}>
                <strong>Price ($)</strong>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="primary" onClick={() => handleOpenModal(null)}>
                  Add Product
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.title}</TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenModal(p)} color="primary">
                    Edit
                  </Button>
                  <Button onClick={() => handleDeleteProduct(p.id)} color="secondary">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={Math.ceil(data.total / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Modal for adding/editing product */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          bgcolor="white"
          p={4}
          borderRadius={2}
          boxShadow={3}
          maxWidth={400}
          mx="auto"
          mt={5}
        >
          <Typography variant="h6" gutterBottom>
            {currentProduct ? "Edit Product" : "Add Product"}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              defaultValue={currentProduct ? currentProduct.title : ""}
              fullWidth
              required
              mb={2}
            />
            <TextField
              label="Brand"
              name="brand"
              defaultValue={currentProduct ? currentProduct.brand : ""}
              fullWidth
              required
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              defaultValue={currentProduct ? currentProduct.price : ""}
              fullWidth
              required
            />
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary">
                {currentProduct ? "Update" : "Add"} Product
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductTable;
