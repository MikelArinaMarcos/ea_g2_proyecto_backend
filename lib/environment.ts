import dotenv from 'dotenv';

dotenv.config();

enum Environments {
  local_environment = 'local',
  dev_environment = 'dev',
  prod_environment = 'prod',
  qa_environment = 'qa',
}

class Environment {
  private environment: string;

  constructor(environment: string) {
    this.environment = environment || Environments.local_environment;
  }

  getPort(): number {
    const port = process.env.PORT ? parseInt(process.env.PORT) : null;
    if (port) {
      return port;
    }
    if (this.environment === Environments.prod_environment) {
      return 8081;
    } else if (this.environment === Environments.dev_environment) {
      return 8082;
    } else if (this.environment === Environments.qa_environment) {
      return 8083;
    } else {
      return 3000;
    }
  }

  getDBName(): string {
    if (this.environment === Environments.prod_environment) {
      return 'db_spotfinder_prod';
    } else if (this.environment === Environments.dev_environment) {
      return 'db_spotfinder_dev';
    } else if (this.environment === Environments.qa_environment) {
      return 'db_spotfinder_qa';
    } else {
      return 'db_spotfinder_local';
    }
  }

  getGoogleClientID(): string {
    return process.env.GOOGLE_CLIENT_ID || '';
  }

  getGoogleClientSecret(): string {
    return process.env.GOOGLE_CLIENT_SECRET || '';
  }

  getGoogleCallbackURL(): string {
    return process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback';
  }

  getSessionSecret(): string {
    return process.env.SESSION_SECRET || 'default_session_secret';
  }
}

export default new Environment(process.env.NODE_ENV || Environments.local_environment);

