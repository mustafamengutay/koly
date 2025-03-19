import { checkEnvironmentVariables } from '../../utils/environmentUtils';

describe('checkEnvironmentVariables', () => {
  const environmentVariables = ['DATABASE_URL'];
  const originalUserEnvironment = process.env;

  beforeEach(() => {
    process.env = {};
  });

  afterAll(() => {
    process.env = originalUserEnvironment;
  });

  it('should not throw an error if all environment variables are defined', () => {
    process.env.DATABASE_URL = 'databaseURL';

    expect(() => checkEnvironmentVariables(environmentVariables)).not.toThrow();
  });

  it('should throw an error if an environment variable is missing', () => {
    expect(() => checkEnvironmentVariables(environmentVariables)).toThrow(
      'DATABASE_URL is missing in .env file. Check DATABASE_URL and its value.'
    );
  });

  it('should throw an error if an environment variable array is empty', () => {
    const environmentVariables: string[] = [];
    process.env.DATABASE_URL = 'databaseURL';

    expect(() => checkEnvironmentVariables(environmentVariables)).toThrow(
      'The array is empty. Please add some environment variables into the array.'
    );
  });
});
