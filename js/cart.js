const visaCuotas = [1,3,6,12]
const CFT = [
    {
        cuota: 1,
        cft: 0 // 0%
    },
    {
        cuota: 3,
        cft: 0.6 // 60%
    },
    {
        cuota: 6,
        cft: 0.9 // 90%
    },
    {
        cuota: 12,
        cft: 1.2 // 120%
    },
    {
        cuota: 18,
        cft: 1.4 // 140%
    },
]
const mastercardCuotas = [1,3,6,12,18]

document.addEventListener("DOMContentLoaded", function() {
    let currentCart = getCartData();
    let cartDataDiv = document.getElementById('cart-data')
    if (currentCart != null) {
        updateVisualCart('show', currentCart.length)
        document.getElementById('comprar').style.display = 'block'
        let finalPrice = 0;
        currentCart.forEach(element => {
            finalPrice += parseFloat(element.price)
            let card = document.createElement('div')
            card.className = 'card'
            card.innerHTML = `
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                        <img src="https://media.istockphoto.com/id/1171092500/photo/happy-african-man-in-hat-singing-into-smartphone-like-microphone.jpg?s=612x612&w=0&k=20&c=ool6e1Swh52ov6j-Wcc2CTJif8jJGqeF98tUo4CHDmg=" class="" alt="...">
                    </div>
                    <div class="col-md-4">
                        <h3>
                            ${element.courseName}
                        </h3>
                    </div>
                    <div class="col-md-3">
                        ${element.price}
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger" onclick="removeFromCart('${element.courseName}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            `;
            cartDataDiv.appendChild(card)
        });

        let total = document.createElement('div')
        total.className = 'float-end'
        total.innerHTML = `
            <h3 style="color: white;">
                TOTAL: $${finalPrice}
            </h3>
        `;
        cartDataDiv.appendChild(total)
    } else {
        let notFound = document.createElement('h2')
        notFound.innerHTML = 'No se agregaron elementos al carrito'
        cartDataDiv.appendChild(notFound)
    }
});

function getCartData() {
    let existingCart = localStorage.getItem('cart');
    if (existingCart != null) {
        existingCart = JSON.parse(existingCart);
    }
    return existingCart
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

function removeFromCart(courseName) {
    let currentCart = getCartData();
    let cartElementId = currentCart.findIndex(element => element.courseName == courseName)
    currentCart.splice(cartElementId, 1)
    if (currentCart.length == 0) {
        localStorage.removeItem('cart')
        updateVisualCart('hide', 0)
    } else {
        localStorage.setItem('cart', JSON.stringify(currentCart));
        updateVisualCart('show', currentCart.length)
    }
    window.location.reload()
}

function showForm() {
    let formDiv = document.getElementById('form-compra');
    formDiv.style.display = 'block'
}

function showPago(element) {
    let callbackValue = element.value;
    let tarjDiv = document.getElementById('tarjeta_pago');
    let transfDiv = document.getElementById('transferencia_pago');
    if (callbackValue == 'transf') {
        transfDiv.style.display = 'block'
        tarjDiv.style.display = 'none'
    } else if (callbackValue == 'tarj') {
        transfDiv.style.display = 'none'
        tarjDiv.style.display = 'block'
    } else {
        transfDiv.style.display = 'none'
        tarjDiv.style.display = 'none'
    }
}

function setCuotas(element) {
    let selectedCard = element.value;
    let currentCart = getCartData();
    let price = 0;
    currentCart.forEach(element => {
        price += parseFloat(element.price);
    });
    let availableInstallments = []
    switch (selectedCard) {
        case 'VISA':
            availableInstallments = visaCuotas
            break;
        case 'MASTERCARD':
            availableInstallments = mastercardCuotas
            break;
        case 'VISADEBITO':
        case 'MASTERCARDDEBITO':
            availableInstallments = [1]
            break;

    }

    let installments = []
    let selectTag = document.getElementById('cuotas_tarjeta');
    this.cleanSelect(selectTag);
    availableInstallments.forEach(installment => {
        let installmentCFT = CFT.find(element => element.cuota == installment)
        let installmentValue = price + (price * installmentCFT.cft)
        let fullInstallment = {
            cuota: installment,
            value: parseFloat(installmentValue / installment).toFixed(2),
            finalPrice: installmentValue
        }
        installments.push(fullInstallment)

        let opt = document.createElement("option");
        opt.value = fullInstallment.cuota; // the index
        opt.innerHTML = installment + ' cuota/s de ' + fullInstallment.value.toString() + '. Total: ' + fullInstallment.finalPrice;
        selectTag.append(opt);
    });
}

function cleanSelect(selectElement) {
    var i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      selectElement.remove(i);
   }
}

function cleanCart() {
    localStorage.removeItem('cart')
}

function validatePurchase(e) {
    e.preventDefault();
    if (confirm('Esta por proceder a la compra del curso. ¿Está seguro?')) {
        if (confirm('Gracias por su compra. Ya sos parte de la academia.')) {
            cleanCart()
            window.location.reload()
            return true
        } else {
            return true
        }
    } else {
        alert('no se realizo la compra');
    }
    return false
}