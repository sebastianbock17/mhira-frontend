import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../@services/assessment.service';
// import { planAssessmentForm } from '@app/pages/assessment/@forms/plan-assessment.form';
import { NzMessageService } from 'ng-zorro-antd';
// import { Subject, Subscription } from 'rxjs';
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import { AssessmentService } from '@app/pages/assessment/@services/assessment.service';
// import { Questionnaire } from '@app/pages/assessment/@types/questionnaire';
// import { PatientsService } from '@app/pages/patients-management/@services/patients.service';
// import { Router, ActivatedRoute } from '@angular/router';
// import { Assessment } from '@app/pages/assessment/@types/assessment';
// import { environment } from '@env/environment';
// import { AppPermissionsService } from '@shared/services/app-permissions.service';
// import { CaseManagersService } from '@app/pages/patients-management/@services/case-managers.service';
// import { PermissionKey } from '@app/@shared/@types/permission';
import { QuestionnaireVersion } from '../../questionnaire-management/@types/questionnaire';
import { User } from '@app/pages/user-management/@types/user';
import { Patient } from '@app/pages/patients-management/@types/patient';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// const CryptoJS = require('crypto-js');

@Component({
  selector: 'app-plan-assessment',
  templateUrl: './plan-assessment.component.html',
  styleUrls: ['./plan-assessment.component.scss'],
})
export class PlanAssessmentComponent implements OnInit {
  public selectedQuestionnaires: QuestionnaireVersion[] = [];

  public asessmentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private assessmentService: AssessmentService,
    private nzMessage: NzMessageService
  ) {}

  public ngOnInit(): void {
    this.asessmentForm = this.formBuilder.group({
      name: [null, Validators.required],
      informant: [null, Validators.required],
      patientId: [null, Validators.required],
      clinicianId: [null, Validators.required],
    });
  }

  public onSubmitAssessment() {
    if (this.asessmentForm.invalid) return;

    this.assessmentService
      .createMongoAssessment({
        ...this.asessmentForm.value,
        questionnaires: this.selectedQuestionnaires.map((q) => q._id),
      })
      .subscribe(
        () => {
          this.nzMessage.success('Assessment created', { nzDuration: 3000 });
          this.asessmentForm.reset();
        },
        (err) => {
          this.nzMessage.error(`Unable to create assessment - ${err.message}`, { nzDuration: 5000 });
          console.error(err);
        }
      );
  }

  public onUserSelect(user: User) {
    this.asessmentForm.patchValue({ clinicianId: user.id });
  }

  public onPatientSelect(patient: Patient) {
    this.asessmentForm.patchValue({ patientId: patient.id });
  }

  // PK = PermissionKey;
  // modalIsVisible = false;
  // modalIsLoading = false;
  // isLoading = false;
  // loadingMessage = '';
  // inputMode = false;
  // questionnaires: Questionnaire[];
  // addedQuestionnaires: Questionnaire[] = [];
  // planAssessmentForm = planAssessmentForm;
  // selectedPatientId: number;
  // assessment: Assessment;
  // showCancelButton = false;

  // public questionnaireSearch = new Subject<string>();
  // private questionnaireSearchSubscription: Subscription;

  // constructor(
  //   private assessmentService: AssessmentService,
  //   private patientService: PatientsService,
  //   private caseManagersService: CaseManagersService,
  //   private message: NzMessageService,
  //   private modal: NzModalService,
  //   private router: Router,
  //   private activatedRoute: ActivatedRoute,
  //   public perms: AppPermissionsService
  // ) {
  //   this.questionnaireSearchSubscription = this.questionnaireSearch
  //     .pipe(debounceTime(400), distinctUntilChanged())
  //     .subscribe((value) => {
  //       this.searchQuestionnaires(value);
  //     });
  // }

  // ngOnInit(): void {}

  // getCaseManagerServiceProperty(property: any, params?: any) {
  //   return this.caseManagersService[property](params);
  // }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.getAssessment();
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.questionnaireSearch.unsubscribe();
  // }

  // getAssessment() {
  //   this.activatedRoute.queryParams.subscribe((params) => {
  //     if (params.assessment) {
  //       this.inputMode = false;
  //       this.showCancelButton = true;
  //       const bytes = CryptoJS.AES.decrypt(params.assessment, environment.secretKey);
  //       this.assessment = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  //       if (this.assessment.date) {
  //         this.assessment.date = this.assessment.date.slice(0, 10);
  //       }
  //       this.planAssessmentForm.groups.map((group) => {
  //         group.fields.map((field) => {
  //           field.value = this.assessment[field.name];
  //           let options: any[] = [];
  //           switch (field.name) {
  //             case 'patientId':
  //               options = [
  //                 {
  //                   value: this.assessment.patient.id,
  //                   label: `${this.assessment.patient.firstName} ${this.assessment.patient.lastName}`,
  //                 },
  //               ];
  //               break;
  //             case 'clinicianId':
  //               options = [
  //                 {
  //                   value: this.assessment.clinician.id,
  //                   label: `${this.assessment.clinician.firstName} ${this.assessment.clinician.lastName}`,
  //                 },
  //               ];
  //               break;
  //             case 'informantId':
  //               options = [
  //                 {
  //                   value: this.assessment.clinician.id,
  //                   label: `${this.assessment.clinician.firstName} ${this.assessment.clinician.lastName}`,
  //                 },
  //               ];
  //               break;
  //           }
  //           if (field.options !== undefined) {
  //             field.options = options;
  //           }
  //           this.planAssessmentForm.submitButtonText = `Update Assessment`;
  //         });
  //       });
  //     } else {
  //       this.inputMode = true;
  //       this.showCancelButton = false;
  //       this.planAssessmentForm.groups.map((group) => {
  //         group.fields.map((field) => {
  //           field.value = null;
  //         });
  //       });
  //     }
  //   });
  // }

  // handleSearchOptions(search: any) {
  //   switch (search.field.name) {
  //     case 'patientId':
  //       this.searchPatient(search.keyword);
  //       break;
  //     case 'clinicianId':
  //       this.searchManager('clinician', search.keyword);
  //       break;
  //     case 'informantId':
  //       this.searchManager('informant', search.keyword);
  //       break;
  //   }
  // }

  // handleCancel() {
  //   this.questionnaires = [];
  //   this.modalIsVisible = false;
  // }

  // handleAddQuestionaire(): void {
  //   this.modalIsVisible = true;
  // }

  // handleInputChange(input: any) {
  //   switch (input.name) {
  //     case 'patientId':
  //       this.selectedPatientId = input.value;
  //       this.planAssessmentForm.groups[0].fields[2].value = null;
  //       this.planAssessmentForm.groups[0].fields[2].options = [];
  //       this.planAssessmentForm.groups[0].fields[3].value = null;
  //       this.planAssessmentForm.groups[0].fields[3].options = [];
  //       break;
  //   }
  // }

  // searchQuestionnaires(keyword: string) {
  //   this.isLoading = true;
  //   this.questionnaires = [];
  //   this.assessmentService.getQuestionnaires({ filter: { name: keyword } }).subscribe(
  //     async ({ data }) => {
  //       data.getQuestionnaires.edges.map((questionnaire: any) => {
  //         this.questionnaires.push(questionnaire.node);
  //       });
  //       this.isLoading = false;
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //     }
  //   );
  // }

  // searchPatient(keyword: string) {
  //   const options: { label: string; value: number }[] = [];
  //   this.patientService.patients({ filter: { firstName: { iLike: keyword } } }).subscribe(
  //     async ({ data }) => {
  //       data.patients.edges.map((patient: any) => {
  //         const option = { value: patient.node.id, label: `${patient.node.firstName} ${patient.node.lastName}` };
  //         if (options.indexOf(option) === -1) {
  //           options.push(option);
  //         }
  //       });
  //       this.planAssessmentForm.groups[0].fields[1].options = options;
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //     }
  //   );
  // }

  // searchManager(managerType: string, keyword: string) {
  //   const options: { label: string; value: number }[] = [];
  //   const query = managerType === 'clinician' ? 'getPatientCaseManagers' : 'getPatientInformants';
  //   if (!this.selectedPatientId) {
  //     this.modal.error({
  //       nzTitle: 'Operation Failed!!',
  //       nzContent: 'please select patient first',
  //     });
  //     return;
  //   }
  //   this.getCaseManagerServiceProperty(query, {
  //     patientId: this.selectedPatientId,
  //     searchKeyword: keyword,
  //   }).subscribe(
  //     async ({ data }: any) => {
  //       data[query].edges.map((manager: any) => {
  //         const option = { value: manager.node.id, label: `${manager.node.firstName} ${manager.node.lastName}` };
  //         if (options.indexOf(option) === -1) {
  //           options.push(option);
  //         }
  //       });
  //       switch (managerType) {
  //         case 'clinician':
  //           this.planAssessmentForm.groups[0].fields[2].options = options;
  //           break;
  //         case 'informant':
  //           this.planAssessmentForm.groups[0].fields[3].options = options;
  //           break;
  //       }
  //     },
  //     (error: any) => {
  //       this.isLoading = false;
  //     }
  //   );
  // }

  // selectQuestionnaire(questionnaire: Questionnaire) {
  //   if (this.addedQuestionnaires.indexOf(questionnaire) === -1) {
  //     this.addedQuestionnaires.push(questionnaire);
  //   }
  // }

  // removeAddedQuestionnaires(index: number) {
  //   this.addedQuestionnaires.splice(index, 1);
  // }

  // submitForm(form: any) {
  //   this.isLoading = true;
  //   this.loadingMessage = 'creating an assessment';
  //   form.questionnaires = this.addedQuestionnaires;
  //   if (this.assessment.id) {
  //     form.id = this.assessment.id;
  //     this.assessmentService.updateAssessment(form).subscribe(
  //       async ({ data }) => {
  //         this.isLoading = false;
  //         this.loadingMessage = '';
  //         this.message.create('success', `assessment has been successfully updated`);
  //       },
  //       (error) => {
  //         this.isLoading = false;
  //         this.loadingMessage = '';
  //         this.message.error('Could not update an assessment');
  //       }
  //     );
  //     return;
  //   }
  //   if (this.addedQuestionnaires.length === 0) {
  //     this.modal.error({
  //       nzTitle: 'Cannot create a plan',
  //       nzContent: 'please add at least one questionnaire',
  //     });
  //     return;
  //   }
  //   this.assessmentService.planAssessment(form).subscribe(
  //     async ({ data }) => {
  //       this.isLoading = false;
  //       this.loadingMessage = '';
  //       this.router.navigate(['/mhira/assessments']);
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       this.loadingMessage = '';
  //       console.log(error);
  //     }
  //   );
  // }
}
