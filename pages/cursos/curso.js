document.addEventListener("DOMContentLoaded", function() {
    let currentCart = getCartData();
    if (currentCart != null) {
        updateVisualCart('show', currentCart.length)
    }
});

function getCartData() {
    let existingCart = localStorage.getItem('cart');
    if (existingCart != null) {
        existingCart = JSON.parse(existingCart);
    }
    return existingCart
}

function addToCart(courseName, price) {
    let existingCart = localStorage.getItem('cart');
    if (existingCart == null) {
        existingCart = []
    } else {
        existingCart = JSON.parse(existingCart);
    }
    let cartItem = {
        courseName: courseName,
        price: price
    }
    existingCart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(existingCart));
    updateVisualCart('show', existingCart.length)
}

function updateVisualCart(type,quantity) {
    let cartSpan = document.getElementById('cart-notification');
    if (type === 'show') {
        cartSpan.style.display = 'block'
    } else {
        cartSpan.style.display = 'none'
    }
    cartSpan.textContent = quantity.toString();
}