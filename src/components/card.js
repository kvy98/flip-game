export class Card extends HTMLElement {
  constructor(imgPath) {
    super();
    this.className = "card";
    const imgElement = document.createElement("img");
    imgElement.src = imgPath;
    imgElement.className = "card__img";
    this.imgElement = imgElement;
    this.appendChild(imgElement);
  }
}
window.customElements.define("ecustom-card", Card);
