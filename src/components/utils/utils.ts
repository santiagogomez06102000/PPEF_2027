export async function fetchPublicJson<T>(path: string): Promise<T | null> {
  // @ts-ignore
  const base = import.meta.env.BASE_URL

  const url = `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`

  try {
    const res = await fetch(url)

    // Si no existe (404) o cualquier error HTTP
    if (!res.ok) {
      console.warn(`JSON no encontrado: ${url} (${res.status})`)
      return null
    }

    return await res.json()
  } catch (err) {
    // Error de red, CORS, etc.
    console.warn(`Error de red al cargar JSON: ${url}`, err)
    return null
  }
}
export const getCardClass = (items: number, index: number): string => {
  const remainder2 = items % 2
  const remainder3 = items % 3

  let classes = 'grid-item'

  // TABLET: 2 cards por fila
  if (remainder2 === 1 && index === items - 1) {
    classes += ' grid-item--tablet-single'
  }

  // DESKTOP: 3 cards por fila
  if (remainder3 === 1 && index === items - 1) {
    classes += ' grid-item--desktop-single'
  }

  if (remainder3 === 2 && index >= items - 2) {
    classes += index === items - 2
      ? ' grid-item--desktop-two-first'
      : ' grid-item--desktop-two-second'
  }

  return classes
}
export function formatearMoneda(valor: number | string): string {
  const numero = Number(valor)

  if (Number.isNaN(numero)) {
    return '-'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numero)
}
export async function fetchPublicText(path: string): Promise<string | null> {
  // @ts-ignore
  const base = import.meta.env.BASE_URL

  const url = `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      console.warn(`Archivo no encontrado: ${url} (${res.status})`)
      return null
    }

    return await res.text()
  } catch (err) {
    console.warn(`Error de red al cargar archivo: ${url}`, err)
    return null
  }
}
