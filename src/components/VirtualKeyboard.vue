<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

type Keys = {
	key: string
	specialKey?: string | null
	className?: string
}

const keys: Array<Array<Keys>> = [
	[
		{
			key: '1',
			specialKey: null,
		},
		{
			key: '2',
			specialKey: null,
		},
		{
			key: '3',
			specialKey: null,
		},
		{
			key: '4',
			specialKey: null,
		},
		{
			key: '5',
			specialKey: null,
		},
		{
			key: '6',
			specialKey: null,
		},
		{
			key: '7',
			specialKey: null,
		},
		{
			key: '8',
			specialKey: null,
		},
		{
			key: '9',
			specialKey: null,
		},
		{
			key: '0',
			specialKey: null,
		},
	],
	[
		{
			key: 'q',
			specialKey: '%',
		},
		{
			key: 'w',
			specialKey: '\\',
		},
		{
			key: 'e',
			specialKey: '|',
		},
		{
			key: 'r',
			specialKey: '=',
		},
		{
			key: 't',
			specialKey: '[',
		},
		{
			key: 'y',
			specialKey: ']',
		},
		{
			key: 'u',
			specialKey: '<',
		},
		{
			key: 'i',
			specialKey: '>',
		},
		{
			key: 'o',
			specialKey: '{',
		},
		{
			key: 'p',
			specialKey: '}',
		},
	],
	[
		{
			key: 'a',
			specialKey: '@',
		},
		{
			key: 's',
			specialKey: '#',
		},
		{
			key: 'd',
			specialKey: '$',
		},
		{
			key: 'f',
			specialKey: '_',
		},
		{
			key: 'g',
			specialKey: '&',
		},
		{
			key: 'h',
			specialKey: '-',
		},
		{
			key: 'j',
			specialKey: '+',
		},
		{
			key: 'k',
			specialKey: '(',
		},
		{
			key: 'l',
			specialKey: ')',
		},
	],
	[
		{
			key: 'shift',
			className: '--wide',
		},
		{
			key: 'z',
			specialKey: '*',
		},
		{
			key: 'x',
			specialKey: '"',
		},
		{
			key: 'c',
			specialKey: "'",
		},
		{
			key: 'v',
			specialKey: ':',
		},
		{
			key: 'b',
			specialKey: ';',
		},
		{
			key: 'n',
			specialKey: '!',
		},
		{
			key: 'm',
			specialKey: '?',
		},
		{
			key: 'backspace',
			className: '--wide',
		},
	],
	[
		{
			key: ',',
		},
		{
			key: 'whitespace',
			className: '--extra-wide',
		},
		{
			key: '.',
		},
	],
]

const inputValue = ref('')
const typeSpecielCharacter = ref(false)
const showTooltip = ref(false)
const activeKey = ref<string | null>(null)
const shift = ref(false)
const inputRef = ref<HTMLInputElement>()
const keyTooltipRef = ref<HTMLDivElement>()
const keyTimeout = ref<number>()
const width = ref<number>(0)

const onResize = () => (width.value = window.innerWidth)
const isMoreThan668px = () => width.value > 668

onMounted(() => {
	if (inputRef.value) inputRef.value.focus()
	onResize()
	window.addEventListener('resize', onResize, { passive: true })
})

onUnmounted(() => {
	if (typeof window !== 'undefined') {
		window.removeEventListener('resize', onResize)
	}
})

const toggleShift = () => {
	if (shift.value) {
		shift.value = false
	} else {
		shift.value = true
	}
}

const isIconKey = (key: string) => ['shift', 'backspace', 'whitespace'].includes(key)

const handleMouseUp = () => {
	clearTimeout(keyTimeout.value)

	if (!activeKey.value || isIconKey(activeKey.value)) return

	inputValue.value = inputValue.value + (shift.value ? (activeKey.value as string).toUpperCase() : activeKey.value)

	activeKey.value = null
	typeSpecielCharacter.value = false
	showTooltip.value = false
}

const handleClickBackspace = () => {
	if (inputValue.value.length > 0) {
		inputValue.value = inputValue.value.slice(0, -1)
	}
}

const handleClickWhitespace = () => {
	inputValue.value = inputValue.value + ' '
}

const handleChange = (e: Event) => {
	inputValue.value = (e.target as HTMLInputElement).value
}

const handleMouseDown = (key: string, specialKey?: string | null | undefined) => {
	if (isIconKey(key)) return
	const keyElement = document.getElementById(`key${key.toUpperCase()}`)

	if (keyElement && keyTooltipRef.value) {
		const { top, left } = keyElement.getBoundingClientRect()
		keyTooltipRef.value.style.top = `calc(${top}px - 60px)`
		keyTooltipRef.value.style.left = `${left}px`
	}

	activeKey.value = key

	if (specialKey) {
		showTooltip.value = true
		keyTimeout.value = setTimeout(() => {
			activeKey.value = specialKey
			typeSpecielCharacter.value = true
		}, 400)
	}
}

const handleClickNonCharacters = (key: string) => {
	if (key === 'shift') {
		toggleShift()
	} else if (key === 'whitespace') {
		handleClickWhitespace()
	} else {
		handleClickBackspace()
	}
}
</script>

<template>
	<div class="virtual-keyboard">
		<input
			placeholder="Type something..."
			class="virtual-keyboard__input"
			:value="inputValue"
			@input="handleChange"
			ref="inputRef"
		/>
		<div
			class="virtual-keyboard__keyboard"
			:class="{
				'--shift-active': shift,
			}"
		>
			<div
				class="keypressing__tooltip"
				:class="{
					'--active': showTooltip,
					'--special-character': typeSpecielCharacter,
				}"
				ref="keyTooltipRef"
			>
				{{ activeKey }}
			</div>
			<div v-for="(row, index) in keys" :key="index">
				<button
					v-for="(rowKey, index) in row"
					class="keyboard__key"
					:key="index"
					:class="{
            [rowKey.className as string]: rowKey.className,
          }"
					:id="`key${rowKey.key.toUpperCase()}`"
					@mousedown="() => isMoreThan668px() && handleMouseDown(rowKey.key, rowKey.specialKey)"
					@mouseup="() => isMoreThan668px() && handleMouseUp()"
					@mouseleave="() => isMoreThan668px() && handleMouseUp()"
					@touchstart="() => !isMoreThan668px() && handleMouseDown(rowKey.key, rowKey.specialKey)"
					@touchend="() => !isMoreThan668px() && handleMouseUp()"
					@touchmove="() => !isMoreThan668px() && handleMouseUp()"
					@click="() => isIconKey(rowKey.key) && handleClickNonCharacters(rowKey.key)"
				>
					{{ !isIconKey(rowKey.key) ? rowKey.key : '' }}
					<img src="../assets/keyboard-shift-lowercase.svg" v-if="!shift && rowKey.key === 'shift'" />
					<img src="../assets/keyboard-shift-uppercase.svg" v-if="shift && rowKey.key === 'shift'" />
					<img src="../assets/backspace.svg" v-if="rowKey.key === 'backspace'" />
					<img src="../assets/keyboard-space.svg" v-if="rowKey.key === 'whitespace'" style="width: 25px" />
					<span v-if="!!rowKey.specialKey">{{ rowKey.specialKey }}</span>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.virtual-keyboard {
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.virtual-keyboard__input {
		max-width: 500px;
		width: 100%;
		padding: 1rem;
		background-color: #ffffff10;
		border-radius: 10px;
		margin-bottom: 2rem;
		box-shadow: 0 0 10px 1px #3333331a;
		font-weight: lighter;

		&::placeholder {
			color: #ffffff44;
		}
	}
	.virtual-keyboard__keyboard {
		width: 100%;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;

		> div {
			width: 100%;
			margin-bottom: 10px;
			display: flex;
			justify-content: center;
		}

		&.--shift-active {
			.keyboard__key {
				text-transform: uppercase;
			}
		}

		.keyboard__key {
			height: 55px;
			padding: 1rem;
			width: 45px;
			max-width: 45px;
			min-width: 45px;
			background-color: #ffffff10;
			color: #fff;
			margin-right: 5px;
			border-radius: 10px;
			cursor: pointer;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			transition: all 0.3s;
			position: relative;
			font-weight: lighter;
			user-select: none;

			span {
				position: absolute;
				top: 8px;
				right: 8px;
				font-size: 12px;
				color: #ffffff66;
			}

			&:last-child {
				margin-right: 0;
			}

			&:hover {
				filter: brightness(0.7);
			}

			&.--wide {
				width: 100%;
				max-width: 100px;
			}

			&.--extra-wide {
				width: 100%;
				max-width: 300px;
			}
			&.--extra-wide,
			&.--wide {
				color: #fff;
				background-color: #d1277c;
				box-shadow: 0 0 10px 1px #d1277c;
			}

			&.--active {
				box-shadow: 0 0 20px 1px #d1277c;

				&:hover {
					filter: brightness(1);
				}
			}
			img {
				width: 20px;
				margin: 0 10px;
			}
		}

		.keypressing__tooltip {
			height: 55px;
			padding: 1rem;
			width: 100%;
			max-width: 45px;
			border-radius: 10px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			position: fixed;
			top: 0;
			left: 0;
			background-color: #fff;
			color: #d1277c;
			opacity: 0;
			transition: opacity 0.3s, background-color 0.3s;
			z-index: 100;
			box-shadow: none;
			pointer-events: none;

			&.--active {
				opacity: 1;
			}
			&.--special-character {
				color: #fff;
				background-color: #d1277c;
				box-shadow: 0 0 10px 1px #d1277c;
			}
		}

		@media screen and (max-width: 668px) {
			padding: 0;
			max-width: 100%;

			> div {
				margin-bottom: 3px;
			}
			.keyboard__key {
				width: 35px;
				font-size: 1.2rem;
				min-width: 35px;
				padding: 0;
				margin-right: 3px;
				background-color: transparent;

				&.--extra-wide,
				&.--wide {
					margin: 0;
					margin-right: 3px;

					&:last-child {
						margin-right: 0px;
					}
				}

				&.--extra-wide {
					width: 100%;
					max-width: 180px;
				}
				&.--wide {
					width: 100%;
					max-width: 80px;
				}

				&:hover {
					filter: none;
				}
			}

			.keypressing__tooltip {
				width: 35px;
				min-width: 35px;
			}
		}
	}

	@media screen and (max-width: 668px) {
		padding: 5px;
		.virtual-keyboard__input {
			max-width: 100%;
			min-width: 100%;
		}
	}
}
</style>
