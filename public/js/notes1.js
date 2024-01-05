document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("boxNames"));
    console.log(cart);

    for (let i = 0; i < cart.length; i++) {
        hello(cart[i]);
    }
});

const hello = (name) => {
    let newLi = document.createElement("li");
    newLi.classList = "nav-item";

    let newA = document.createElement("a");
    newA.classList = "nav-link active";

    newA.textContent = name;

    newLi.appendChild(newA);

    document.getElementsByClassName("offcanvas-body")[0].appendChild(newLi);
};

