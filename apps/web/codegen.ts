import { CodegenConfig } from "@graphql-codegen/cli";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = dirname(fileURLToPath(import.meta.url));
const documentsGlob = `${webRoot}/src/**/*.{ts,tsx,graphql}`;
const outputDir = `${webRoot}/src/gql/`;

const config : CodegenConfig = {
    schema : "http://localhost:4000/graphql",
    documents:[documentsGlob],
    ignoreNoDocuments: true,
    generates: {
        [outputDir]:{
            preset:'client',
            plugins:[],
            presetConfig:{
                gqlTagName:'graphql',
            }
        }
    }
}

export default config;
