import { 
  ResourceRelationship, 
  createResourcesRelationship, 
  ResourceRelationshipCardinality, 
  CoreResourceType,
  ContextPolicy_ObjectMode,
  CoreResourceOperation,
} from "@wildo-ai/saas-models";

import { initZodDecorators } from '@wildo-ai/zod-decorators';
initZodDecorators();

/**
 * Custom Resource Relationships
 * 
 * Define relationships between your custom resources and core resources.
 * 
 * ## Context Policy Configuration
 * 
 * Use `contextPolicy` to control how related resources are fetched:
 * 
 * ### Pattern 1: SECURITY - Never fetch (credentials, secrets, API keys)
 * ```typescript
 * contextPolicy: { enabled: false }
 * ```
 * 
 * ### Pattern 2: ID ONLY - Reference only, no data fetch (self-references)
 * ```typescript
 * contextPolicy: { objectMode: ContextPolicy_ObjectMode.ID_ONLY, depth: 1 }
 * ```
 * 
 * ### Pattern 3: READ DETAIL - Full on READ, summary otherwise (1:1 profiles)
 * ```typescript
 * contextPolicy: {
 *   objectMode: ContextPolicy_ObjectMode.SUMMARY,
 *   operationOverrides: {
 *     [CoreResourceOperation.READ]: { objectMode: ContextPolicy_ObjectMode.FULL }
 *   }
 * }
 * ```
 * 
 * ### Pattern 4: PERFORMANCE - Disable on LIST/SEARCH (high-cardinality 1:N)
 * ```typescript
 * contextPolicy: {
 *   operationOverrides: {
 *     [CoreResourceOperation.LIST]: { enabled: false },
 *     SEARCH: { enabled: false }
 *   }
 * }
 * ```
 * 
 * ### Pattern 5: DEFAULT - Standard summary behavior
 * ```typescript
 * contextPolicy: {} // or omit entirely
 * ```
 * 
 * ## Foreign Key Field
 * 
 * Use `foreignKeyField` for disambiguation when multiple FKs point to same type:
 * ```typescript
 * foreignKeyField: 'assignedToUserId'  // vs 'createdByUserId'
 * ```
 */
export const customShared_ResourcesRelationships: ResourceRelationship[] = [
  // Example:
  // createResourcesRelationship(
  //   CoreResourceType.ORGANIZATIONS, CustomShared_ResourceType.MY_RESOURCE, 
  //   ResourceRelationshipCardinality.ONE, ResourceRelationshipCardinality.MANY,
  //   { 
  //     isPrimaryScope: true,
  //     // Use contextPolicy to control context fetching behavior
  //     contextPolicy: {} // Default: enabled=true, depth=1, objectMode=SUMMARY
  //   }
  // ),
];
