class EnvVariableUtils {

  requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
      throw new Error(`Missing env variable ${name}`);
    }

    return value;
  }

}

export const envVariableUtils = new EnvVariableUtils();