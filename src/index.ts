// Zenoti SDK entry point

// Test imports with path alias (@)
import { greet, VERSION } from '@/utils';
import type { User, Status } from '@/types';

// Test imports without .js extension
import { greet as greetUtil } from './utils';
import type { User as UserType } from './types';

// Re-export for SDK consumers
export { greet, VERSION };
export type { User, Status };

// Example usage (for testing)
console.log(greet('Zenoti SDK'));
console.log('Version:', VERSION);
