import { crearBotonAbrirTL } from "./components/BotonAbrirTL.js";
import { crearContenedorTL } from "./components/timeline/ContenedorTL.js";
import datosTL from "./components/data/lineaTiempo.json" with { type: "json" };

export function crearBoton() {
  let abierta = false;
  //#region creare lementos

  const botonTimeline = document.createElement("div");
  const elementos = datosTL.etapas.length;
  const alto = `calc((90dvh - (${elementos} * 1rem)) / ${elementos})`;
  botonTimeline.className = "contenedor-boton-timeline";
  botonTimeline.id = "contenedor-boton-timeline";
  botonTimeline.style.setProperty("--fondo-primario", datosTL.fondoPrimario);
  botonTimeline.style.setProperty("--color-primario", datosTL.colorPrimario);
  botonTimeline.style.setProperty(
    "--fondo-secundario",
    datosTL.fondoSecundario,
  );
  botonTimeline.style.setProperty(
    "--color-secundario",
    datosTL.colorSecundario,
  );
  botonTimeline.style.setProperty("--fondo-terciario", datosTL.fondoTerciario);
  botonTimeline.style.setProperty("--color-terciario", datosTL.colorTerciario);
  botonTimeline.style.setProperty("--alto", alto);
  botonTimeline.tabIndex = 1;
  const btnAbrirTL = crearBotonAbrirTL(datosTL);
  const contenedorTl = crearContenedorTL(datosTL);

  //#endregion
  //#region  funciones
  botonTimeline.addEventListener("blur", (e) => {
  if (e.relatedTarget === btnAbrirTL) {
    return;
  }

  if (abierta) {
    abierta = false;
    cambiarClaseContenedor();
  }
});
  btnAbrirTL.addEventListener("click", () => {
    abierta = !abierta;
    cambiarClaseContenedor();

    if (abierta) {
      botonTimeline.focus();
    }
  });
  function cambiarClaseContenedor() {
    contenedorTl.classList.toggle("mostrar-tl");
  }
  //#endregion
  botonTimeline.appendChild(contenedorTl);
  botonTimeline.appendChild(btnAbrirTL);

  return botonTimeline;
}
