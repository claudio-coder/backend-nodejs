import express from "express";
import { ProductManager } from "./ProductManager.js";

const app = express();

app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("./products.json");

app.get("/products", async (req, res) => {
  const limit = req.query.limit;

  const products = await productManager.getProducts();

  if (limit !== undefined) {
    const productsLimits = products.slice(0, limit);
    res.send(productsLimits);
    return;
  }

  res.send(products);
});

app.get("/products/:pid", async (req, res) => {
  const product = await productManager.getProductById(Number(req.params.pid));
  if (product === undefined) {
    const error = {
      error: "El producto no existe",
    };
    res.send(error);
    return;
  }

  res.send(product);
});
app.listen(8080, () => console.log("servidor andando"));
