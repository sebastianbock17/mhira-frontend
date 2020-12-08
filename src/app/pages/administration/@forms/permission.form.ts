import { Form } from '@shared/components/form/@types/form';

export const PermissionForm: Form = {
  submitButtonText: 'Create Permission',
  editButtonText: 'Edit Permission',
  submitButtonClass: 'full-width',
  groups: [
    {
      fields: [
        {
          value: '',
          name: 'name',
          title: 'Permission Name',
          label: 'Permission Name',
          description: 'enter permission name',
          type: 'text',
          validationMessage: 'please enter permission name',
          isRequired: true,
          span: 24,
          options: [],
        },
        {
          value: '',
          name: 'guard',
          title: 'Guard Name',
          label: 'Guard Name',
          description: 'enter guard name',
          type: 'text',
          validationMessage: 'please enter guard name',
          isRequired: true,
          span: 24,
          options: [],
        },
      ],
    },
  ],
};
