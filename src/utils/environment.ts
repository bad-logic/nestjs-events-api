enum STAGE {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  QA = 'qa',
  PRODUCTION = 'production',
  UAT = 'uat',
  TESTING = 'test',
}

interface IEnvironment {
  stage: STAGE;
  apiPort: number;
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  jwtSecret: string;
  jwtExpiresIn: number;
}

class Environment implements IEnvironment {
  stage: STAGE;
  apiPort: number;
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  jwtSecret: string;
  jwtExpiresIn: number;

  NODE_ENV?: 'production' | 'development';

  private static instance: Environment;

  /**
   * constructor
   */
  private constructor() {
    this.NODE_ENV = this.getString<'production' | 'development'>('NODE_ENV');
    this.stage = STAGE.LOCAL;
    this.apiPort = this.getNumber('PORT');
    this.dbHost = this.getString('DATABASE_HOST');
    this.dbPort = this.getNumber('DATABASE_PORT');
    this.dbName = this.getString('DATABASE_NAME');
    this.dbUser = this.getString('DATABASE_USER');
    this.dbPassword = this.getString('DATABASE_PASSWORD');
    this.jwtSecret = this.getString('JWT_SECRET');
    this.jwtExpiresIn = this.getNumber('JWT_EXPIRES_IN');
  }

  /**
   * extracts string from process.env
   *
   * @param { string } key
   * @returns { string }
   */
  private getString<T extends string>(key: string): T {
    const rawValue = process.env[key]?.trim();
    if (rawValue === undefined) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return rawValue as T;
  }

  /**
   * extracts boolean from process.env 1 true 0 false
   *
   * @param { string } key
   * @returns { boolean }
   */
  private getBoolean(key: string): boolean {
    const rawValue = process.env[key]?.trim();
    if (rawValue === undefined) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    if (Number.isNaN(rawValue)) {
      throw new Error(
        `cannot convert Environment variable ${key} to type boolean`,
      );
    }
    return Boolean(Number(rawValue));
  }

  /**
   * extracts number from process.env
   *
   * @param { string } key
   * @returns { number | undefined }
   */
  private getNumber(key: string): number {
    const rawValue = process.env[key]?.trim();
    if (rawValue === undefined) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    if (Number.isNaN(rawValue)) {
      throw new Error(
        `cannot convert Environment variable ${key} to type number`,
      );
    }
    return Number(rawValue);
  }

  /**
   * extracts array from process.env
   *
   * @param {string} key
   * @returns {T[] | undefined}
   */
  private getArray<T extends string>(key: string): T[] {
    const rawValue = process.env[key];
    if (rawValue === undefined) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return rawValue.trim().split(',') as T[];
  }

  static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }
}

export const environment = Environment.getInstance();
export default environment;
