import { initZodDecorators } from '@wildo-ai/saas-models';
initZodDecorators();

import { ResourceConfiguration_InitializationFactoryMap } from '@wildo-ai/saas-models';
import { CustomShared_ResourceType } from './resources-types.custom.shared.schemas';

// Custom resource configurations factory map
// Add your resource configuration factories here
// Note: Using Partial to allow empty objects when no custom resources are defined yet
export const customShared_ResourcesConfigurationsFactoryMap: Partial<ResourceConfiguration_InitializationFactoryMap<CustomShared_ResourceType>> = {
  // Add your real resource configurations here:
  // [CustomShared_ResourceType.MY_RESOURCE]: myResource_ResourceConfiguration_InitializationFactory,
};
