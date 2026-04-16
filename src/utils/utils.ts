export function processSelect(fields: string): Record<string, boolean> | undefined {
  if (!fields) {
    return
  }
  return fields.split(',').reduce((acc, field) => {
    acc[field.trim()] = true
    return acc
  }, {} as Record<string, boolean>)
}
