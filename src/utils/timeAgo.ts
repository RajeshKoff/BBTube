export function timeAgo(date: string) {
  const timestamp = new Date(date).getTime()
  if (!Number.isFinite(timestamp)) return 'Unknown upload time'

  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000))
  const units: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [365 * 24 * 60 * 60, 'year'],
    [30 * 24 * 60 * 60, 'month'],
    [7 * 24 * 60 * 60, 'week'],
    [24 * 60 * 60, 'day'],
    [60 * 60, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ]
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'always' })

  for (const [unitSeconds, unit] of units) {
    if (seconds >= unitSeconds) {
      const value = Math.floor(seconds / unitSeconds)
      return formatter.format(-value, unit).replace('ago ago', 'ago')
    }
  }
  return 'Just now'
}

export function exactUploadTime(date: string) {
  const timestamp = new Date(date)
  if (Number.isNaN(timestamp.getTime())) return 'Unknown upload time'
  return timestamp.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
