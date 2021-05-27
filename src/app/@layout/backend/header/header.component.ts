import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { User } from '@app/pages/user-management/@types/user';
import { Form } from '@shared/components/form/@types/form';
import { userForms } from '@app/pages/user-management/@forms/user.form';
import { UserChangePasswordInput } from '@app/pages/user-management/user-form/user-update-password.type';
import { NzMessageService } from 'ng-zorro-antd';
import { UsersService } from '@app/pages/user-management/@services/users.service';
import { FormComponent } from '@shared/components/form/form.component';
import { FieldGroup } from '@shared/components/form/@types/field.group';
import { TranslationItem } from '@shared/@types/translation';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from '../../../@shared/services/error-handler.service';

const CryptoJS = require('crypto-js');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild(FormComponent) child: FormComponent;
  isOkLoading = false;
  user: User;
  translationList: TranslationItem[] = [
    { name: 'English', code: 'en' },
    { name: 'Germany', code: 'de' },
    { name: 'Swahili', code: 'sw' },
  ];
  changePasswordModal = false;
  loadingMessage = '';
  changePasswordForm: Form = userForms.changeUserPassword;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService,
    private message: NzMessageService,
    private errorService: ErrorHandlerService,
    private translationService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.translationService.setDefaultLang('en');
    this.getStoredLang();
  }

  getUser() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.authService.getUserProfile().subscribe(
      ({ data }) => {
        this.user = data.getUserProfile;
        localStorage.setItem('user', JSON.stringify(data.getUserProfile));
      },
      (err) => this.errorService.handleError(err, { prefix: 'Unable to get user profile' })
    );
  }

  getStoredLang() {
    const lang = localStorage.getItem('currentLang');

    if (lang) {
      this.translationService.use(lang);
    }
  }

  clickChangePassword() {
    this.child.handleSubmitForm(this.changePasswordForm);
  }
  onChangeTranslation(item: TranslationItem) {
    localStorage.setItem('currentLang', item.code);
    this.translationService.use(item.code);
  }

  editUserProfile() {
    const dataString = CryptoJS.AES.encrypt(JSON.stringify(this.user), environment.secretKey).toString();
    this.router.navigate(['/mhira/user-management/user-form'], {
      state: {
        title: `${this.user.firstName} ${this.user.lastName}`,
      },
      queryParams: {
        user: dataString,
      },
    });
  }

  changePassword(form: any) {
    if (this.user.id) {
      this.isLoading = true;
      this.loadingMessage = `Updating user ${this.user.firstName} ${this.user.lastName}`;
      const inputs: UserChangePasswordInput = {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        newPasswordConfirmation: form.newPasswordConfirmation,
      };
      this.usersService.changeUserPassword(inputs).subscribe(
        () => {
          this.isLoading = false;
          this.loadingMessage = '';
          this.message.success('Password has successfully been changed');
          this.handleCancel();
        },
        (error) => {
          this.isLoading = false;
          this.loadingMessage = '';
          this.errorService.handleError(error, { prefix: 'Unable to change password' });
        }
      );
    }
  }

  logout() {
    this.authService.logout().subscribe(
      async ({ data }) => {
        this.isOkLoading = false;
        const items = ['auth_app_token', 'user', 'settings', 'tabs', 'activeTabIndex', 'permissions'];
        for (const item of items) {
          localStorage.removeItem(item);
        }
        this.router.navigate(['/auth/login']);
      },
      (error) => {
        this.isOkLoading = false;
      }
    );
  }

  handleCancel() {
    this.changePasswordModal = false;
    this.changePasswordForm.groups.forEach((group: FieldGroup) => {
      group.fields.find((field) => {
        field.value = null;
      });
    });
  }

  showChangePasswordModal() {
    this.changePasswordModal = true;
  }
}