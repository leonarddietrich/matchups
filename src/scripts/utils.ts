
export function formatDate(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleDateString('de-DE', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	})
}

/**
 * Blends a winrate into a color that goes from red (0%) to light green (100%),
 * matching the winrate shading used in the matchup insight view.
 * @param winrate - A value between 0 (0%) and 1 (100%).
 * @returns An rgba color string.
 */
export function getWinrateColor(winrate: number): string {
	// clamp
	const v = Math.max(0, Math.min(1, winrate))
	// from red (#ef4444) to light green (#4ade80)
	const r1 = 239, g1 = 68, b1 = 68
	const r2 = 74, g2 = 222, b2 = 128
	const r = Math.round(r1 + (r2 - r1) * v)
	const g = Math.round(g1 + (g2 - g1) * v)
	const b = Math.round(b1 + (b2 - b1) * v)
	return `rgba(${r}, ${g}, ${b}, 0.9)`
}
