import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const product = {
      id: 0,
      title,
      description,
      price,
      thumbnail,
      code: code,
      stock,
    };
    let products = [product];

    const productFields = Object.keys(product);
    const isAnyValueUndefined = productFields.some(
      (aField) => product[aField] === undefined
    );

    if (isAnyValueUndefined) {
      console.error("A field is missing");
      return;
    }

    if (fs.existsSync(this.path)) {
      products = await this.getProducts();

      const isAnyCodeRepeated = products.some(
        (aProduct) => aProduct.code === code
      );

      if (isAnyCodeRepeated) {
        console.error("Repeated product");
        return;
      }

      const lastIndex = products.length - 1;
      product.id = products[lastIndex].id + 1;
      products.push(product);
    }

    await fs.promises.writeFile(this.path, JSON.stringify(products));
  }

  async getProducts() {
    const products = JSON.parse(await fs.promises.readFile(this.path));
    return products;
  }

  async getProductById(productId) {
    const products = JSON.parse(await fs.promises.readFile(this.path));

    const productWithSimilarId = products.find(
      (aProduct) => aProduct.id === productId
    );
    if (productWithSimilarId === undefined) {
      console.error("Not found");
      return;
    }
    console.log(productWithSimilarId);
    return productWithSimilarId;
  }

  async updateProduct(productId, toUpdateFields) {
    const products = await this.getProducts();

    const productIdx = products.findIndex(
      (aProduct) => aProduct.id === productId
    );

    const oldProduct = products[productIdx];
    const newProduct = {
      ...oldProduct,
      ...toUpdateFields,
    };

    products[productIdx] = newProduct;

    await fs.promises.writeFile(this.path, JSON.stringify(products));
  }

  async deleteProduct(productId) {
    const products = await this.getProducts();

    const productIdx = products.findIndex(
      (aProduct) => aProduct.id === productId
    );
    if (productIdx < 0) {
      console.error("Not exist");
      return;
    }

    products.splice(productIdx, 1);

    console.log(products);
    await fs.promises.writeFile(this.path, JSON.stringify(products));
  }
}

// const miProductManager = new ProductManager("./products.json");

// miProductManager.addProduct(
//   "Purina Exellent 20kg",
//   "Comida para Perros",
//   10490,
//   "Sin imagen",
//   "pur30222sssK",
//   14
// );
