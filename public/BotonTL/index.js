const script = document.createElement('script')
script.type = 'module'
script.src = '/work/models/PTP/NPTP/PTP_Componentes/BotonTL/boton.js'

const body = document.querySelector('body')

body.appendChild(script)
const boton = document.createElement('mi-boton')

boton.setAttribute('bottom', '8rem')
boton.setAttribute('right', '1.5rem')
body.appendChild(boton)
