import React, { useState, useEffect } from "react";
import { fetchProducts } from "../services/api";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("Laptop");
  const [sort, setSort] = useState("rating");
  const [order, setOrder] = useState("asc");
  const [minPrice, setMinPrice] = useState(10);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [n, setN] = useState(10);
  const [page, setPage] = useState(1);
  const categories = [
    "Laptop",
    "Phone",
    "Computer",
    "TV",
    "Earphone",
    "Tablet",
    "Charger",
    "Mouse",
    "Keypad",
    "Bluetooth",
    "Pendrive",
    "Remote",
    "Speaker",
    "Headset",
    "PC",
  ];
  useEffect(() => {
    fetchProducts(category, { sort, order, minPrice, maxPrice, n, page }).then(
      (response) => {
        setProducts(response.data);
      }
    );
  }, [category, sort, order, minPrice, maxPrice, n, page]);

  return (
    <Container className="container">
      <header className="header">
        <h1>Product List</h1>
      </header>
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="topNInput">
              <Form.Label>Top N Products</Form.Label>
              <Form.Control
                type="number"
                value={n}
                onChange={(e) => setN(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="categorySelect">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="minPriceInput">
              <Form.Label>Min Price</Form.Label>
              <Form.Control
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="maxPriceInput">
              <Form.Label>Max Price</Form.Label>
              <Form.Control
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="sortSelect">
              <Form.Label>Sort By</Form.Label>
              <Form.Control
                as="select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="discount">Discount</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="orderSelect">
              <Form.Label>Order</Form.Label>
              <Form.Control
                as="select"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row>
        {products.map((product) => (
          <Col xs={12} sm={6} md={4} key={product.id} className="mb-3">
            <Card className="card">
              <Card.Body className="card-content">
                <i className="fas fa-laptop fa-2x mb-3"></i>
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text>Company: {product.companyName}</Card.Text>
                <Card.Text>Price: {product.price}</Card.Text>
                <Card.Text>Rating: {product.rating}</Card.Text>
                <Card.Text>Discount: {product.discount}%</Card.Text>
                <Card.Text>Availability: {product.availability}</Card.Text>
                <Button
                  as={Link}
                  to={`/product/${product.id}`}
                  variant="primary"
                  className="button"
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <footer className="footer">
        <p>&copy; 2024 Demi Company. All Rights Reserved.</p>
      </footer>
    </Container>
  );
};

export default ProductList;
