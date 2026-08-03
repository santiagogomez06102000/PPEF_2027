import { crearItemTL } from "./TimeLineItem.js";
export function crearContenedorTL(datosTL){
    document.addEventListener("load",()=>{

    })
    


    const contTL = document.createElement("div");
    contTL.className="contenedor-tl";

    datosTL.etapas.map((mes)=>{
        const item=crearItemTL(mes);
        contTL.appendChild(item);
    })

    return contTL;
}
