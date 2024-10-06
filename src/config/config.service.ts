require('dotenv').config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  public getOptions() {
    return {
      autoIndex: true,
      retryAttempts: process.env.MONGO_SETTINGS__RETRY_ATTEMPTS ? parseInt(process.env.MONGO_SETTINGS__RETRY_ATTEMPTS) : 10
    };
  }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('SERVER_PORT', true);
  }

  public getDbName() {
    return this.getValue('MONGO_DB', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public isMongoOptions() {
    return {
      retryAttempts: process.env.MONGO_SETTINGS__RETRY_ATTEMPTS ? parseInt(process.env.MONGO_SETTINGS__RETRY_ATTEMPTS) : 10
    }
  }

  public getMongoConfig(): string {
    const user = this.getValue('MONGO_USERNAME');
    const pass = this.getValue('MONGO_PASSWORD');
    const host = this.getValue('MONGO_HOST');
    const port = this.getValue('MONGO_PORT');
    const db = this.getValue('MONGO_DB');

    return `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=admin`
  }
}


const configService = new ConfigService(process.env)
  .ensureValues([
    'MONGO_HOST',
    'MONGO_PORT',
    'MONGO_USERNAME',
    'MONGO_PASSWORD',
    'MONGO_DB'
  ]);

export { configService };
// export = configService;
