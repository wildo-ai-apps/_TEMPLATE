import { ResourceRelationship } from "@wildo-ai/saas-models";

import { initZodDecorators } from '@wildo-ai/saas-models';
initZodDecorators();

// Empty relationships array - add your custom resource relationships here
export const customShared_ResourcesRelationships: ResourceRelationship[] = [
  // Example:
  // createResourcesRelationship(
  //   CoreResourceType.ORGANIZATIONS, CustomShared_ResourceType.MY_RESOURCE, 
  //   ResourceRelationshipCardinality.ONE, ResourceRelationshipCardinality.MANY,
  //   { isPrimaryScope: true }
  // ),
];
