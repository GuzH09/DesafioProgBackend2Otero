class ProductManager {
    // Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. ✅
    // Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).
    #nextId;

    constructor (path, fs) {
        // La clase debe contar con una variable this.path, ✅
        // el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.
        this.fs = fs;
        this.path = path;
        fs.writeFileSync(path, "[]");
        this.#nextId = 0
    }

    getProducts() {
        // Debe tener un método getProducts: ✅
        // el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.
        try {
            const data = JSON.parse(this.fs.readFileSync(this.path));
            return data;
        } catch (error) {
            throw error;
        }
    }

    addProduct(productObj) {
        // Debe tener un método addProduct: ✅
        // el cual debe recibir un objeto con el formato previamente especificado, 
        // asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).

        // Debe guardar objetos con el siguiente formato: ✅
        // id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
        // title (nombre del producto)
        // description (descripción del producto)
        // price (precio)
        // thumbnail (ruta de imagen)
        // code (código identificador)
        // stock (número de piezas disponibles)

        // Validates required fields
        const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        for (const field of requiredFields) {
            if (!productObj[field]) {
                return `Error: field ${field} is missing on the object.`;
            }
        }

        // field "code" doesn't appear twice
        let fileProducts = this.getProducts();
        if (fileProducts.some(product => product.code === productObj.code)) {
            return `Error: code ${productObj.code} already exists.`;
        }

        // Add new product with id
        const newProduct = {
            id: this.#nextId++,
            ...productObj
        };
        fileProducts.push(newProduct);
        this._saveProductsToFile(fileProducts);
        return "Product added.";
    }

    getProductById(id) {
        // Debe tener un método getProductById: ✅
        // el cual debe recibir un id, y tras leer el archivo, 
        // debe buscar el producto con el id especificado y devolverlo en formato objeto

        let fileProducts = this.getProducts();
        const product = fileProducts.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            return "Error: That product doesn't exists.";
        }
    }

    updateProduct(id, productData) {
        // Debe tener un método updateProduct: ✅
        // el cual debe recibir el id del producto a actualizar, 
        // así también como el campo a actualizar (puede ser el objeto completo, como en una DB), 
        // y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID

        let fileProducts = this.getProducts();
        const productIndex = fileProducts.findIndex(product => product.id === id);
        if (productIndex === -1) {
            return `Error: Product with id ${id} not found.`;
        }
        const updatedProduct = { ...fileProducts[productIndex], ...productData };
        fileProducts[productIndex] = updatedProduct;
        this._saveProductsToFile(fileProducts);
        return "Product updated.";
    }

    deleteProduct(id) {
        // Debe tener un método deleteProduct: ✅
        // el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.

        let fileProducts = this.getProducts();
        const productIndex = fileProducts.findIndex(product => product.id === id);
        if (productIndex === -1) {
            return `Error: Product with id ${id} not found.`;
        }
        fileProducts.splice(productIndex, 1);
        this._saveProductsToFile(fileProducts);
        return "Product deleted.";
    }

    _saveProductsToFile(productData) {
        const data = JSON.stringify(productData, null, "\t");
        this.fs.writeFileSync(this.path, data);
    }
}





console.log("")
console.log("Test:")
const fs = require('fs');
const PRODUCTS = new ProductManager('example.json', fs);
console.log("Instancia de la clase Product Manager creada con array vacio:")
console.log(PRODUCTS.getProducts());
console.log("")

PRODUCTS.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
});
console.log("Producto agregado:")
console.log(PRODUCTS.getProducts());
console.log("")

console.log("Buscando producto con ID: 0.")
console.log(PRODUCTS.getProductById(0));
PRODUCTS.updateProduct(0, {
    title: "producto prueba DOS",
    description: "Este es un producto prueba ACTUALIZADO"
});
console.log("Actualizando producto con ID: 0.")
console.log(PRODUCTS.getProductById(0));
console.log("")

console.log("Eliminamos producto ID: 0.")
PRODUCTS.deleteProduct(0);
console.log("Productos vacío.")
console.log(PRODUCTS.getProducts());