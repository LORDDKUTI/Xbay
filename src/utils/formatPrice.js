export default function formatPrice(value, { locale = navigator.language, currency = 'USD' } = {}) {
  const n = Number(value ?? 0)
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n)
  } catch {
    return `$${n.toFixed(2)}`
  }
}
