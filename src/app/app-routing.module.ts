import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HorizontalLayoutComponent } from '@app/@layout/horizontal/horizontal.layout.component';
import { AuthLayoutComponent } from '@app/@layout/auth/auth.layout.component';
import { VerticalLayoutComponent } from '@app/@layout/vertical/vertical.layout.component';
import { AuthGuard } from '@app/auth/auth.guard';

const appRoutes: Routes = [
  {
    path: 'assessment',
    component: HorizontalLayoutComponent,
    loadChildren: () => import('./questionnaire/questionnaire.module').then((m) => m.QuestionnaireModule),
  },
  {
    path: 'mhira',
    canActivate: [AuthGuard],
    component: VerticalLayoutComponent,
    loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    redirectTo: 'mhira',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'app',
  },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, config)],
  exports: [RouterModule],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
  ],
})
export class AppRoutingModule {}
