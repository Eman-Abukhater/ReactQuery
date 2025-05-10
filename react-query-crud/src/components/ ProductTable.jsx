import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProducts,
  deleteProduct,
  updateProduct,
} from "../api/productsApi";
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
} from "@mui/material";
import { useState } from "react";

const ProductTable = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("title"); // Default sorting by title
  const [sortOrder, setSortOrder] = useState("asc"); // Default ascending order
  const [search, setSearch] = useState(""); // Search state
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      alert("Product deleted");
      queryClient.invalidateQueries(["products"]); // refetch products
    },
    onError: () => {
      alert("Delete failed");
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      alert("Product updated");
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => {
      alert("Update failed");
    },
  });

  // Fetch the data with sorting
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", page, sortBy, sortOrder, search],
    queryFn: fetchProducts,
    keepPreviousData: true,
  });

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };
  const handleSort = (column) => {
    // Toggle sorting direction when the same column is clicked
    const isAscending = sortBy === column && sortOrder === "asc";
    setSortBy(column);
    setSortOrder(isAscending ? "desc" : "asc");
  };

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
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        mb={5}
        fontWeight="bold"
      >
        🛍️ Product Table
      </Typography>

      <Box mb={3}>
        <TextField
          label="Search by title or brand"
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearchChange}
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort("id")}>
                <strong>ID</strong>
              </TableCell>
              <TableCell onClick={() => handleSort("title")}>
                <strong>Title</strong>
              </TableCell>
              <TableCell onClick={() => handleSort("brand")}>
                <strong>Brand</strong>
              </TableCell>
              <TableCell onClick={() => handleSort("price")}>
                <strong>Price ($)</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
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
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => deleteMutation.mutate(p.id)}
                  >
                    Delete
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      updateMutation.mutate({
                        ...p,
                        title: p.title + " (Updated)",
                      })
                    }
                    style={{ marginLeft: 8 }}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={Math.ceil(data.total / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ProductTable;
