// Initialize Zod decorators early (lazy init will also happen on first use)
import { initZodDecorators } from '@wildo-ai/zod-decorators';
initZodDecorators();

// Custom resources
export * from './core/resources/resources-types.custom.shared.schemas';
export * from './core/resources/resources-relationships.custom.shared.definitions';
export * from './core/resources/resources-operations.custom.shared.definitions';

// Custom security
export * from './security/authorizations/roles.custom.shared.definitions';
