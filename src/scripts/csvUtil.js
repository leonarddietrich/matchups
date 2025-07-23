import * as fs from 'fs'

/**
 * Read a CSV file and return an array for each column.
 * @param filePath Path to the CSV file
 * @returns An array of arrays, where each inner array represents a column
 * @throws Error if the file cannot be read
 */
export function readCsv(filePath) {
	const content = fs.readFileSync(filePath, 'utf-8')
	const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0)
	if (lines.length === 0) {
		throw new Error(`CSV file is empty: ${filePath}`)
	}
	const csvHeaders = lines[0].split(',')
	const columns = csvHeaders.map((header) => [header.trim()])
	lines.slice(1).forEach((line) => {
		const values = line.split(',')
		if (values.length !== csvHeaders.length) {
			throw new Error(`CSV file has inconsistent number of columns: ${filePath}`)
		}
		values.forEach((value, index) => {
			columns[index].push(value.trim())
		})
	})
	return columns
}

/**
 * Write a CSV file from an array of arrays.
 * @param filePath Path to the output CSV file
 * @param data An array of arrays, where each inner array represents a column
 * @throws Error if the file cannot be written
 */
export function writeCsv(filePath, data) {
	const csvContent = data.map((column) => column.join(',')).join('\n')
	try {
		fs.writeFileSync(filePath, csvContent, 'utf-8')
	} catch (error) {
		throw new Error(`Failed to write CSV file: ${filePath}. Error: ${error}`)
	}
}
