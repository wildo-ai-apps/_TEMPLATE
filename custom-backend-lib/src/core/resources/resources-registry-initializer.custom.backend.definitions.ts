import { ResourceRegistry_InitializerParameters } from "@wildo-ai/saas-models";
import { customBackend_ResourcesConfigurationsFactoryMap } from "./resources-operations.custom.backend.definitions";
import { customBackend_ResourceFieldIdentifier, CustomBackend_ResourceType } from "./resources-types.custom.backend.schemas";
import { customBackend_ResourcesRelationships } from "./resources-relationships.custom.backend.definitions";
import { CustomShared_ResourceType } from "@wildo-ai/custom-shared-lib";





export const customBackend_ResourcesRegistryInitializer: ResourceRegistry_InitializerParameters<CustomBackend_ResourceType> = {
  resourceRelationships: customBackend_ResourcesRelationships,
  resourceConfigurationsFactoryMap: customBackend_ResourcesConfigurationsFactoryMap,
  resourceFieldIdentifiers: customBackend_ResourceFieldIdentifier,
}