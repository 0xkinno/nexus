export function getStars(score: number): number {
  if (score >= 91) return 5
  if (score >= 80) return 4
  if (score >= 60) return 3
  if (score >= 40) return 2
  return 1
}

export function renderStars(score: number): string {
  const filled = getStars(score)
  return '★'.repeat(filled) + '☆'.repeat(5 - filled)
}
