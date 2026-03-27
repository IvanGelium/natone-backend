import antfu from '@antfu/eslint-config'
import prettier from 'eslint-config-prettier'

export default antfu(
  {
    typescript: true,
    stylistic: true,
  },
  {
    ignores: [
      'dist',
      'node_modules',
      'src/generated',
    ],
  },
  prettier,
)
