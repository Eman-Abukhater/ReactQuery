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
} from "@mui/material";

const ProductTable = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

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
      <Typography variant="h4" gutterBottom align="center" mb={5} fontWeight='bold'>
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
            {products.map((p) => (
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
    </Box>
  );
};

export default ProductTable;
