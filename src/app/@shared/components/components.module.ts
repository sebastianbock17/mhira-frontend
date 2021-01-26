import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxInputSearchModule } from 'ngx-input-search';
import { XlsExportService } from '@shared/services/xls-export.service';
import { LoaderComponent } from './loader/loader.component';
import { TableComponent } from './table/table.component';
import { FormGeneratorComponent } from './form-generator/form-generator.component';
import {
  NzAffixModule,
  NzAlertModule,
  NzAnchorModule,
  NzAutocompleteModule,
  NzAvatarModule,
  NzBackTopModule,
  NzBadgeModule,
  NzBreadCrumbModule,
  NzButtonModule,
  NzCalendarModule,
  NzCardModule,
  NzCarouselModule,
  NzCascaderModule,
  NzCheckboxModule,
  NzCollapseModule,
  NzCommentModule,
  NzNoAnimationModule,
  NzTransButtonModule,
  NzWaveModule,
  NzDatePickerModule,
  NzDescriptionsModule,
  NzDividerModule,
  NzDrawerModule,
  NzDropDownModule,
  NzEmptyModule,
  NzFormModule,
  NzGridModule,
  NzI18nModule,
  NzIconModule,
  NzInputModule,
  NzInputNumberModule,
  NzLayoutModule,
  NzListModule,
  NzMentionModule,
  NzMenuModule,
  NzMessageModule,
  NzModalModule,
  NzNotificationModule,
  NzPageHeaderModule,
  NzPaginationModule,
  NzPopconfirmModule,
  NzPopoverModule,
  NzProgressModule,
  NzRadioModule,
  NzRateModule,
  NzResultModule,
  NzSelectModule,
  NzSkeletonModule,
  NzSliderModule,
  NzSpinModule,
  NzStatisticModule,
  NzStepsModule,
  NzSwitchModule,
  NzTableModule,
  NzTabsModule,
  NzTagModule,
  NzTimePickerModule,
  NzTimelineModule,
  NzToolTipModule,
  NzTransferModule,
  NzTreeModule,
  NzTreeSelectModule,
  NzTypographyModule,
  NzUploadModule,
} from 'ng-zorro-antd';

const antModules = [
  NzAffixModule,
  NzAlertModule,
  NzAnchorModule,
  NzAutocompleteModule,
  NzAvatarModule,
  NzBackTopModule,
  NzBadgeModule,
  NzButtonModule,
  NzBreadCrumbModule,
  NzCalendarModule,
  NzCardModule,
  NzCarouselModule,
  NzCascaderModule,
  NzCheckboxModule,
  NzCollapseModule,
  NzCommentModule,
  NzDatePickerModule,
  NzDescriptionsModule,
  NzDividerModule,
  NzDrawerModule,
  NzDropDownModule,
  NzEmptyModule,
  NzFormModule,
  NzGridModule,
  NzI18nModule,
  NzIconModule,
  NzInputModule,
  NzInputNumberModule,
  NzLayoutModule,
  NzListModule,
  NzMentionModule,
  NzMenuModule,
  NzMessageModule,
  NzModalModule,
  NzNoAnimationModule,
  NzNotificationModule,
  NzPageHeaderModule,
  NzPaginationModule,
  NzPopconfirmModule,
  NzPopoverModule,
  NzProgressModule,
  NzRadioModule,
  NzRateModule,
  NzResultModule,
  NzSelectModule,
  NzSkeletonModule,
  NzSliderModule,
  NzSpinModule,
  NzStatisticModule,
  NzStepsModule,
  NzSwitchModule,
  NzTableModule,
  NzTabsModule,
  NzTagModule,
  NzTimePickerModule,
  NzTimelineModule,
  NzToolTipModule,
  NzTransButtonModule,
  NzTransferModule,
  NzTreeModule,
  NzTreeSelectModule,
  NzTypographyModule,
  NzUploadModule,
  NzWaveModule,
];

import {
  CapitalizePipe,
  DatePipe,
  IconFilterPipe,
  NoSanitizePipe,
  NumberWithCommasPipe,
  PluralPipe,
  RoundPipe,
  SearchPipe,
  TimingPipe,
} from '../pipes';
import { CustomFilterComponent } from './custom-filter/custom-filter.component';
import { AppFormModule } from '@shared/components/form/app-form.module';

const PIPES = [
  CapitalizePipe,
  IconFilterPipe,
  NoSanitizePipe,
  NumberWithCommasPipe,
  PluralPipe,
  RoundPipe,
  SearchPipe,
  TimingPipe,
  DatePipe,
];

@NgModule({
  imports: [...antModules, CommonModule, FormsModule, AppFormModule, NgxInputSearchModule, ReactiveFormsModule],
  declarations: [...PIPES, LoaderComponent, TableComponent, FormGeneratorComponent, CustomFilterComponent],
  exports: [...PIPES, LoaderComponent, TableComponent, FormGeneratorComponent, CustomFilterComponent],
  providers: [XlsExportService],
})
export class ComponentsModule {}
