import { environment as prodEnv} from "./environnement/environnement-prod.js";
import { environment as localEnv } from './environnement/environnement.js';
import { envVariableUtils } from './utils/env-variable-utils.js';

const profile = envVariableUtils.requireEnv("PROFILE");

const envConfig = (() => {
    switch (profile) {
        case "local": return localEnv;
        case "prod": return prodEnv;
        default: throw new Error("Unknown profile");
    }
})();

export function getEnvironnement() {
    return envConfig;
}