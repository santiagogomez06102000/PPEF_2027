import { ref, Ref } from "vue";
import L from "leaflet";
import { GeoJsonObject } from "geojson";
import { Entidad_federativaInterface, RamoInterface } from "./FiltrosMapa.vue";
export let mapa: L.Map | null = null;
let mapaDetalle: L.Map | null = null;
export function initMap(mapaContainer: Ref<HTMLElement | null>): L.Map | null {
  if (!mapaContainer.value) return null;

  const mapaC = L.map(mapaContainer.value, {
    center: [23.6345, -102.5528],
    zoom: 5,
    minZoom,
    maxZoom,
    //maxBounds: mexicoBounds,
    //maxBoundsViscosity: 0.5,
    scrollWheelZoom: false,
    zoomControl: true,
  });

  // Crear pane para etiquetas
  mapaC.createPane("labels");
  mapaC.getPane("labels")!.style.zIndex = "640";

  // Fondo sin etiquetas
  const callesFondo = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 18,
    },
  );

  // Etiquetas
  const callesLabels = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
    {
      subdomains: "abcd",
      minZoom: 5,
      maxZoom: 18,
      pane: "labels",
    },
  );

  const calles = L.layerGroup([callesFondo, callesLabels]);

  calles.addTo(mapaC);

  // Mensaje de ayuda
  let mensajeZoom: HTMLDivElement | null = null;
  let timeoutMensaje: number | null = null;

  function mostrarMensajeZoom() {
    if (mensajeZoom) return;

    mensajeZoom = document.createElement("div");

    mensajeZoom.innerHTML =
      "Mantén presionada la tecla <b>Ctrl</b> y usa la rueda del mouse para hacer zoom";

    Object.assign(mensajeZoom.style, {
      position: "absolute",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "1000",
      background: "rgba(0,0,0,0.75)",
      color: "white",
      padding: "10px 16px",
      borderRadius: "6px",
      fontSize: "14px",
      pointerEvents: "none",
    });

    mapaC.getContainer().appendChild(mensajeZoom);

    timeoutMensaje = window.setTimeout(() => {
      mensajeZoom?.remove();
      mensajeZoom = null;
    }, 2500);
  }

  const container = mapaC.getContainer();

  container.addEventListener(
    "wheel",
    (event: WheelEvent) => {
      event.preventDefault();
      if (event.ctrlKey) {
        // Permite zoom
        mapaC.scrollWheelZoom.enable();

        if (mensajeZoom) {
          mensajeZoom.remove();
          mensajeZoom = null;
        }

        if (timeoutMensaje) {
          clearTimeout(timeoutMensaje);
        }

        return;
      }

      // Bloquea el scroll normal
      event.preventDefault();

      // Deshabilita zoom
      mapaC.scrollWheelZoom.disable();

      mostrarMensajeZoom();
    },
    {
      passive: false,
    },
  );
  mapa = mapaC;
  return mapa;
}
export function initMapDetalle(
  mapaContainer: Ref<HTMLElement | null>,
  lat: number,
  lon: number,
): L.Map | null {
  if (!mapaContainer.value) return null;

  const delta = 0.005;

  const bounds = L.latLngBounds(
    [lat - delta, lon - delta],
    [lat + delta, lon + delta],
  );

  const mapaC = L.map(mapaContainer.value, {
    center: [lat, lon],
    zoom: 18,
    minZoom: 16,
    maxZoom,
    maxBounds: bounds,
    maxBoundsViscosity: 1,
    scrollWheelZoom: false,
    zoomControl: true,
  });

  // Crear pane para etiquetas
  mapaC.createPane("labels");
  mapaC.getPane("labels")!.style.zIndex = "650";

  const callesFondo = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
    {
     subdomains: "abcd",
      maxZoom: 18,
    },
  );

  const callesLabels = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
    {
      subdomains: "abcd",
      minZoom: 5,
      maxZoom: 18,
      pane: "labels",
    },
  );

  L.layerGroup([callesFondo, callesLabels]).addTo(mapaC);

  mapaDetalle = mapaC;
  return mapaDetalle;
}

// Límites geográficos de México
export const mexicoBounds = L.latLngBounds([14.5, -118.5], [32.8, -86.5]);

export const minZoom = 5;
export const maxZoom = 18;
export function regrearMapa() {
  mapa?.flyToBounds(mexicoBounds);
}
//@ts-ignore
export const baseUrl = import.meta.env.BASE_URL;
export function useGeoJson() {
  const baseURL = baseUrl;
  const getGeoJson = async (url: string) => {
    try {
      const response = await fetch(`${baseURL}${url}`);
      if (!response.ok) throw new Error(`Error ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error(`Error cargando ${url}:`, error);

      return null;
    }
  };
  return { getGeoJson };
}

export function addGeoJsonToMap(
  map: L.Map,
  geojson: GeoJsonObject,
  options: L.GeoJSONOptions = {},
  paneName = "geojsonPane",
  zIndex = 400,
): L.GeoJSON {
  // Crear el pane si no existe
  if (!map.getPane(paneName)) {
    map.createPane(paneName);
    map.getPane(paneName)!.style.zIndex = zIndex.toString();
  }

  const layer = L.geoJSON(geojson, {
    pane: paneName,
    ...options,
  });

  layer.addTo(map);

  return layer;
}
export const capaEstados = ref<L.GeoJSON | null>(null);
export const capaMunicipios = ref<L.GeoJSON | null>(null);


/**
 * Convierte el nombre de una entidad (NOMGEO) al slug usado para nombrar
 * los archivos JSON de municipios en /municipios/<slug>.json
 */
export function nombreEntidadASlug(nombre:string) {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll(' ', '_')
}
export const geoJsonEstados = ref();


export function removeGeoJsonFromMap(
  map: L.Map,
  layer: L.GeoJSON | null | undefined
): void {
  if (!layer) return;

  if (map.hasLayer(layer)) {
    map.removeLayer(layer);
  }
}

export const clasificacionesColores = [
  "#6c4f84",
  "#d7000b",
  "#ffc500",
  "#666666",
  "#0082b3",
  "#00743c",
  "#c01361",
  "#8e4139",
  "#009b8f",
  "#09465b",
  "#ff5600",
  "#8bcc14",
];
export const ramoColores = new Map([
  [53, "#99cc66"],
  [10, "#9E9E9E"],
  [18, "#19bcb9"],
  [47, "#f8a24b"],
  [6, "#835da8"],
  [9, "#e883af"],
  [51, "#611232"],
  [50, "#006253"],
  [13, "#386ab3"],
  [16, "#19bcb9"],
  [52, "#e2282b"],
  [12, "#66ccff"],
]);


export const entidadesFederativas:Entidad_federativaInterface[] = [];
export const ramos:RamoInterface[] = [];