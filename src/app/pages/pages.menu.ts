import { SideNavInterface } from '@app/@layout/vertical/side-nav.type';
import { extract } from '@app/i18n';

export const MENU: SideNavInterface[] = [
  {
    path: 'case-management',
    title: extract('Case Management'),
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'home',
    permissions: ['view patients'],
    submenu: [
      {
        path: 'case-management/patients',
        title: extract('Patient list'),
        iconType: '',
        iconTheme: '',
        permissions: ['view patients', 'manage patients'],
        submenu: [],
      },
      {
        path: 'case-management/case-managers',
        title: extract('Case Managers'),
        permissions: ['view patients', 'manage patients'],
        iconType: '',
        iconTheme: '',
        submenu: [],
      },
      {
        path: 'case-management/informants',
        title: extract('Informants'),
        permissions: ['view patients', 'manage patients'],
        iconType: '',
        iconTheme: '',
        submenu: [],
      },
    ],
  },
  {
    path: 'assessments',
    title: extract('Assessments'),
    permissions: ['view assessments'],
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'edit',
    submenu: [
      {
        path: 'assessments/plan-assessments',
        title: extract('Plan assessment'),
        permissions: ['manage assessments'],
        iconType: '',
        iconTheme: '',
        submenu: [],
      },
      {
        path: 'assessments',
        title: extract('Planned Assessments'),
        permissions: ['view assessments'],
        iconType: '',
        iconTheme: '',
        submenu: [],
      },
    ],
  },
  {
    path: 'reports',
    title: extract('Reports'),
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'file-text',
    submenu: [
      {
        path: 'reports',
        title: extract('All Reports'),
        iconType: '',
        iconTheme: '',
        submenu: [],
      },
    ],
  },
  {
    path: 'user-management',
    title: extract('User Management'),
    permissions: ['view users', 'manage users'],
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'user',
    submenu: [
      {
        path: 'user-management/users',
        title: extract('List users'),
        permissions: ['manage users'],
        iconType: '',
        iconTheme: '',
        submenu: [],
      },
      {
        path: 'user-management/user-form',
        title: extract('New user'),
        permissions: ['manage users'],
        iconType: '',
        iconTheme: '',
        submenu: [],
      },
    ],
  },
  {
    path: 'administration',
    title: extract('Administration'),
    permissions: ['manage roles', 'manage settings', 'manage departments'],
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'setting',
    submenu: [
      {
        path: 'administration/permission-matrix',
        title: extract('Permission Matrix'),
        permissions: ['view roles'],
        iconType: '',
        iconTheme: '',
        submenu: [],
      },
      {
        path: 'administration/permissions',
        title: extract('Permissions'),
        permissions: ['view roles'],
        iconType: '',
        iconTheme: '',
        submenu: [],
      },
      {
        path: 'administration/roles',
        title: extract('Roles'),
        permissions: ['manage roles'],
        iconType: '',
        iconTheme: '',
        submenu: [],
      },
      {
        path: 'administration/departments',
        title: extract('Departments'),
        permissions: ['manage departments'],
        iconType: '',
        iconTheme: '',
        icon: '',
        submenu: [],
      },
      {
        path: 'administration/settings',
        title: extract('Settings'),
        permissions: ['manage settings'],
        iconType: '',
        iconTheme: '',
        submenu: [
          {
            path: 'administration/settings/system-configuration',
            title: extract('System Configuration'),
            permissions: ['manage settings'],
            iconType: '',
            iconTheme: '',
            submenu: [],
          },
          {
            path: 'administration/settings/patient-statuses',
            title: extract('Patient Statuses'),
            permissions: ['manage settings'],
            iconType: '',
            iconTheme: '',
            submenu: [],
          },
        ],
      },
    ],
  },
  {
    path: 'feedback',
    title: extract('Feedback'),
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'message',
    submenu: [],
  },
];
