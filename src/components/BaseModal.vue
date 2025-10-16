<template>
	<Transition name="modal">
		<div v-if="show" class="modal-mask" @click="$emit('close')">
			<div class="modal-container" @click.stop>
				<div class="modal-header">
					<slot name="header">
						<h3>Modal Header</h3>
					</slot>
				</div>
				<div class="modal-body">
					<slot name="body">
						<p>This is the modal body content.</p>
					</slot>
				</div>
				<div class="modal-footer">
					<slot name="footer">
						<button @click="$emit('close')">Close</button>
					</slot>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'BaseModal',
	props: {
		show: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['close'],
})
</script>

<style scoped>
.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	transition: opacity 0.3s ease;
	display: flex;
	z-index: 1000;
}

.modal-container {
	width: 600px;
	max-width: 95vw;
	max-height: 90vh;
	margin: auto;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	background-color: #2f2f2f;
	border-radius: 8px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	transition: all 0.3s ease;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
	flex-shrink: 0;
	padding: 1.5rem 1.5rem 1rem 1.5rem;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
	margin: 0;
	color: #42b983;
	font-size: 1.5rem;
	font-weight: 600;
}

.modal-body {
	overflow-y: auto;
	max-height: calc(90vh - 160px);
	padding: 1.5rem;
	color: #e2e8f0;
}

.modal-footer {
	flex-shrink: 0;
	padding: 1rem 1.5rem 1.5rem 1.5rem;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	display: flex;
	justify-content: flex-end;
	gap: 0.75rem;
}

/* Global modal styles that all modals inherit */
:deep(.form-container) {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	width: 100%;
}

:deep(.form-group) {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

:deep(.form-group label) {
	font-weight: 600;
	color: #e2e8f0;
	font-size: 0.95rem;
}

:deep(.form-input) {
	width: 100%;
	padding: 0.75rem;
	border: 1px solid rgba(255, 255, 255, 0.25);
	border-radius: 6px;
	font-size: 0.95rem;
	box-sizing: border-box;
	background-color: rgba(255, 255, 255, 0.08);
	color: #f8fafc;
	transition: all 0.2s ease;
}

:deep(.form-input:focus) {
	outline: none;
	border-color: #42b983;
	box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
	background-color: rgba(255, 255, 255, 0.12);
}

:deep(.form-input.error) {
	border-color: #e74c3c;
	box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
}

:deep(.form-input::placeholder) {
	color: #94a3b8;
}

:deep(.form-input[disabled]) {
	opacity: 0.6;
	cursor: not-allowed;
	background-color: rgba(255, 255, 255, 0.05);
}

:deep(textarea.form-input) {
	resize: vertical;
	min-height: 110px;
	line-height: 1.4;
}

:deep(select.form-input) {
	cursor: pointer;
}

:deep(.btn) {
	padding: 0.75rem 1.5rem;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 0.9rem;
	font-weight: 500;
	transition: all 0.2s ease;
	min-width: 90px;
}

:deep(.btn:disabled) {
	opacity: 0.6;
	cursor: not-allowed;
}

:deep(.btn-primary) {
	background-color: #42b983;
	color: white;
}

:deep(.btn-primary:hover:not(:disabled)) {
	background-color: #369870;
	transform: translateY(-1px);
}

:deep(.btn-secondary) {
	background-color: #6c757d;
	color: white;
}

:deep(.btn-secondary:hover:not(:disabled)) {
	background-color: #5a6268;
	transform: translateY(-1px);
}

:deep(.btn-danger) {
	background-color: #e74c3c;
	color: white;
}

:deep(.btn-danger:hover:not(:disabled)) {
	background-color: #c0392b;
	transform: translateY(-1px);
}

:deep(.error-message) {
	color: #ff6b81;
	font-size: 0.85rem;
	margin-top: 0.25rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

:deep(.info-section) {
	background-color: rgba(66, 185, 131, 0.1);
	border: 1px solid rgba(66, 185, 131, 0.3);
	border-radius: 6px;
	padding: 1rem;
	margin: 0.5rem 0;
}

:deep(.warning-section) {
	background-color: rgba(255, 193, 7, 0.1);
	border: 1px solid rgba(255, 193, 7, 0.3);
	border-radius: 6px;
	padding: 1rem;
	margin: 0.5rem 0;
}

:deep(.error-section) {
	background-color: rgba(231, 76, 60, 0.1);
	border: 1px solid rgba(231, 76, 60, 0.3);
	border-radius: 6px;
	padding: 1rem;
	margin: 0.5rem 0;
}

.modal-default-button {
	float: right;
}

.modal-enter-from {
	opacity: 0;
}

.modal-leave-to {
	opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
	-webkit-transform: scale(0.95);
	transform: scale(0.95);
}
</style>
