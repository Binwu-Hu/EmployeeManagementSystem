import { Form, Input } from 'antd';

import { AppDispatch } from '../../app/store';
import { Employee } from '../../utils/type';
import React from 'react';
import { updateEmployeeField } from '../../features/employee/employeeSlice';
import { useDispatch } from 'react-redux';

interface NameSectionProps {
  employee: Employee;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
  form: any;
  unchangeable: boolean;
}

const NameSection: React.FC<NameSectionProps> = ({
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
      <h2 className='text-xl font-semibold'>Name</h2>
      {isEditing ? (
        <Form
          form={form}
          layout='vertical'
          initialValues={{
            firstName: employee.firstName,
            lastName: employee.lastName,
            middleName: employee.middleName,
            preferredName: employee.preferredName,
          }}
        >
          <Form.Item
            name='firstName'
            label='First Name'
            rules={[{ required: true, message: 'First Name is required' }]}
          >
            <Input
              disabled={unchangeable}
              onChange={(e) =>
                handleFieldChange('firstName', e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            name='lastName'
            label='Last Name'
            rules={[{ required: true, message: 'Last Name is required' }]}
          >
            <Input
              disabled={unchangeable}
              onChange={
                (e) => handleFieldChange('lastName', e.target.value)
              }
            />
          </Form.Item>
          <Form.Item name='middleName' label='Middle Name'>
            <Input
              disabled={unchangeable}
              onChange={(e) => onChange('middleName', e.target.value)}
            />
          </Form.Item>
          <Form.Item name='preferredName' label='Preferred Name'>
            <Input
              disabled={unchangeable}
              onChange={(e) => onChange('preferredName', e.target.value)}
            />
          </Form.Item>
        </Form>
      ) : (
        <div>
          <p>
            <strong>First Name:</strong> {employee.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {employee.lastName}
          </p>
          <p>
            <strong>Middle Name:</strong> {employee.middleName || ''}
          </p>
          <p>
            <strong>Preferred Name:</strong> {employee.preferredName || ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default NameSection;
