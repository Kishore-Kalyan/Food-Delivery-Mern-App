import axios from 'axios'
import Noty from 'noty'
let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updataCart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        // console.log(res);
        // cartCounter.innerText = res.date.totalQty;
        cartCounter.innerText = res.data.totalQty;
        // console.log(cartCounter.innerText);
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            text: "Item Added to Cart",
            // layout: 'bottomLeft',
        }).show();
    }).catch(err => {
        // console.log(err);
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            text: "Something went wrong",
            // layout: 'bottomLeft',
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        // console.log(e);
        let pizza = JSON.parse(btn.dataset.pizza);
        // console.log(pizza);
        updataCart(pizza);
    })
});