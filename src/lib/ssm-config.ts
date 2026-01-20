import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

// Initialize client only if we're in a Lambda environment (has AWS credentials)
let client: SSMClient | null = null;
try {
  if (process.env.AWS_EXECUTION_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    client = new SSMClient({
      region: process.env.AWS_REGION || 'eu-west-2',
    });
  }
} catch (error) {
  console.warn('Failed to initialize SSM client, will use environment variables:', error);
}

// Cache parameters for the lifetime of the Lambda container
// This reduces SSM API calls and improves performance
const cache: Record<string, { value: string; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getSSMParameter(name: string): Promise<string> {
  // If no SSM client available (e.g., local/test environment), return empty string
  if (!client) {
    return '';
  }

  const now = Date.now();

  // Return cached value if still fresh
  if (cache[name] && now - cache[name].timestamp < CACHE_TTL) {
    return cache[name].value;
  }

  try {
    const command = new GetParameterCommand({ Name: name });
    const response = await client.send(command);
    const value = response.Parameter?.Value || '';

    // Cache the value
    cache[name] = { value, timestamp: now };

    return value;
  } catch (error) {
    console.error(`Failed to fetch SSM parameter ${name}:`, error);
    return '';
  }
}

export async function getSuperUsers(): Promise<string[]> {
  try {
    // In test/local environments, use environment variable fallback
    if (process.env.SUPER_USERS) {
      return process.env.SUPER_USERS
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean);
    }

    const stage = process.env.STAGE || 'staging';
    const paramName = `/evidence-api/${stage}/super-users`;
    const value = await getSSMParameter(paramName);

    return value
      ? value
          .split(',')
          .map((email) => email.trim())
          .filter(Boolean)
      : [];
  } catch (error) {
    console.warn('Failed to fetch super users, returning empty array:', error);
    return [];
  }
}

export async function getIsSuperUserDeleteEnabled(): Promise<boolean> {
  try {
    // In test/local environments, use environment variable fallback
    if (process.env.IS_SUPER_USER_DELETE_ENABLED !== undefined) {
      return process.env.IS_SUPER_USER_DELETE_ENABLED === 'true';
    }

    const stage = process.env.STAGE || 'staging';
    const paramName = `/evidence-api/${stage}/is-super-user-delete-enabled`;
    const value = await getSSMParameter(paramName);

    return value === 'true';
  } catch (error) {
    console.warn('Failed to fetch delete enabled flag, returning false:', error);
    return false;
  }
}
