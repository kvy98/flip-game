class Modal extends HTMLElement {
  constructor(title, message, onExit) {
    super();
    this.title = title;
    this.message = message;
    this.onExit = onExit;
  }
  show() {
    const buttonExit = document.createElement("button");
    const titleElement = document.createElement("p");
    const scoreElement = document.createElement("p");
    scoreElement.innerText = this.message;
    scoreElement.classList.add("score");
    titleElement.classList.add("title");
    titleElement.textContent = this.title;
    this.classList.add("modal-game-over");
    this.appendChild(titleElement);
    this.appendChild(scoreElement);
    this.appendChild(buttonExit);
    buttonExit.innerText = "Exit";
    buttonExit.addEventListener("click", () => {
      this.onExit?.();
      this.remove();
    });
    document.body.appendChild(this);
  }
}
window.customElements.define("ecustom-modal", Modal);
export { Modal };
