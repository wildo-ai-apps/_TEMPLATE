import { FlowActorSystem_InitializationFactoryMap } from "@wildo-ai/saas-backend-lib";
import { FlowsActors_Agent } from "@wildo-ai/saas-models";

// Export with consistent naming convention matching resources registry pattern
export const customBackend_FlowsActorsRegistry: {
  flowActorSystemsFactoryMap: FlowActorSystem_InitializationFactoryMap;
  agents: FlowsActors_Agent[];
} = {
  flowActorSystemsFactoryMap: {},
  agents: [],
};

