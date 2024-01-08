// variables
const carrito = document.querySelector('#carrito');
const listaCard = document.querySelector('#lista-card');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
let articulosCarrito = [];
const totalHTML = document.querySelector('#total');

cargarEventListeners();
// funcion para registrar todos los eventlisteners
function cargarEventListeners() {
    // cuando agregas una card presionando 'agregar al carrito'
    listaCard.addEventListener('click', agregarCard);

    // elimina cursos del carrito
    carrito.addEventListener('click', eliminarArticulo);

    // muestra los articulos del localStorage
    document.addEventListener('DOMContentLoaded',  () => {
        articulosCarrito = JSON.parse(localStorage.getItem('card')) || []; // le asignamos a articulos carrito el resultado de JSON.parse
    
        carritoHTML(); // por ultimo llamamos a carritoHTML para que imprima lo que tenemos en el localStorage
    })

    // vaciar carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // reseteamos el carrito
        
        // console.log(articulosCarrito)
        limpiarHTML(); // eliminamos todo el HTML
    })
}

// elimina un articulo
function eliminarArticulo(e) {
    // prevenimos el Event Bubbling
    if(e.target.classList.contains('borrar-articulo')) {
        // obtenemos el id y lo asignamos a una constante
        const articuloId = e.target.getAttribute('data-id');

        // elimina del arreglo de articulos carrito
        const articuloEncontrado = articulosCarrito.find(articulo => articulo.id === articuloId);
        if (articuloEncontrado.cantidad > 1) {
            articuloEncontrado.cantidad--; // Si hay más de un artículo, disminuye la cantidad
        } else {
            articulosCarrito = articulosCarrito.filter(articulo => articulo.id !== articuloId); // Si hay solo uno, elimina el artículo
        }
        carritoHTML(); // iterar sobre el carrito y mostrar su HTML
    }
}

// funciones
function agregarCard(e) {
    e.preventDefault();

    // prevenimos el Event Bubbling
    if (e.target.classList.contains('agregar-card')) {
        const cardSeleccionada = e.target.parentElement.parentElement;
        leerDatosCard(cardSeleccionada);
    }

}

// lee el contenido del html al que le dimos click y extrae la informacion de la card
function leerDatosCard(card) {
    // crear un objeto con el contenido de la card actual
    // console.log(card)
    const infoCard = {
        // seleccionamos los elementos del html
        imagen: card.querySelector('img').src,
        nombre: card.querySelector('.card-nombre').textContent,
        precio: card.querySelector('.card-precio').textContent,
        id: card.querySelector('button').getAttribute('data-id'),
        cantidad: 1
    }

    // console.log(infoCard)

    // revisa si un elemento ya esta en el carrito
    // .some te permite iterar sobre un array de objetos y verificar si un elemento existe en el
    const existe = articulosCarrito.some(articulo => articulo.id === infoCard.id);
    if (existe) {
        // actualizamos la cantidad
        // .map te va a crear un nuevo arreglo por eso creamos esta constante
        const elemento = articulosCarrito.map(articulo => { // iteramos sobre cada articulo
            if (articulo.id === infoCard.id) { // cuando el articulo sea igual al articulo que estamos tratando de agregar lo que vamos hacer es aumentar la cantidad
                articulo.cantidad++; // si es  asi sumamos la cantidad
                return articulo; // y retornamos el objeto actualizado
            } else {
                return articulo; // retorna los objetos que no son dublicados
            }
        });
        articulosCarrito = [...elemento]; // tomamos una copia de los elementos
    } else {
        // agregamos al carrito

        // agrega elementos al arreglo de carrito
        // tomamos una compia ...
        articulosCarrito = [...articulosCarrito, infoCard] // obtenemos una copia y le vamos ir agregando el objeto infoCard
    }
    console.log(existe)




    carritoHTML();
    console.log(articulosCarrito)
}

function carritoHTML() { // esta funcion se va a encargar de generar el html basado en articulosCarrito
    // limpiamos el html
    limpiarHTML(); // primero limpiamos el html previo

    let precioTotal = 0; // Variable para almacenar el precio total
    // recorre el carrito y genera el HTML
    articulosCarrito.forEach(articulo => {
        const { imagen, nombre, precio, cantidad, id } = articulo;
        // todos los articulos se van a ir insertando en el <tbody>
        const row = document.createElement('tr'); // creamos el tr
        // y adentro de ese tr vamos a armar nuestro html
        row.classList.add('td-header')
        row.innerHTML = `

            <td>
                <img src="${imagen}" class="img-header">
            </td>
            <td>${nombre}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td> 
                <a href="#" class="borrar-articulo" data-id="${id}">x</a>
            </td>
            `;
        // vamos a ir agregando cada row en cada iteracion
        contenedorCarrito.appendChild(row);
    });

    calcularPrecioTotal(); // llamamos a la funcion calcular precio total

    // agregar al carrito de compras al storage
    sincronizarStorage();

}

function sincronizarStorage() {
    localStorage.setItem("card", JSON.stringify(articulosCarrito));
    
}

function limpiarHTML() {
    // si el contenedorCarrito tiene almenos un elemento el while se sigue ejecutando
    // una vez que ya se limpio ya no se ejecuta
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
    // despues de limpiar el html del carrito actualiza el precio total
    calcularPrecioTotal();
}

function calcularPrecioTotal() {
    let precioTotal = 0; // variable para almacenar el precio total

    // iterar a travez de cada articulo
    articulosCarrito.forEach(articulo => {

         // Extraer el precio unitario del artículo y convertirlo a un número decimal
        const precioUnidad = parseFloat(articulo.precio.slice(2)); // Eliminar el símbolo de "$ " y convertir a número
        // calcular el costo total del articulo
        precioTotal += precioUnidad * articulo.cantidad;
    });

    totalHTML.textContent = `Total: $${precioTotal.toFixed(3)}`;
}