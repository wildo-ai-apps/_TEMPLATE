import { RolesConfiguration, ResourcePrimaryScope } from "@wildo-ai/saas-models";

export const CUSTOM_ROLES_CONFIGURATION: RolesConfiguration = {
  'CUSTOM_APP_MANAGER': {
    role: 'CUSTOM_APP_MANAGER',
    inheritFrom: 'APP_ADMIN_USER',
    isSystemRole: false,
    relatedPrimaryScope: ResourcePrimaryScope.APPLICATION
  },
  'CUSTOM_ORG_SUPERVISOR': {
    role: 'CUSTOM_ORG_SUPERVISOR', 
    inheritFrom: 'ORG_MANAGER',
    isSystemRole: false,
    relatedPrimaryScope: ResourcePrimaryScope.ORGANIZATIONS
  }
};

