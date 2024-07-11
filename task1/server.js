const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
//this data can be store in env file
const AUTH_URL = "http://20.244.56.144/test/auth";
const AUTH_PAYLOAD = {
  companyName: "GGSIPU",
  clientID: "6f256e18-af52-4755-956b-4199573718fd",
  clientSecret: "PyWmmGebzfzPASjJ",
  ownerName: "Abhishek Bansal",
  ownerEmail: "abhishekbansal8948@gmail.com",
  rollNo: "05719011921",
};
// List of all companies
const COMPANIES = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
// URL for fetching data
const BASE_URL =
  "http://20.244.56.144/test/companies/{company}/categories/{category}/products";

let token;

app.use(cors());
app.use(express.json());
// Use for ID purpose
const productIdSave = {};

// Use to generate dynamic bearer token
async function getBearerToken() {
  const response = await axios.post(AUTH_URL, AUTH_PAYLOAD);
  if (response.status === 201) {
    const data = response.data;
    token = data.access_token;
  } else {
    throw new Error("Failed to retrieve bearer token");
  }

  return token;
}

async function fetchProductsFromCompany(
  company,
  category,
  minPrice,
  maxPrice,
  top
) {
  const url = BASE_URL.replace("{company}", company).replace(
    "{category}",
    category
  );
  const token = await getBearerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const params = {
    top,
    minPrice: minPrice !== undefined ? minPrice : 0,
    maxPrice: maxPrice !== undefined ? maxPrice : 1000000,
  };

  try {
    const response = await axios.get(url, { headers, params });
    // Add company name to each product
    const productsWithCompany = response.data.map((product) => ({
      ...product,
      companyName: company,
    }));
    return productsWithCompany;
  } catch (error) {
    console.error(
      `Failed to fetch products from ${company} - Status Code: ${
        error.response ? error.response.status : "Unknown"
      } - Response: ${
        error.response ? JSON.stringify(error.response.data) : error.message
      }`
    );
    return [];
  }
}

async function aggregateProducts(category, minPrice, maxPrice, top) {
  const allProducts = [];
  for (const company of COMPANIES) {
    const products = await fetchProductsFromCompany(
      company,
      category,
      minPrice,
      maxPrice,
      top
    );
    allProducts.push(...products);
  }
  return allProducts;
}

function generateUniqueIds(products) {
  return products.map((product) => {
    const productId = uuidv4();
    product.id = productId;
    productIdSave[productId] = product;
    return product;
  });
}

app.get("/categories/:categoryname/products", async (req, res) => {
  let n = parseInt(req.query.top || req.query.n || 10);
  let page = parseInt(req.query.page || 1);
  let minPrice = parseInt(req.query.minPrice || 0);
  let maxPrice = parseInt(req.query.maxPrice || 1000000);
  let sort = req.query.sort || "price";
  let order = req.query.order || "asc";

  try {
    const products = await aggregateProducts(
      req.params.categoryname,
      minPrice,
      maxPrice,
      n
    );
    const sortedProducts = products.sort((a, b) => {
      if (order === "asc") {
        return a[sort] - b[sort];
      } else if (order === "des") {
        return b[sort] - a[sort];
      } else {
        return b[sort] - a[sort];
      }
    });
    const start = (page - 1) * n;
    const end = start + n;
    const paginatedProducts = sortedProducts.slice(start, end);

    const responseData = generateUniqueIds(paginatedProducts);
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/categories/:categoryname/products/:productid", (req, res) => {
  const productDetails = productIdSave[req.params.productid];
  if (!productDetails) {
    res.status(404).json({ error: "Product not found" });
  } else {
    res.json(productDetails);
  }
});

app.listen(port, async () => {
  console.log(`http://localhost:${port}/`);
});
