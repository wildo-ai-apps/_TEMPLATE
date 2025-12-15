// Initialize Zod decorators early (lazy init will also happen on first use)
import { initZodDecorators } from '@wildo-ai/zod-decorators';
initZodDecorators();

export * from './core/resources/resources-types.custom.backend.schemas';
export * from './core/resources/resources-relationships.custom.backend.definitions';
export * from './core/resources/resources-operations.custom.backend.definitions';
export * from './core/resources/resources-registry-initializer.custom.backend.definitions';
export * from './core/base-classes/manual-controllers.custom.backend.definition';
export * from './core/inject/container';
export * from './core/inject/service-types';

// Custom flows-actors
export * from './flows-actors/flows-actors.default.definition.schemas';
// Custom i18n labels
export * from './core/i18n/labels/labels.en';
