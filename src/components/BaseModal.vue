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
	background: rgba(4, 6, 16, 0.7);
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
	background: rgba(6, 10, 30, 0.92);
	border-radius: 20px;
	box-shadow: 0 24px 60px rgba(4, 6, 16, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.02);
	transition: all 0.3s ease;
	border: 1px solid rgba(96, 112, 202, 0.32);
}

.modal-header {
	flex-shrink: 0;
	padding: 1.5rem 1.5rem 1rem 1.5rem;
	border-bottom: 1px solid rgba(96, 112, 202, 0.22);
	background: rgba(10, 16, 44, 0.4);
}

.modal-header h3 {
	margin: 0;
	color: rgba(190, 205, 255, 0.95);
	font-size: 1.35rem;
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.modal-body {
	overflow-y: auto;
	max-height: calc(90vh - 160px);
	padding: 1.6rem;
	color: rgba(216, 224, 255, 0.85);
	background: linear-gradient(180deg, rgba(6, 10, 30, 0.92) 0%, rgba(8, 12, 34, 0.94) 100%);
}

.modal-footer {
	flex-shrink: 0;
	padding: 1rem 1.5rem 1.5rem 1.5rem;
	border-top: 1px solid rgba(96, 112, 202, 0.22);
	display: flex;
	justify-content: flex-end;
	gap: 0.75rem;
	background: rgba(8, 12, 34, 0.85);
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
	color: rgba(181, 197, 255, 0.95);
	font-size: 0.95rem;
	letter-spacing: 0.03em;
}

:deep(.form-input) {
	width: 100%;
	padding: 0.75rem;
	border: 1px solid rgba(132, 148, 220, 0.35);
	border-radius: 6px;
	font-size: 0.95rem;
	box-sizing: border-box;
	background: rgba(10, 16, 44, 0.85);
	color: #f8fafc;
	transition: all 0.2s ease;
}

:deep(.form-input:focus) {
	outline: none;
	border-color: rgba(166, 186, 255, 0.75);
	box-shadow: 0 0 0 3px rgba(120, 150, 255, 0.2);
	background: rgba(14, 22, 60, 0.9);
}

:deep(.form-input.error) {
	border-color: #e74c3c;
	box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
}

:deep(.form-input::placeholder) {
	color: rgba(164, 182, 255, 0.55);
}

:deep(.form-input[disabled]) {
	opacity: 0.6;
	cursor: not-allowed;
	background-color: rgba(18, 24, 56, 0.6);
}

:deep(textarea.form-input) {
	resize: vertical;
	min-height: 110px;
	line-height: 1.4;
}

:deep(input[type='number'].form-input) {
	appearance: textfield;
	-moz-appearance: textfield;
}

:deep(input[type='number'].form-input::-webkit-inner-spin-button),
:deep(input[type='number'].form-input::-webkit-outer-spin-button) {
	-webkit-appearance: none;
	margin: 0;
}

:deep(select.form-input) {
	cursor: pointer;
	background-color: rgba(14, 20, 36, 0.92);
	color: #f8fafc;
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	color-scheme: dark;
}

:deep(select.form-input:focus) {
	background-color: rgba(20, 28, 48, 0.95);
}

:deep(select.form-input option),
:deep(select.form-input optgroup) {
	background-color: rgba(8, 12, 28, 0.98) !important;
	color: #e7ebff !important;
}

:deep(select.form-input option:hover),
:deep(select.form-input option:focus),
:deep(select.form-input option:checked) {
	background-color: rgba(66, 185, 131, 0.85) !important;
	color: #04160f !important;
}

/* Button styles moved to global utilities (theme.css) */

:deep(.error-message) {
	color: #ff6b81;
	font-size: 0.85rem;
	margin-top: 0.25rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

:deep(.info-section) {
	background: rgba(40, 70, 120, 0.18);
	border: 1px solid rgba(126, 190, 255, 0.38);
	border-radius: 12px;
	padding: 1rem;
	margin: 0.75rem 0;
	box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

:deep(.warning-section) {
	background: rgba(120, 80, 10, 0.18);
	border: 1px solid rgba(255, 190, 120, 0.38);
	border-radius: 12px;
	padding: 1rem;
	margin: 0.75rem 0;
	box-shadow: inset 0 0 0 1px rgba(255, 204, 140, 0.08);
}

:deep(.error-section) {
	background: rgba(120, 18, 26, 0.2);
	border: 1px solid rgba(255, 120, 138, 0.4);
	border-radius: 12px;
	padding: 1rem;
	margin: 0.75rem 0;
	box-shadow: inset 0 0 0 1px rgba(255, 120, 138, 0.08);
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
