import { Linter } from 'eslint';

const config: Linter.Config = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@/features/*/*'],
        message: 'Não é permitido importar de "@/features".',
      },
    ],
    'import/no-cycle': 'error',
  },
};

export default config;
