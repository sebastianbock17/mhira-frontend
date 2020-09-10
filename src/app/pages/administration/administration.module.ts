import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { AdministrationComponent } from './administration.component';
import { AdministrationRoutingModule } from './administration-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { RolesAndPermissionsComponent } from './roles-and-permissions/roles-and-permissions.component';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, AdministrationRoutingModule],
  declarations: [AdministrationComponent, UserManagementComponent, RolesAndPermissionsComponent],
})
export class AdministrationModule {}