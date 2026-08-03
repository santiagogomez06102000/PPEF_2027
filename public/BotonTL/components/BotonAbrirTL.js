export function crearBotonAbrirTL(datosTL) {
  //#region crear boton
  const btnAbrirTL = document.createElement("button");
  const texto = obtenerEtapaActual(datosTL);
  
  //btnAbrirTL.textContent = texto.etapa || "";
  btnAbrirTL.innerHTML='<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path></svg>'
  btnAbrirTL.title= "Calendario";
  btnAbrirTL.id = "boton-abrir-timeline";
  btnAbrirTL.classList.add("boton-abrir-timeline");
  btnAbrirTL.type = "button";

  //#endregion

  return btnAbrirTL;
}

/**
 * Convierte una fecha [día, mes] al número de día dentro del año.
 *
 * @param {[number, number]} fecha
 * @param {number} [anio=new Date().getFullYear()]
 * @returns {number}
 */
function diaDelAnio(fecha, anio = new Date().getFullYear()) {
    const [dia, mes] = fecha;

    const fechaObj = new Date(anio, mes - 1, dia);
    const inicioAnio = new Date(anio, 0, 1);

    return Math.floor((fechaObj - inicioAnio) / 86400000) + 1;
}

/**
 * Obtiene la etapa actual según la fecha de hoy.
 *
 * @param {{etapas: Array}} lineaTiempo
 * @returns {Object|null}
 */
function obtenerEtapaActual(lineaTiempo) {
    const hoy = new Date();
    const inicioAnio = new Date(hoy.getFullYear(), 0, 1);

    const diaActual =
        Math.floor((hoy - inicioAnio) / 86400000) + 1;

    return (
        lineaTiempo.etapas.find((etapa) => {
            const inicio = diaDelAnio(etapa.inicio, hoy.getFullYear());
            const fin = diaDelAnio(etapa.fin, hoy.getFullYear());

            return diaActual >= inicio && diaActual <= fin;
        }) || null
    );
}