<script setup lang="ts">
import VirtualKeyboard from './components/VirtualKeyboard.vue'
</script>

<template>
	<VirtualKeyboard />
</template>

<style lang="scss">
* {
	margin: 0;
	box-sizing: border-box;
	border: 0;
	padding: 0;
	outline: 0;
}

*,
html,
body {
	font-family: 'Roboto', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	font-size: 1rem;
	color: #fff;
}

html,
body {
	background: #1e1f1e;
}
</style>
