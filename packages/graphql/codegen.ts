import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GRAPHQL_ENDPOINT || 'http://localhost:5000/graphql',
  documents: ['src/**/*.graphql'],
  generates: {
    'src/generated/types.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
