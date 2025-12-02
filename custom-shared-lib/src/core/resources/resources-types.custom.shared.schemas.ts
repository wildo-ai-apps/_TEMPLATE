/**
 * App-Custom Shared Resource Types
 * 
 * Shared resource type definitions for custom application.
 * Add your custom resource types here.
 */

// Custom resource types - add your types here
// Note: At least one value is needed for TypeScript compatibility
export enum CustomShared_ResourceType {
  // Placeholder - remove when you add your first real resource
  _PLACEHOLDER = '_placeholder',
  // Example: MY_RESOURCE = 'myResource',
}

// Map of resource types to their primary field identifiers
export const CustomShared_ResourceFieldIdentifier: { [key in CustomShared_ResourceType]?: string } = {
  // Placeholder entry - remove when you add your first real resource
  [CustomShared_ResourceType._PLACEHOLDER]: '_placeholderId',
  // Example: [CustomShared_ResourceType.MY_RESOURCE]: 'myResourceId',
};
