/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Following methods are intendet to simplify testing with stores. You can achieve everything the regular way.
 * The philosophy is, that setup logic (arrange) can be completely done by each test case independently and that
 * the setup is as readable and easy to follow as possible. Note, that you could still share setup logic using those methods.
 *
 * As every store can have its own injector (store.config.injector) you can create a separate injection context
 * for every test case. This is especially handy if you are testing effect or query objects as you don't necessarily
 * need to use Testbed or jest.mock (or any other mocking lib) to setup a mocked DI Context + mocked dependencies.
 * But you could also use this for independent services, register them in the stores injector and using the method getFromStoreInjector to get an instance
 */
import { Injector, ProviderToken, StaticProvider } from '@angular/core';
import { Store } from 'signalstory';

/**
 * Interface for specifying providers in the mocked Dependency Injection (DI) context.
 */
export interface InjectionContextConfiguration {
  /**
   * Returns  array of {@link StaticProvider} objects representing the providers
   * included in the mocked DI context.
   */
  collectProviders(): StaticProvider[];

  /**
   * Adds a provider to the configuration.
   * This would represent a provider instance inside `TestBed.configureTestingModule({providers})`
   * @param provider - The provider to be added to the configuration.
   * @returns The current {@link InjectionContextConfiguration} instance for method chaining.
   */
  add(provider: StaticProvider): InjectionContextConfiguration;

  /**
   * Adds a regular provider to the configuration based on the provided class type.
   * This Corresponds to `<StaticProvider>{ provide: MyService }` without specifying further dependencies or factories
   * @param classType - The class type for the provider.
   * @returns The current {@link InjectionContextConfiguration} instance for method chaining.
   */
  addRegular<T>(classType: ProviderToken<T>): InjectionContextConfiguration;

  /**
   * Adds an existing instance as a provided value to the di providers based on the provided class type.
   * Injecting the provided classType in this context would always return the provided instance.
   * NOTE: This is not the same as useExisting in the angular di provide configuration
   * @param classType - The class type for the provider.
   * @param instance - The existing instance to be used as the provider.
   * @returns The current {@link InjectionContextConfiguration} instance for method chaining.
   *
   * @example
   * ```typescript
   * const myInstance = new MyService();
   * myInjectionContextConfiguration.addExisting(MyService, myInstance);
   * ```
   */
  addExisting<T>(
    classType: ProviderToken<T>,
    instance: T
  ): InjectionContextConfiguration;

  /**
   * Adds a mocked provider to the configuration based on the provided class type.
   * This technique is intendet to mock specific methods or properties of a given service, not the whole functionality.
   * Injection will bypass the constructor and using the configureInstance mocks for properties and methods can be applied
   *
   * @param classType - The class type for the provider.
   * @param configureInstance - A function to configure the mocked instance.
   * @returns The current {@link InjectionContextConfiguration} instance for method chaining.
   */
  addMocked<T>(
    classType: ProviderToken<T>,
    configureInstance: (obj: T) => void
  ): InjectionContextConfiguration;
}

/**
 * Configures a mocked Dependency Injection (DI) context for a specific store, allowing
 * the injection of mocked dependencies during testing. This has no sideefffects for other injection contexts (e.g. root)
 * Only the injection context for the given store is created and configured using this method
 *
 * @param store - The SignalStory store for which the injection context is being configured.
 * @param configure - A callback function that receives an {@link InjectionContextConfiguration} object
 *   for specifying providers in the injection context.
 *
 * @example
 * ```typescript
 * configureInjectionContext(myStore, (config) => {
 *   config.addRegular(MyService);
 *   config.addMocked(OtherService, (instance) => {
 *     instance.methodToMock = jest.fn(() => 'mocked result');
 *   });
 * });
 * ```
 */
export function configureInjectionContext(
  store: Store<any>,
  configure: (options: InjectionContextConfiguration) => void
): void {
  const options = new DefaultInjectionContextConfiguration();
  configure(options);
  (store.config.injector as any) = Injector.create({
    providers: options.collectProviders(),
  });
}

/**
 * Retrieves an instance of a specified type from the store's injector.
 *
 * @param store - The SignalStory store from which to retrieve the instance.
 * @param classType - The class type for the instance to be retrieved.
 * @returns The instance of the specified type if found; otherwise, `undefined`.
 */
export function getFromStoreInjector<T>(
  store: Store<any>,
  classType: ProviderToken<T>
): T | undefined {
  return store.config.injector?.get(classType);
}

/**
 * Default implementation of the {@link InjectionContextConfiguration} interface.
 *
 * @public
 */
export class DefaultInjectionContextConfiguration
  implements InjectionContextConfiguration
{
  private providers: StaticProvider[] = [];

  collectProviders(): StaticProvider[] {
    return this.providers;
  }

  add(provider: StaticProvider): InjectionContextConfiguration {
    this.providers.push(provider);
    return this;
  }

  addRegular<T>(classType: ProviderToken<T>): InjectionContextConfiguration {
    this.providers.push(<StaticProvider>{ provide: classType });
    return this;
  }

  addExisting<T>(
    classType: ProviderToken<T>,
    instance: T
  ): InjectionContextConfiguration {
    this.providers.push({
      provide: classType,
      useFactory: () => instance,
    });
    return this;
  }

  addMocked<T>(
    classType: ProviderToken<T>,
    configureInstance: (obj: T) => void
  ): InjectionContextConfiguration {
    this.providers.push({
      provide: classType,
      useFactory: () => {
        const instance = Object.create(classType);
        configureInstance(instance);
        return instance;
      },
    });
    return this;
  }
}
