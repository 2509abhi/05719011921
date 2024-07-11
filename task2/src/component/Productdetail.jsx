import React, { useState, useEffect } from "react";
import { fetchProductDetails } from "../services/api";
import { useParams } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductDetail = () => {
  const { productId, categoryname } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProductDetails(categoryname, productId).then((response) => {
      setProduct(response.data);
    });
  }, [productId, categoryname]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="container">
      <header className="header">
        <h1>Product Details</h1>
      </header>
      <Card className="product-details">
        <Card.Body>
          <Card.Title>{product.productName}</Card.Title>
          <Card.Text>Company: {product.companyName}</Card.Text>
          <Card.Text>Price: {product.price}</Card.Text>
          <Card.Text>Rating: {product.rating}</Card.Text>
          <Card.Text>Discount: {product.discount}%</Card.Text>
          <Card.Text>Availability: {product.availability}</Card.Text>
          <Button as={Link} to="/" variant="primary" className="button">
            Back to Products
          </Button>
        </Card.Body>
      </Card>
      <footer className="footer">
        <p>&copy; 2024 Your Company. All Rights Reserved.</p>
      </footer>
    </Container>
  );
};

export default ProductDetail;
