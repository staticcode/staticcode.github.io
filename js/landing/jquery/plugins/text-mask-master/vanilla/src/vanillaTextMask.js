import createTextMaskInputElement from '../../core/src/createTextMaskInputElement.js'

export function maskInput(textMaskConfig) {
  const {inputElement} = textMaskConfig
  const textMaskInputElement = createTextMaskInputElement(textMaskConfig)
  const inputHandler = ({target: {value}}) => textMaskInputElement.update(value)

  inputElement.addEventListener('input', inputHandler)

  textMaskInputElement.update(inputElement.value)

  return {
    textMaskInputElement,

    destroy() {
      inputElement.removeEventListener('input', inputHandler)
    }
  }
}

export default maskInput
