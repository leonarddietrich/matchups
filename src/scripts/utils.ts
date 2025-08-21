
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
