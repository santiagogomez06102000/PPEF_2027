import { crearBoton } from "./boton.template.js";

class MiBoton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._mousemoveHandler = this._onMouseMove.bind(this);
  }

  connectedCallback() {
    this.render();
    //this.inicializarEfecto();
  }

  disconnectedCallback() {
    document.removeEventListener("mousemove", this._mousemoveHandler);
  }

  render() {
    this.shadowRoot.replaceChildren();

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = new URL("./boton.css", import.meta.url);

    const boton = crearBoton();

    const top = this.getAttribute("top");
    const right = this.getAttribute("right");
    const bottom = this.getAttribute("bottom");
    const left = this.getAttribute("left");

    boton.style.position = "fixed";

    if (top !== null) boton.style.top = top;
    if (right !== null) boton.style.right = right;
    if (bottom !== null) boton.style.bottom = bottom;
    if (left !== null) boton.style.left = left;

    if (!right && !left && !top && !bottom) {
      boton.style.bottom = "0.5rem";
      boton.style.right = "0.5rem";
    }

    this.boton = boton;

    this.shadowRoot.append(stylesheet, boton);
  }

  inicializarEfecto() {
    this.maxDistance = 250;

    this.boton.style.transition =
      "transform 0.2s ease-out";

    document.addEventListener("mousemove", this._mousemoveHandler);
  }

  _onMouseMove(e) {
    if (!this.boton) return;

    const rect = this.boton.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.maxDistance) {
      const percent = 1 - distance / this.maxDistance;

      const tx = dx * percent * 0.3;
      const ty = dy * percent * 0.3;

      const rotateY = dx * percent * 0.08;
      const rotateX = -dy * percent * 0.08;

      this.boton.style.transform = `
        perspective(600px)
        translate3d(${tx}px, ${ty}px, 0)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    } else {
      this.boton.style.transform = "";
    }
  }
}

customElements.define("mi-boton", MiBoton);

export default MiBoton;