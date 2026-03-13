import { getSuperUsers, getIsSuperUserDeleteEnabled } from './ssm-config';

// Mock the SSM client
jest.mock('@aws-sdk/client-ssm');

describe('ssm-config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getSuperUsers', () => {
    it('returns super users from environment variable when set', async () => {
      process.env.SUPER_USERS = 'user1@example.com,user2@example.com';

      const result = await getSuperUsers();

      expect(result).toEqual(['user1@example.com', 'user2@example.com']);
    });

    it('trims whitespace from email addresses', async () => {
      process.env.SUPER_USERS = '  user1@example.com  ,  user2@example.com  ';

      const result = await getSuperUsers();

      expect(result).toEqual(['user1@example.com', 'user2@example.com']);
    });

    it('filters out empty strings', async () => {
      process.env.SUPER_USERS = 'user1@example.com,,user2@example.com';

      const result = await getSuperUsers();

      expect(result).toEqual(['user1@example.com', 'user2@example.com']);
    });

    it('returns empty array when environment variable is empty', async () => {
      process.env.SUPER_USERS = '';

      const result = await getSuperUsers();

      expect(result).toEqual([]);
    });
  });

  describe('getIsSuperUserDeleteEnabled', () => {
    it('returns true when environment variable is "true"', async () => {
      process.env.IS_SUPER_USER_DELETE_ENABLED = 'true';

      const result = await getIsSuperUserDeleteEnabled();

      expect(result).toBe(true);
    });

    it('returns false when environment variable is "false"', async () => {
      process.env.IS_SUPER_USER_DELETE_ENABLED = 'false';

      const result = await getIsSuperUserDeleteEnabled();

      expect(result).toBe(false);
    });

    it('returns false when environment variable is any other value', async () => {
      process.env.IS_SUPER_USER_DELETE_ENABLED = 'yes';

      const result = await getIsSuperUserDeleteEnabled();

      expect(result).toBe(false);
    });
  });
});
