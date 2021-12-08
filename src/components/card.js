export class Card extends HTMLElement {
  constructor(imgPath) {
    super();
    // const card = document.createElement("li");
    this.className = "card";
    const imgElement = document.createElement("img");
    imgElement.src = imgPath;
    imgElement.className = "card__img";
    this.appendChild(imgElement);
  }
}
window.customElements.define("ecustom-card", Card);

