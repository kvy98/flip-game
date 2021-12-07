export class Scene extends HTMLElement {
  constructor(rawHtml) {
    super();
    this.className = "scene";
    this.insertAdjacentHTML("afterbegin", rawHtml);
  }
  load() {}
}

window.customElements.define("ecustom-scene", Scene);
