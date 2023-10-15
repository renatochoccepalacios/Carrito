const containerIcon = document.querySelector('.container-icon');
const containerCart = document.querySelector('.container-cart-products');

containerIcon.addEventListener('click', () => {
    containerCart.classList.toggle('hidden-cart');
})