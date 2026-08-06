import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:5000/graphql',
  documents: ['graphql/**/*.graphql', '../../packages/graphql/src/**/*.graphql'],
  generates: {
    'graphql/generated/types.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
