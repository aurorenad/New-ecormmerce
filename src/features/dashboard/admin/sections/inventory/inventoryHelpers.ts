export function getStockStatus(n: number): string {
  if (n === 0) return 'Out of Stock'
  if (n > 10)  return 'In Stock'
  if (n >= 5)  return 'Low Stock'
  return 'Critical'
}

export function getStockClass(n: number): string {
  if (n === 0) return 'stock-out'
  if (n > 10)  return 'stock-ok'
  if (n >= 5)  return 'stock-low'
  return 'stock-critical'
}

export const INV_CATEGORIES = ['Smartphone', 'Laptop', 'Tablet', 'Wearable']
export const INV_WAREHOUSES = ['Kigali Central', 'Nyarugenge Hub', 'Remera Depot']
export const INV_CONDITIONS = ['Certified', 'Refurbished A', 'Refurbished B', 'New', 'Used (Good)', 'Used (Fair)']
export const PAGE_SIZE = 5
