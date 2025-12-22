import { RolesConfiguration, ResourcePrimaryScope, CORE_APP_ROLES, CORE_ORG_ROLES } from "@wildo-ai/saas-models";

export const CUSTOM_ROLES_CONFIGURATION: RolesConfiguration = {
  'CUSTOM_APP_MANAGER': {
    role: 'CUSTOM_APP_MANAGER',
    inheritFrom: CORE_APP_ROLES.APP_USER,
    isSystemRole: false,
    relatedPrimaryScope: ResourcePrimaryScope.APPLICATION
  },
  'CUSTOM_ORG_SUPERVISOR': {
    role: 'CUSTOM_ORG_SUPERVISOR', 
    inheritFrom: CORE_ORG_ROLES.ORG_MANAGER,
    isSystemRole: false,
    relatedPrimaryScope: ResourcePrimaryScope.ORGANIZATIONS
  }
};

