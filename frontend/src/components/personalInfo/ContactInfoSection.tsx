import { Form, Input } from 'antd';

import { AppDispatch } from '../../app/store';
import { Employee } from '../../utils/type';
import React from 'react';
import { updateEmployeeField } from '../../features/employee/employeeSlice';
import { useDispatch } from 'react-redux';

interface ContactInfoSectionProps {
  employee: Employee;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
  form: any;
  unchangeable: boolean;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  employee,
  isEditing,
  onChange,
  form,
  unchangeable,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleFieldChange = (field: string, value: any) => {
    onChange(field, value);

    const fieldParts = field.split('.');
    dispatch(updateEmployeeField({ field: fieldParts, value }));
  };

  return (
    <div className='bg-white p-4 rounded shadow-md'>
      <h2 className='text-xl font-semibold'>Contact Info</h2>
      {isEditing ? (
        <Form
          form={form}
          layout='vertical'
          initialValues={{
            cellPhone: employee.phone?.cellPhone,
            workPhone: employee.phone?.workPhone,
          }}
        >
          <Form.Item
            name='cellPhone'
            label='Cell Phone'
            rules={[
              { required: true, message: 'Cell phone is required' },
              {
                pattern: /^[0-9]{10,15}$/,
                message: 'Please enter a valid phone number (10-15 digits)',
              },
            ]}
          >
            <Input
              disabled={unchangeable}
              onChange={
                (e) => handleFieldChange('phone.cellPhone', e.target.value)
                // onChange('phone.cellPhone', e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            name='workPhone'
            label='Work Phone'
            rules={[
              {
                pattern: /^[0-9]{10,15}$/,
                message:
                  'Please enter a valid work phone number (10-15 digits)',
              },
            ]}
          >
            <Input
              disabled={unchangeable}
              onChange={
                (e) => handleFieldChange('phone.workPhone', e.target.value)
                // onChange('phone.workPhone', e.target.value)
              }
            />
          </Form.Item>
        </Form>
      ) : (
        <div>
          <p>
            <strong>Cell Phone:</strong> {employee.phone?.cellPhone || ''}
          </p>
          <p>
            <strong>Work Phone:</strong> {employee.phone?.workPhone || ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactInfoSection;
