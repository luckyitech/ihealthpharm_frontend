import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { claimTabSlot, showTabLimitNotice } from './app/core/tabs/tab-limit';

if (environment.production) {
  enableProdMode();
}

if (claimTabSlot()) {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err =>{});
} else {
  showTabLimitNotice();
}