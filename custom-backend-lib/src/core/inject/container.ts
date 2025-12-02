import { Container } from 'inversify';


import { CUSTOM_BACKEND_SERVICE_TYPES } from './service-types';



export class CustomBackendContainer {
  private readonly container: Container;

  constructor(container?: Container) {
    this.container = container ?? new Container({ defaultScope: 'Singleton' });
    this.bindServices();
  }

  private bindServices(): void {
    
  }
}