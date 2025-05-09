import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/productsApi";
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
} from "@mui/material";
import { useState } from "react";

const ProductTable = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: fetchProducts,
    keepPreviousData: true,
  });

  const handlePageChange = (event, value) => {
    setPage(value);
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
      <Typography variant="h5" gutterBottom align="center" mb={5} fontWeight='bold'>
        🛍️ Product Table
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Brand</strong></TableCell>
              <TableCell><strong>Price ($)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.title}</TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell>{p.price}</TableCell>
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
