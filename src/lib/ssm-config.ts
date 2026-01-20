import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const client = new SSMClient({ 
  region: process.env.AWS_REGION || 'eu-west-2' 
});

// Cache parameters for the lifetime of the Lambda container
// This reduces SSM API calls and improves performance
const cache: Record<string, { value: string; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getSSMParameter(name: string): Promise<string> {
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
  const stage = process.env.STAGE || 'staging';
  const paramName = `/evidence-api/${stage}/super-users`;
  const value = await getSSMParameter(paramName);
  
  return value
    ? value.split(',').map(email => email.trim()).filter(Boolean)
    : [];
}

export async function getIsSuperUserDeleteEnabled(): Promise<boolean> {
  const stage = process.env.STAGE || 'staging';
  const paramName = `/evidence-api/${stage}/is-super-user-delete-enabled`;
  const value = await getSSMParameter(paramName);
  
  return value === 'true';
}



