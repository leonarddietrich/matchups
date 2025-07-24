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
.modal-container .form-group {
	margin-bottom: 1rem;
}

.modal-container .form-group label {
	display: block;
	margin-bottom: 0.5rem;
	font-weight: 500;
	color: #e2e8f0;
	font-size: 0.9rem;
}

.modal-container .form-input {
	width: 100%;
	padding: 0.75rem;
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 6px;
	font-size: 0.9rem;
	box-sizing: border-box;
	background-color: rgba(255, 255, 255, 0.1);
	color: #e2e8f0;
	transition: all 0.2s ease;
}

.modal-container .form-input:focus {
	outline: none;
	border-color: #42b983;
	box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
	background-color: rgba(255, 255, 255, 0.15);
}

.modal-container .form-input.error {
	border-color: #e74c3c;
	box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
}

.modal-container .form-input::placeholder {
	color: #94a3b8;
}

.modal-container .form-input[disabled] {
	opacity: 0.6;
	cursor: not-allowed;
	background-color: rgba(255, 255, 255, 0.05);
}

.modal-container textarea.form-input {
	resize: vertical;
	min-height: 80px;
	line-height: 1.4;
}

.modal-container select.form-input {
	cursor: pointer;
}

.modal-container .btn {
	padding: 0.75rem 1.5rem;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 0.9rem;
	font-weight: 500;
	transition: all 0.2s ease;
	min-width: 80px;
}

.modal-container .btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.modal-container .btn-primary {
	background-color: #42b983;
	color: white;
}

.modal-container .btn-primary:hover:not(:disabled) {
	background-color: #369870;
	transform: translateY(-1px);
}

.modal-container .btn-secondary {
	background-color: #6c757d;
	color: white;
}

.modal-container .btn-secondary:hover:not(:disabled) {
	background-color: #5a6268;
	transform: translateY(-1px);
}

.modal-container .btn-danger {
	background-color: #e74c3c;
	color: white;
}

.modal-container .btn-danger:hover:not(:disabled) {
	background-color: #c0392b;
	transform: translateY(-1px);
}

.modal-container .error-message {
	color: #ff6b81;
	font-size: 0.85rem;
	margin-top: 0.5rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.modal-container .info-section {
	background-color: rgba(66, 185, 131, 0.1);
	border: 1px solid rgba(66, 185, 131, 0.3);
	border-radius: 6px;
	padding: 1rem;
	margin: 1rem 0;
}

.modal-container .warning-section {
	background-color: rgba(255, 193, 7, 0.1);
	border: 1px solid rgba(255, 193, 7, 0.3);
	border-radius: 6px;
	padding: 1rem;
	margin: 1rem 0;
}

.modal-container .error-section {
	background-color: rgba(231, 76, 60, 0.1);
	border: 1px solid rgba(231, 76, 60, 0.3);
	border-radius: 6px;
	padding: 1rem;
	margin: 1rem 0;
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
