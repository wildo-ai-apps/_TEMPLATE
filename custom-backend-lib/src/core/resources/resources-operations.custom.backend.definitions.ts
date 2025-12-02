import { ResourceConfiguration_InitializationFactoryMap } from '@wildo-ai/saas-models';
import { ResourceCustomServiceImplementationFactory } from '@wildo-ai/saas-backend-lib';
import { CustomBackend_ResourceType } from './resources-types.custom.backend.schemas';

// Empty factory map - add your custom backend resource configurations here
export const customBackend_ResourcesConfigurationsFactoryMap: ResourceConfiguration_InitializationFactoryMap<CustomBackend_ResourceType> = undefined;

// Empty service implementations array - add your custom service implementations here
export const customBackend_ServiceImplementationsFactories: ResourceCustomServiceImplementationFactory[] = [
  // Example:
  // myResourceCreateCustomImpl,
  // myResourceUpdateCustomImpl,
];
