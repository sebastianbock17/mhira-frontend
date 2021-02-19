import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userForms } from '@app/pages/user-management/@forms/user.form';
import { Form } from '@shared/components/form/@types/form';
import { TopTabsDataService } from '@shared/services/tabs-data.service';
import { CreateOneUserInput, CreateUserInput, UpdateOneUserInput, User } from '@app/pages/user-management/@types/user';
import { UsersService } from '@app/pages/user-management/@services/users.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '@env/environment';
import { UserUpdatePasswordInput } from './user-update-password.type';
import { Sorting } from '@shared/@types/sorting';
import { Paging } from '@shared/@types/paging';
import { Filter } from '@shared/@types/filter';
import { RolesService } from '@app/pages/administration/@services/roles.service';
import { Convert } from '@shared/classes/convert';
import { Role } from '@app/pages/administration/@types/role';
import { DepartmentsService } from '@app/pages/administration/@services/departments.service';
import { Department } from '@app/pages/administration/@types/department';
import { ModalType } from '@app/pages/user-management/users-list/modal.type';
import { FormComponent } from '@shared/components/form/form.component';
import { AppPermissionsService } from '@shared/services/app-permissions.service';
import { NzModalService } from 'ng-zorro-antd';
import { UserModel } from '@app/pages/user-management/@models/user.model';
import { PermissionKey } from '@app/@shared/@types/permission';

const CryptoJS = require('crypto-js');
const moment = require('moment');

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @ViewChild(FormComponent) _child: FormComponent;
  PK = PermissionKey;
  user: User;
  isLoading = false;
  showModal = false;
  populateForm = false;
  resetForm = false;
  modalType: ModalType;
  updatePasswordForm: Form = userForms.updateUserPassword;
  changePasswordModal: ModalType = {
    title: 'Change Password',
    type: 'changePassword',
  };
  newMode = false;
  loadingMessage = '';
  profileFields: Form = userForms.userProfileEdit;
  userRolesPermissionsFields: Form = userForms.userRolesPermissions;
  updateUserPasswordFields: Form = userForms.updateUserPassword;
  tabSub: any;
  routeSub: any;
  tabIndexSub: any;
  inputMode = true;
  showCancelButton = false;
  roles: Role[] = [];
  departments: Department[] = [];
  selectedRoles: number[] = [];
  unselectedRoles: number[] = [];
  selectedDepartments: number[] = [];
  unselectedDepartments: number[];
  currentUser: User;

  get userTitle(): string {
    const name = [this.user?.firstName, this.user?.middleName, this.user?.lastName].filter((s) => !!s).join(' ');
    return [this.user?.workID, name].filter((s) => !!s).join(' - ');
  }

  constructor(
    private modalService: NzModalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tabsDataService: TopTabsDataService,
    private usersService: UsersService,
    private message: NzMessageService,
    private rolesService: RolesService,
    public perms: AppPermissionsService,
    private departmentsService: DepartmentsService
  ) {}

  ngOnInit(): void {
    this.getUserFromUrl();
    this.getUser();
    this.getRoles();
    this.getDepartments();
  }

  getDepartments(params?: { paging?: Paging; filter?: Filter; sorting?: Sorting }) {
    this.isLoading = true;
    this.departmentsService.departments(params).subscribe(
      async ({ data }: any) => {
        const page = data.departments;
        page.edges.map((departmentData: any) => {
          const _department = Convert.toDepartment(departmentData.node);
          this.departments.push(_department);
        });

        this.profileFields.groups.map((group) => {
          group.fields.map((field) => {
            if (field.name === 'departmentId') {
              field.options = page.edges.map((departmentData: any) => {
                const department: Department = departmentData.node;
                this.departments.push(department);
                return {
                  value: department.id,
                  label: `${department.name}`,
                };
              });
            }
          });
        });
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
      }
    );
  }

  getUser() {
    this.currentUser = JSON.parse(localStorage.getItem('user')) as User;
  }

  clickChangePassword() {
    this._child.handleSubmitForm(this.updatePasswordForm);
  }

  showChangePasswordForm() {
    this.showModal = true;
    this.modalType = Object.assign({}, this.changePasswordModal);
    this.modalType.title = `${this.modalType.title} for ${this.user.username}: ${this.user.firstName} ${this.user.lastName}`;
  }

  getRoles(params?: { paging?: Paging; filter?: Filter; sorting?: Sorting }) {
    const options: any = [];
    this.roles = [];
    this.rolesService.roles(params).subscribe(
      async ({ data }: any) => {
        data.roles.edges.map((role: any) => {
          const _role = Convert.toRole(role.node);
          this.roles.push(_role);
          options.push({ label: _role.name, value: _role.id });
        });
        this.userRolesPermissionsFields.groups[0].fields[0].options = options;
        this.profileFields.groups.map((group) =>
          group.fields.map((field) => {
            if (field.name === 'roleId') field.options = options;
          })
        );
      },
      (error: any) => {}
    );
  }

  userHasRole(roleId: number): boolean {
    return this.user && this.user.roles && this.user.roles.map((role) => role.id).includes(roleId);
  }

  handleDeleteAction(user: User) {
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: `Are you sure you want to delete ${this.user.firstName} ${this.user.lastName}`,
      nzOkText: 'Delete',
      nzOnOk: () => this.deleteUser(user),
      nzCancelText: 'Cancel',
    });
  }

  deleteUser(user: User) {
    this.isLoading = true;
    this.usersService.deleteUser(user).subscribe(
      async (_) => {
        this.isLoading = false;
        this.router.navigate(['/mhira/user-management/users']);
      },
      (_) => {
        this.isLoading = false;
      }
    );
  }

  handleCancel() {
    this.updatePasswordForm.groups.map((group) => group.fields.map((field) => (field.value = '')));
    this.showModal = false;
  }

  userHasDepartment(departmentId: number): boolean {
    return this.user && this.user.departments && this.user.departments.map((dept) => dept.id).includes(departmentId);
  }

  collectRoles(roles: number[]) {
    const rolesIds: number[] = [];
    this.roles.map((role) => rolesIds.push(role.id));
    this.selectedRoles = roles;
    this.unselectedRoles = rolesIds.filter((id) => !this.selectedRoles.includes(id));
    for (const role of roles) {
      if (this.userHasRole(role)) this.selectedRoles.splice(this.selectedRoles.indexOf(role), role);
    }
  }

  collectDepartments(departments: number[]) {
    const departmentsIds: number[] = this.departments.map((department) => department.id);
    this.selectedDepartments = departments;
    this.unselectedDepartments = departmentsIds.filter((id) => !this.selectedDepartments.includes(id));
    this.submitDepartments();
  }

  async getUserFromUrl(): Promise<void> {
    this.routeSub = await this.activatedRoute.queryParams.subscribe((params) => {
      this.populateForm = false;
      this.resetForm = false;
      if (params.user) {
        this.inputMode = false;
        this.showCancelButton = true;
        const bytes = CryptoJS.AES.decrypt(params.user, environment.secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.user = decryptedData;
        if (this.user.birthDate) this.user.birthDate = decryptedData.birthDate.slice(0, 10);
        this.profileFields = userForms.userProfileEdit;
        this.populateForm = true;
      } else {
        this.user = {};
        this.resetForm = true;
        this.newMode = true;
        this.inputMode = true;
        this.profileFields = userForms.userProfile;
        this.showCancelButton = false;
      }
    });
  }

  onChangeUser() {
    this.tabIndexSub = this.tabsDataService.selectedIndex.subscribe((index) => {
      if (index !== -1) {
        this.tabSub = this.tabsDataService.tabs.subscribe((tabs) => {
          if (this.user) {
            tabs[index].title = `${this.user.firstName} ${this.user.lastName}`;
          } else {
            tabs[index].title = 'New User';
          }
        });
      }
    });
  }

  createUser(formData: any) {
    this.isLoading = true;
    this.populateForm = false;
    this.resetForm = false;
    if (formData.password !== formData.passwordConfirmation) {
      this.message.create('error', `Password don't match`);
      return;
    }
    formData.passwordConfirmation = undefined;
    const inputData: CreateUserInput = Object.assign({}, formData);
    const userInput: CreateOneUserInput = {
      user: inputData,
    };
    this.loadingMessage = `Creating user ${inputData.firstName} ${inputData.lastName}`;
    this.usersService.createUser(userInput).subscribe(
      async ({ data }) => {
        this._child.toggleEdit();
        this.isLoading = false;
        this.loadingMessage = '';
        this.message.create('success', `User has successfully been created`);

        this.user = UserModel.fromJson(data.createOneUser);
        if (this.selectedRoles.length > 0) {
          this.assignRoles();
        }
        if (this.selectedDepartments.length > 0) {
          this.assignDepartments();
        }
        this.afterCreate();
      },
      (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        const graphError = error.graphQLErrors.map((x: any) => x.message);
        this.onError(graphError);
      }
    );
  }

  updateUser(userUpdates: CreateUserInput) {
    const userInput: UpdateOneUserInput = {
      id: this.user.id,
      update: userUpdates,
    };
    this.isLoading = true;
    this.populateForm = false;
    this.resetForm = false;
    this.loadingMessage = `Updating user ${userUpdates.firstName} ${userUpdates.lastName}`;
    this.usersService.updateUser(userInput).subscribe(
      async ({ data }) => {
        this.user = UserModel.fromJson(data.updateOneUser);
        this.isLoading = false;
        this._child.toggleEdit();
        this.loadingMessage = '';
        this.message.create('success', `User has successfully been updated`);
      },
      (error) => {
        this.isLoading = false;
        this.populateForm = true;
        this.loadingMessage = '';
        const graphError = error.graphQLErrors.map((x: any) => x.message);
        this.onError(graphError);
      }
    );
  }

  submitRoles() {
    if (this.selectedRoles.length > 0) {
      this.assignRoles();
    }

    if (this.unselectedRoles.length > 0) {
      this.unassignRoles();
    }
  }

  submitDepartments() {
    if (this.selectedDepartments.length > 0) {
      this.assignDepartments();
    }

    if (this.selectedDepartments.length > 0) {
      this.unassignDepartment();
    }
  }

  afterCreate() {
    this.populateForm = false;
    this.resetForm = false;
    const dataString = CryptoJS.AES.encrypt(JSON.stringify(this.user), environment.secretKey).toString();
    this.router.navigate(['/mhira/user-management/user-form'], {
      state: {
        title: `${this.user.firstName} ${this.user.lastName}`,
      },
      queryParams: {
        user: dataString,
      },
    });
    this.newMode = false;
  }

  assignRoles(role?: Role) {
    this.isLoading = true;
    const rolesIds: number[] = role ? [role.id] : this.selectedRoles;
    this.rolesService.addRolesToUser(this.user.id, rolesIds).subscribe(
      async (_: any) => {
        this.isLoading = false;
        this.message.create('success', `the role(s) have been successful assigned to ${this.user.firstName}`);
      },
      (_: any) => {
        this.isLoading = false;
        this.message.create('error', `could not assign role(s) to ${this.user.firstName}`);
      }
    );
  }

  unassignRoles(role?: Role) {
    this.isLoading = true;
    const rolesIds: number[] = role ? [role.id] : this.unselectedRoles;
    this.rolesService.removeRolesFromUser(this.user.id, rolesIds).subscribe(
      async (_: any) => {
        this.isLoading = false;
        this.message.create('success', `the role(s) have been successful removed from ${this.user.firstName}`);
      },
      (_: any) => {
        this.isLoading = false;
        this.message.create('error', `could not remove role(s) to ${this.user.firstName}`);
      }
    );
  }

  assignRoleToUser(role: Role, checked: boolean) {
    if (checked) {
      this.assignRoles(role);
    } else {
      this.unassignRoles(role);
    }
  }

  assignDepartments(department?: Department) {
    this.isLoading = true;
    const departmentsIds: number[] = department ? [department.id] : this.selectedDepartments;
    this.departmentsService.addDepartmentsToUser(this.user.id, departmentsIds).subscribe(
      async (_: any) => {
        this.isLoading = false;
        this.message.create('success', `the department(s) have been successful assigned to ${this.user.firstName}`);
        this.user.departments.push(department);
      },
      (_: any) => {
        this.isLoading = false;
        this.message.create('error', `could not assign department(s) to ${this.user.firstName}`);
      }
    );
  }

  unassignDepartment(department?: Department) {
    this.isLoading = true;
    const departmentsIds: number[] = department ? [department.id] : this.unselectedDepartments;
    this.departmentsService.removeDepartmentsFromUser(this.user.id, departmentsIds).subscribe(
      async (_: any) => {
        this.isLoading = false;
        this.message.create('success', `the department(s) have been successful removed from ${this.user.firstName}`);
      },
      (_: any) => {
        this.isLoading = false;
        this.message.create('error', `could not remove department(s) to ${this.user.firstName}`);
      }
    );
  }

  assignDepartmentToUser(department: Department, checked: boolean) {
    if (checked) {
      this.assignDepartments(department);
    } else {
      this.unassignDepartment(department);
    }
  }

  submitForm(form: any): void {
    if (form.newPassword !== undefined) {
      this.updateUserPassword(form);
    } else {
      if (this.user.id != null) {
        this.updateUser(form);
      } else {
        if (form.password !== form.passwordConfirmation) {
          this.message.create('error', `Password does not match`);
        } else {
          if (form.roleId) {
            this.selectedRoles.push(form.roleId);
          }
          if (form.departmentId) {
            this.selectedDepartments.push(form.departmentId);
          }
          this.createUser(form);
        }
      }
    }
  }

  updateUserPassword(form: any) {
    if (this.user.id) {
      this.isLoading = true;
      this.loadingMessage = `Updating user ${this.user.firstName} ${this.user.lastName}`;
      const inputs: UserUpdatePasswordInput = {
        id: this.user.id,
        newPassword: form.newPassword,
        newPasswordConfirmation: form.newPasswordConfirmation,
      };
      this.usersService.updateUserPassword(inputs).subscribe(
        async (_) => {
          this.isLoading = false;
          this.loadingMessage = '';
          this.showModal = false;
          this.message.create('success', `Password has successfully been changed`);
          this.updatePasswordForm.groups.map((group) => {
            group.fields.map((field) => {
              field.value = '';
            });
          });
        },
        (error) => {
          this.isLoading = false;
          this.loadingMessage = '';
          const graphError = error.graphQLErrors.map((x: any) => x.message);
          this.onError(graphError);
        }
      );
    }
  }

  onError(errors: any) {
    if (errors.length > 0) {
      for (const error of errors) {
        this.message.create('error', `${error}`);
      }
    } else {
      this.message.create('error', `${errors.error.message}`);
    }
  }

  activateUser(user: User) {
    this.updateUser({ active: !user.active });
  }

  isCurrentUser(): boolean {
    return this.user?.id && this.currentUser?.id && this.user.id === this.currentUser.id;
  }
}
