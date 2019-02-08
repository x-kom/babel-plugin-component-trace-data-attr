import kebabCase from 'lodash.kebabcase'
import camelCase from 'lodash.camelcase'
import snakeCase from 'lodash.snakecase'
import isString from 'lodash.isstring'

const langTransforms = {
  kebab: kebabCase,
  camel: camelCase,
  snake: snakeCase
}

const isValidOption = opt => opt && isString(opt)

const validTranform = opt => {
  return Object.keys(langTransforms).indexOf(opt) > -1
}

const checkValidOptions = state => {
  let attribute = 'data-component-trace'
  let format = 'kebab'
  let separator = ' '

  if (isValidOption(state.opts.attribute)) {
    attribute = state.opts.attribute
  }

  if (isValidOption(state.opts.format) && validTranform(state.opts.format)) {
    format = state.opts.format
  }

  if (isValidOption(state.opts.separator)) {
    separator = state.opts.separator
  }

  return {
    format: langTransforms[format],
    attribute: attribute,
    separator: separator
  }
}

export default checkValidOptions
