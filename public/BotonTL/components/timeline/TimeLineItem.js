/**
 * Representa un rango de fechas expresado como [día, mes].
 * @typedef {[number, number]} Fecha
 */

/**
 * Representa una subetapa dentro de una etapa.
 * @typedef {Object} Subetapa
 * @property {string} titulo - Nombre de la subetapa o documento.
 * @property {Fecha} inicio - Fecha de inicio en formato [día, mes].
 * @property {Fecha} fin - Fecha de fin en formato [día, mes].
 */

/**
 * Representa una etapa del proceso.
 * @typedef {Object} Etapa
 * @property {string} etapa - Nombre de la etapa.
 * @property {Subetapa[]} [subetapa] - Lista de subetapas asociadas a la etapa.
 * @property {Fecha} inicio - Fecha de inicio en formato [día, mes].
 * @property {Fecha} fin - Fecha de fin en formato [día, mes].
 */

/**
 * Estructura principal de la línea de tiempo.
 * @typedef {Object} LineaTiempo
 * @property {Etapa[]} etapas - Lista de etapas del proceso.
 */
/**
 *
 * @param {Etapa} item
 * @returns {HTMLElement}
 */
export function crearItemTL(item) {
  const contenedorItem = document.createElement("div");
  
  const contenedorTitulo= document.createElement("div");
  contenedorTitulo.className="contenedor-titulo"

   const fecha=document.createElement("div");
      fecha.className="fecha-tl"

      fecha.textContent = formatearFecha(item.inicio) + ": ";

  const etapa = document.createElement("div");
  etapa.textContent = item.etapa;
  etapa.className="etapa-contenedor"

  const dias = diasEntreFechas(item.inicio, item.fin);

  const fechaActual = new Date();
  const diasHoy = diasEntreFechas(item.inicio, [
    fechaActual.getDate(),
    fechaActual.getMonth() + 1,
  ]);

  if (diasHoy > 0) {
    const porc = document.createElement("div");
    porc.classList.add("porcentaje-tl");
    contenedorItem.appendChild(porc);
    const porcentaje = (diasHoy * 100) / dias;
    porc.style.setProperty(
      "--avance",
      (porcentaje > 100 ? 100 : porcentaje.toString()) + "%",
    );
  }
  if (item.subetapa?.length > 0) {
    const contenedorSubitems= document.createElement("div");
    contenedorSubitems.classList.add("contenedor-subitems")

    item.subetapa.map((subitem, i) => {
      const subitemCont = document.createElement("div");
      subitemCont.style.setProperty("--desface",(i+1).toString()+"rem" )
      subitemCont.style.setProperty("--desface2",(item.subetapa.length - (i+1)).toString()+"rem" )

      subitemCont.classList.add("subitem-tl")
      
      const fechaSub=document.createElement("div");
      fechaSub.className="fecha-tl"

      fechaSub.textContent = formatearFecha(subitem.inicio) + ": ";
      const desc = document.createElement("div");
      desc.textContent=subitem.titulo;

      subitemCont.appendChild(fechaSub);
      subitemCont.appendChild(desc)
      contenedorSubitems.appendChild(subitemCont);
    });
    contenedorItem.appendChild(contenedorSubitems)
  }
  contenedorTitulo.appendChild(fecha);
  contenedorTitulo.appendChild(etapa);

  contenedorItem.appendChild(contenedorTitulo)
  contenedorItem.style.width = ((dias * 100) / 365).toString() + "%";
  contenedorItem.classList.add("contenedor-item-tl");

  return contenedorItem;
}

const nombreMeses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
/**
 * Formatea la fecha [día, mes].
 *
 * @param {[number, number]} fecha - Fecha inicial [día, mes].
 * @returns {string} fecha formateada
 */
function formatearFecha(fecha) {
  const [dia, mes] = fecha;
  const diaFormateado = String(dia).padStart(2,"0")
  const mesFormateado = String(mes).padStart(2,"0")
  return `${diaFormateado}/${mesFormateado}`
}

/**
 * Calcula la cantidad de días entre dos fechas [día, mes].
 *
 * @param {[number, number]} inicio - Fecha inicial [día, mes].
 * @param {[number, number]} fin - Fecha final [día, mes].
 * @returns {number} Número de días entre ambas fechas.
 */
function diasEntreFechas(inicio, fin) {
  const [diaInicio, mesInicio] = inicio;
  const [diaFin, mesFin] = fin;
  const año = new Date().getFullYear();

  const fechaInicio = new Date(año, mesInicio - 1, diaInicio);
  const fechaFin = new Date(año, mesFin - 1, diaFin);

  const diferenciaMs = fechaFin - fechaInicio;

  return Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
}
