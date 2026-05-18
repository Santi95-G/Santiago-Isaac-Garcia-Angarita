const BASE_URL = "/api/productos"

var carrito = []
var cartId = 0

async funtion cargarProductos() {
  try {
    const response = await fetch(BASE_URL)
    const juegos = await response.json()
    renderGrid(juegos)
  } catch (error) {
    console.log("Error cargando productos:", error)
  }
}

function renderGrid(juegos) {
  const g = document.getElementById("grid")
  g.innerHTML = ""
  juego.forEach(function(j) {
    const imgHtml = j.imagen
            ? '<img src="' + j.imagen + '" alt="' + j.nombre + '">'
            : '<span class="placeholder">🎮</span'
    g.innerHTML += '
      <div class="card">
                <div class="card-img">
                    <span class="discount-badge">-40%</span>
                    ${imgHtml}
                </div>
                <div class="card-body">
                    <span class="badge">${j.genero || "Juego"}</span>
                    <p class="card-title">${j.nombre}</p>
                    <p class="card-platform">PS5 / PC</p>
                    <p class="card-price">$${j.precio}</p>
                    <div class="card-actions">
                        <button class="btn-cart" onclick="addCarrito(${j.id}, '${j.nombre}', ${j.precio}, '${j.imagen || ''}')"> Comprar</button>
                        <button class="btn-del" onclick="eliminarProducto(${j.id})">🗑️</button>
                    </div>
                </div>
            </div>`
    })
}

async function eliminarProducto(id) {
  await fetch(BASE_URL + "/" + id, {method: "DELETE"})
  cargarProductos()
}

function addCarrito(id, nombre, precio, img) {
  carrito.push({ cartId: cartId++, id: id, nombre: nombre, precio: precio, imagen: img})
  renderCarrito()
  openCart()
}

function quitarCarrito(cid) {
  carrito = carrito.filter(function(x) { return x.cartId !== cid })
  renderCarrito()
}

function renderCarrito() {
  const c = document.getElementById("cartItems")
  const total = carrito.reduce(funtion(acc, x) { return acc + Number(x.precio) }, 0)
  document.getElementById("cartCount").textContent = carrito. length
  document.getElementById("totalAmount").textContent = "$" + total
  if (carrito.length === 0) {
    c.innerHTML = '<p class="empty">Tu carrito está vacio</p>'
    return
  }
  c.innerHTML = ""
  carrito.forEach(function(item) {
    const imgHtml = item.imagen
        ? '<img src="' + item.imagen + '"alt="' + item.nombre +'">'
        : '🎮'
    c.innerHTML += '
      <div class="cart-item">
                <div class="cart-item-img">${imgHtml}</div>
                  <div style= "flex:1">
                  <p class="cart-item-name">${item.nombre}</p>
                  <p class="cart-item-price">$${item.precio}</p>
           </div>
           <button class="btn-remove" onclick="quitarCarrito(${item.cartId})">✕</button>
    </div>'
  })
}

function operCart() {
  document.getElementById("cartPanel").classList.add("open")
  document.getElementById("overlay").classList.add("show")
}

function closeCart() {
  document.getElementById("cartPanel").classList.remove("open")
  document.getElementById("overlay").classList.remove("show")

}

cargarProducto()



          
                  
                  
      
      
    
  
                    
                    
