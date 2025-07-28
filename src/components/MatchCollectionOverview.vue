<template>
	<div class="match-collection-overview">
		<div class="header-section">
			<h2>Match Collections</h2>
		</div>
		<div class="table-container">
			<table class="collections-table">
				<thead>
					<tr>
						<th @click="setSortColumn('name')" class="sortable-header" :class="getSortClass('name')">
							Name
							<span class="sort-icon">{{ getSortIcon('name') }}</span>
						</th>
						<th @click="setSortColumn('type')" class="sortable-header" :class="getSortClass('type')">
							Type
							<span class="sort-icon">{{ getSortIcon('type') }}</span>
						</th>
						<th>Description</th>
						<th @click="setSortColumn('createdAt')" class="sortable-header" :class="getSortClass('createdAt')">
							Created
							<span class="sort-icon">{{ getSortIcon('createdAt') }}</span>
						</th>
						<th @click="setSortColumn('updatedAt')" class="sortable-header" :class="getSortClass('updatedAt')">
							Updated
							<span class="sort-icon">{{ getSortIcon('updatedAt') }}</span>
						</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="matchCollections.length === 0">
						<td colspan="7" class="no-data">No match collections available</td>
					</tr>
					<tr v-for="collection in matchCollections" :key="collection.name" class="collection-row">
						<td class="name-cell" :title="collection.name">{{ collection.name }}</td>
						<td class="type-cell">
							<span class="type-badge" :class="collection.type">{{ collection.type }}</span>
						</td>
						<td class="description-cell" :title="collection.description || 'No description'">{{ collection.description || 'No description' }}</td>
						<td class="date-cell">{{ formatDate(collection.createdAt) }}</td>
						<td class="date-cell">{{ formatDate(collection.updatedAt) }}</td>
						<td class="actions-cell">
							<button @click="selectCollection(collection.name)" class="action-btn select-btn">
								Select
							</button>
							<button @click="downloadCollection(collection)" class="action-btn download-btn">
								Save JSON
							</button>
							<button @click="deleteCollection(collection.name)" class="action-btn delete-btn">
								Delete
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useMatchStore } from '@/stores/matchStore'
import { useSelectionStore } from '@/stores/selectionStore'
import { useRouter } from 'vue-router'
import type { MatchCollection } from '@/types/roa2Types'

const matchStore = useMatchStore()
const selectionStore = useSelectionStore()
const router = useRouter()

// Sorting state
type SortColumn = 'name' | 'type' | 'createdAt' | 'updatedAt'
type SortDirection = 'asc' | 'desc'

const sortColumn = ref<SortColumn>('name')
const sortDirection = ref<SortDirection>('asc')

// Sorted match collections
const matchCollections = computed(() => {
	const collections = [...matchStore.matchCollections]

	return collections.sort((a, b) => {
		let valueA: string | number
		let valueB: string | number

		switch (sortColumn.value) {
			case 'name':
				valueA = a.name.toLowerCase()
				valueB = b.name.toLowerCase()
				break
			case 'type':
				valueA = a.type
				valueB = b.type
				break
			case 'createdAt':
				valueA = new Date(a.createdAt).getTime()
				valueB = new Date(b.createdAt).getTime()
				break
			case 'updatedAt':
				valueA = new Date(a.updatedAt).getTime()
				valueB = new Date(b.updatedAt).getTime()
				break
			default:
				return 0
		}

		if (valueA < valueB) {
			return sortDirection.value === 'asc' ? -1 : 1
		}
		if (valueA > valueB) {
			return sortDirection.value === 'asc' ? 1 : -1
		}
		return 0
	})
})

function setSortColumn(column: SortColumn) {
	if (sortColumn.value === column) {
		// Toggle direction if same column
		sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
	} else {
		// Set new column with ascending direction
		sortColumn.value = column
		sortDirection.value = 'asc'
	}
}

function getSortClass(column: SortColumn): string {
	return sortColumn.value === column ? `sort-${sortDirection.value}` : ''
}

function getSortIcon(column: SortColumn): string {
	if (sortColumn.value !== column) return '↕'
	return sortDirection.value === 'asc' ? '↑' : '↓'
}

function formatDate(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleDateString('de-DE', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	})
}

function selectCollection(name: string) {
	selectionStore.setMatchCollectionName(name)
	router.push('/matches')
}

function deleteCollection(name: string) {
	if (confirm('Are you sure you want to delete this match collection? This action cannot be undone.')) {
		console.log(`Attempting to delete collection: "${name}"`)
		console.log('Available collections:', matchStore.matchCollections.map(c => c.name))

		matchStore.deleteMatchCollection(name)

		// If the deleted collection was selected, reset selection
		if (selectionStore.getSelectedMatchCollectionName === name) {
			selectionStore.resetMatchCollectionName()
		}
	}
}

function downloadCollection(collection: MatchCollection) {
	const jsonData = JSON.stringify(collection, null, 2)
	const blob = new Blob([jsonData], { type: 'application/json' })
	const url = URL.createObjectURL(blob)

	const link = document.createElement('a')
	link.href = url
	link.download = `${collection.name.replace(/[^a-z0-9]/gi, '_')}_collection.json`
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
	URL.revokeObjectURL(url)
}
</script>

<style scoped lang="css">
.match-collection-overview {
	background-color: rgba(0, 0, 0, 0.3);
	border-radius: 8px;
	padding: 1.5rem;
	margin-bottom: 2rem;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.header-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
}

.header-section h2 {
	margin: 0;
	color: white;
	font-size: 1.5rem;
}

.table-container {
	overflow-x: auto;
}

.collections-table {
	width: 100%;
	border-collapse: collapse;
	color: white;
}

.collections-table th {
	background-color: rgba(66, 185, 131, 0.8);
	color: white;
	padding: 0.75rem;
	text-align: left;
	font-weight: 600;
	border-bottom: 2px solid rgba(255, 255, 255, 0.2);
	vertical-align: middle;
}

.sortable-header {
	cursor: pointer;
	user-select: none;
	position: relative;
	transition: background-color 0.2s;
}

.sortable-header:hover {
	background-color: rgba(66, 185, 131, 1) !important;
}

.sortable-header.sort-asc {
	background-color: rgba(66, 185, 131, 0.9);
}

.sortable-header.sort-desc {
	background-color: rgba(66, 185, 131, 0.9);
}

.sort-icon {
	margin-left: 0.5rem;
	font-size: 0.8rem;
	opacity: 0.7;
}

.collections-table td {
	padding: 0.75rem;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	vertical-align: top;
	height: 60px;
}

.collection-row {
	height: 60px;
}

.collection-row:hover {
	background-color: rgba(255, 255, 255, 0.05);
}

.name-cell {
	font-weight: 600;
	max-width: 200px;
	word-wrap: break-word;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: 1.2;
}

.type-badge {
	padding: 0.25rem 0.5rem;
	border-radius: 12px;
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
}

.type-badge.ranked {
	background-color: #ff6b6b;
	color: white;
}

.type-badge.casual {
	background-color: #4ecdc4;
	color: white;
}

.type-badge.friendly {
	background-color: #45b7d1;
	color: white;
}

.type-badge.tournament {
	background-color: #f9ca24;
	color: #333;
}

.description-cell {
	max-width: 300px;
	word-wrap: break-word;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: 1.2;
}

.date-cell {
	font-size: 0.875rem;
	color: rgba(255, 255, 255, 0.8);
	white-space: nowrap;
}

.actions-cell {
	display: flex;
	gap: 0.5rem;
	align-items: center;
	justify-content: flex-start;
	min-width: 140px;
	height: 100%;
	padding-top: 0.75rem;
	padding-bottom: 0.75rem;
}

.action-btn {
	padding: 0.375rem 0.75rem;
	border: none;
	border-radius: 4px;
	font-size: 0.75rem;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 0.2s ease;
	white-space: nowrap;
	min-width: 60px;
	text-align: center;
}

.select-btn {
	background-color: #42b983;
	color: white;
}

.select-btn:hover {
	background-color: #369870;
}

.download-btn {
	background-color: #f39c12;
	color: white;
}

.download-btn:hover {
	background-color: #e67e22;
}

.delete-btn {
	background-color: #ff6b6b;
	color: white;
}

.delete-btn:hover {
	background-color: #e55a5a;
}

.no-data {
	text-align: center;
	color: rgba(255, 255, 255, 0.6);
	font-style: italic;
	padding: 2rem;
}

@media (max-width: 768px) {
	.collections-table {
		font-size: 0.875rem;
	}

	.collections-table th,
	.collections-table td {
		padding: 0.5rem;
	}

	.actions-cell {
		flex-direction: column;
		gap: 0.25rem;
		min-width: auto;
	}

	.action-btn {
		min-width: 80px;
		padding: 0.25rem 0.5rem;
	}
}
</style>
