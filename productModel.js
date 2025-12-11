

function productModel (title, description) {

    this.title = title;
    this.description = description;

    const pop = document.createElement("div");
    pop.className = "product-model";
    pop.innerHTML = `<h2>${this.title}</h2> <br> <p>${this.description}</p>`;
    return pop;

}