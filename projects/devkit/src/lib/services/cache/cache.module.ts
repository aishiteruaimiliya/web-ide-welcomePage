import { NgModule, ModuleWithProviders } from '@angular/core';
import { CacheLocalStorage } from './services/storage/localstorage/cache.localstorage.service';
import { CacheMemoryStorage } from './services/storage/memory/cache.memory.service';
import { CacheSessionStorage } from './services/storage/sessionstorage/cache.sessionstorage.service';
import { CacheService } from './services/cache.service';

@NgModule({
  declarations: []
})
export class CacheModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CacheModule,
      providers: [
        CacheLocalStorage,
        CacheMemoryStorage,
        CacheSessionStorage,
        CacheService
      ]
    };
  }
}
