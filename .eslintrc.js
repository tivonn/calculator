module.exports = {
  root: true,
  parserOptions: {
  	parser: 'babel-eslint'
  },
  'env': {
  	'node': true
  },
  extends: [
  	'plugin:vue/essential',
  	'@vue/standard'
  ],
  globals: {
  	$: true
  },
  'rules': {
  	'arrow-parens': 0,
  	'eqeqeq': 0,
  	'generator-star-spacing': 0,
  	'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  	'space-before-function-paren': 0,
  	'no-template-curly-in-string': 0,
  	'no-return-assign': 0,
  	'no-mixed-operators': 0
  }
}