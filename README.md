# App-Custom Example

## Overview

This example demonstrates the production-ready structure for creating custom applications within the Wildo.ai platform. The architecture allows end-users to update and customize libraries while maintaining security and execution control over main applications.

## Architecture Principles

- **Library Flexibility**: End-users can update and customize libraries (`libs/`)
- **Application Control**: Main applications (`apps/`) remain under platform control for security
- **Modular Design**: Clear separation between runnable applications and reusable libraries  
- **Framework Integration**: Seamless access to core Wildo.ai framework libraries

## Directory Structure

```
apps-custom/example/
├── apps/                           # Runnable Applications (Platform Controlled)
│   ├── app-custom-backend-api/            # Express API
│   ├── app-custom-frontend-admin-app/     # React Admin Interface  
│   ├── app-custom-frontend-b2c-app/       # React B2C Application
│   ├── app-custom-frontend-main-app/      # React Main Application
│   ├── app-custom-health-checker-api/     # Express Health API
│   ├── app-custom-technical-doc-app/      # Docusaurus Documentation
│   └── app-custom-website/                # Astro Website
├── libs/                           # Customizable Libraries (User Controlled)
│   ├── app-custom-backend-lib/            # Node.js Backend Library
│   ├── app-custom-frontend-common-lib/    # React Common Components
│   ├── app-custom-frontend-admin-lib/     # React Admin Components
│   ├── app-custom-frontend-b2c-lib/       # React B2C Components
│   ├── app-custom-frontend-main-lib/      # React Main Components
│   ├── app-custom-models/                 # TypeScript Models (Universal)
│   ├── app-custom-technical-doc-lib/      # Docusaurus Components
│   └── app-custom-website-lib/            # Astro Components
├── app-custom-lifecycle-management-api/   # Lifecycle Management API ((must be able to import all libraries, including)
└── README.md                       # This file
wildo-ai
├── saas-app-lifecycle-lib/      # Lifecycle Management API Lib (must be able to import all libs, frontend, and backend)
├── saas-backend-lib/            # Node.js Backend Library
├── saas-models                  # TypeScript Models (Universal)
└── saas-frontend-lib/           # React Shared Components
```

## Dependencies Graph

### Runnable Applications

#### `app-custom-lifecycle-management-api` (Express API)
```
Dependencies:
├── libs/app-custom-backend-lib
├── libs/app-custom-frontend-common-lib
├── libs/app-custom-frontend-admin-lib
├── libs/app-custom-frontend-b2c-lib
├── libs/app-custom-frontend-main-lib
├── libs/app-custom-models
├── libs/app-custom-technical-doc-lib
├── libs/app-custom-website-lib
├── apps/app-custom-backend-api
├── ../../wildo-ai/saas-app-lifecycle-lib
├── ../../wildo-ai/saas-backend-lib
└── ../../wildo-ai/saas-models
```

#### `apps/app-custom-backend-api` (Express API)
```
Dependencies:
├── libs/app-custom-backend-lib
├── libs/app-custom-models
├── ../../wildo-ai/saas-app-lifecycle-lib
├── ../../wildo-ai/saas-backend-lib
└── ../../wildo-ai/saas-models
```

#### `apps/app-custom-frontend-admin-app` (React App)
```
Dependencies:
├── libs/app-custom-frontend-admin-lib
├── libs/app-custom-frontend-common-lib
├── libs/app-custom-models
├── ../../wildo-ai/saas-frontend-lib
└── ../../wildo-ai/saas-models
```

#### `apps/app-custom-frontend-b2c-app` (React App)
```
Dependencies:
├── libs/app-custom-frontend-b2c-lib
├── libs/app-custom-frontend-common-lib
├── libs/app-custom-models
├── ../../wildo-ai/saas-frontend-lib
└── ../../wildo-ai/saas-models
```

#### `apps/app-custom-frontend-main-app` (React App)
```
Dependencies:
├── libs/app-custom-frontend-main-lib
├── libs/app-custom-frontend-common-lib
├── libs/app-custom-models
├── ../../wildo-ai/saas-frontend-lib
└── ../../wildo-ai/saas-models
```

#### `apps/app-custom-health-checker-api` (Express API)
```
Dependencies:
├── libs/app-custom-models
├── ../../wildo-ai/saas-backend-lib
└── ../../wildo-ai/saas-models
```

#### `apps/app-custom-technical-doc-app` (Docusaurus)
```
Dependencies:
├── libs/app-custom-models
├── libs/app-custom-technical-doc-lib
└── ../../wildo-ai/saas-models
```

#### `apps/app-custom-website` (Astro)
```
Dependencies:
├── libs/app-custom-models
├── libs/app-custom-website-lib
└── ../../wildo-ai/saas-models
```

### Customizable Libraries

#### `libs/app-custom-backend-lib` (Node.js Library)
```
Dependencies:
├── libs/app-custom-models
├── ../../wildo-ai/saas-backend-lib
└── ../../wildo-ai/saas-models
```

#### `libs/app-custom-frontend-common-lib` (React Library)
```
Dependencies:
├── libs/app-custom-models
├── ../../wildo-ai/saas-frontend-lib
└── ../../wildo-ai/saas-models
```

#### `libs/app-custom-frontend-admin-lib` (React Library)
```
Dependencies:
├── libs/app-custom-frontend-common-lib
├── libs/app-custom-models
├── ../../wildo-ai/saas-frontend-lib
└── ../../wildo-ai/saas-models
```

#### `libs/app-custom-frontend-b2c-lib` (React Library)
```
Dependencies:
├── libs/app-custom-frontend-common-lib
├── libs/app-custom-models
├── ../../wildo-ai/saas-frontend-lib
└── ../../wildo-ai/saas-models
```

#### `libs/app-custom-frontend-main-lib` (React Library)
```
Dependencies:
├── libs/app-custom-frontend-common-lib
├── libs/app-custom-models
├── ../../wildo-ai/saas-frontend-lib
└── ../../wildo-ai/saas-models
```

#### `libs/app-custom-models` (TypeScript Models)
```
Dependencies:
└── ../../wildo-ai/saas-models
```

#### `libs/app-custom-technical-doc-lib` (Docusaurus Library)
```
Dependencies:
├── libs/app-custom-models
└── ../../wildo-ai/saas-models
```

#### `libs/app-custom-website-lib` (Astro Library)
```
Dependencies:
├── libs/app-custom-models
└── ../../wildo-ai/saas-models
```

## Framework Libraries Access

The example has access to core Wildo.ai framework libraries via relative paths:

#### `../../wildo-ai/saas-app-lifecycle-lib` (Application Lifecycle)
```
Dependencies:
├── ../../wildo-ai/saas-backend-lib
├── ../../wildo-ai/saas-frontend-lib
└── ../../wildo-ai/saas-models
```

#### `../../wildo-ai/saas-backend-lib` (Backend Framework)
```
Dependencies:
└── ../../wildo-ai/saas-models
```

#### `../../wildo-ai/saas-frontend-lib` (Frontend Framework)
```
Dependencies:
└── ../../wildo-ai/saas-models
```

#### `../../wildo-ai/saas-models` (Core Models)
```
Dependencies: (none - base library)
```

## Package Types

### Runnable Applications (Platform Controlled)
- `app-custom-lifecycle-management-api`: Express-based lifecycle management API
- `apps/app-custom-backend-api`: Express-based main backend API
- `apps/app-custom-frontend-admin-app`: React-based admin interface
- `apps/app-custom-frontend-b2c-app`: React-based B2C application
- `apps/app-custom-frontend-main-app`: React-based main application
- `apps/app-custom-health-checker-api`: Express-based health monitoring API
- `apps/app-custom-technical-doc-app`: Docusaurus-based documentation site
- `apps/app-custom-website`: Astro-based marketing website

### Customizable Libraries (User Controlled)
- `libs/app-custom-backend-lib`: Node.js library for backend functionality
- `libs/app-custom-frontend-common-lib`: React library for common UI components
- `libs/app-custom-frontend-admin-lib`: React library for admin-specific components
- `libs/app-custom-frontend-b2c-lib`: React library for B2C-specific components
- `libs/app-custom-frontend-main-lib`: React library for main app components
- `libs/app-custom-models`: TypeScript models (universal frontend/backend compatibility)
- `libs/app-custom-technical-doc-lib`: Docusaurus library for documentation components
- `libs/app-custom-website-lib`: Astro library for website components

### Core Framework Libraries (Platform Managed)
- `../../wildo-ai/saas-app-lifecycle-lib`: Application lifecycle management
- `../../wildo-ai/saas-backend-lib`: Core backend framework
- `../../wildo-ai/saas-frontend-lib`: Core frontend framework  
- `../../wildo-ai/saas-models`: Core platform models

## Security Model

- **Apps Control**: Main applications remain under platform control to ensure security, updates, and proper execution
- **Library Flexibility**: Libraries can be customized by end-users to meet specific business requirements
- **Framework Isolation**: Core framework libraries are managed by the platform and accessed via well-defined interfaces
- **Dependency Management**: Clear dependency graph prevents circular dependencies and ensures proper build order

## Development Workflow

1. **Customize Libraries**: Modify `libs/` packages to implement custom business logic
2. **Extend Models**: Add custom models in `libs/app-custom-models/`
3. **Framework Integration**: Leverage core framework libraries for platform features
4. **Application Integration**: Applications automatically inherit library customizations
5. **Platform Security**: Applications remain secure and maintainable under platform control

## Deployment Strategy

- **Library Deployment**: Libraries are packaged and versioned independently
- **Application Deployment**: Applications are deployed and managed by the platform
- **Framework Updates**: Framework libraries are updated by the platform
- **Lifecycle Management**: The lifecycle management API orchestrates deployments and updates