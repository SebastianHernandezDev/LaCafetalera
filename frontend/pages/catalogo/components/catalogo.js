document.getElementById('admin-insert').addEventListener('submit', function (e) {
  e.preventDefault();

  const form = e.target;
  const id = parseInt(form.id.value);
  const name = form.name.value.trim();
  const price = parseFloat(form.price.value);
  const description = form.description.value.trim();
  const nuevoStock = parseInt(form.nuevoStock.value);
  const status = form.status.value;
  const imageFile = form.imagenProducto.files[0];

  const products = getProducts();

  // Validaciones
  if (id <= 0 || isNaN(id)) {
    alert("El ID debe ser un número positivo.");
    return;
  }

  if (products.some(p => p.id === id)) {
    alert("Ya existe un producto con ese ID.");
    return;
  }

  if (price < 0 || isNaN(price)) {
    alert("El precio no puede ser negativo.");
    return;
  }

  if (nuevoStock < 1 || isNaN(nuevoStock)) {
    alert("El nuevo stock debe ser al menos 1.");
    return;
  }

  if (!imageFile) {
    alert("Debe subir una imagen del producto.");
    return;
  }

  // Crear URL temporal para imagen
  const imageURL = URL.createObjectURL(imageFile);

  // Crear nuevo producto
  const newProduct = {
    id,
    name,
    price,
    description,
    stock: nuevoStock,
    status,
    image: imageURL
  };

  // Guardar y renderizar
  products.push(newProduct);
  saveProducts(products);
  renderProducts();
  form.reset();
  document.getElementById('nombreImagen').textContent = '';

  alert("¡Producto agregado con éxito!");
});
