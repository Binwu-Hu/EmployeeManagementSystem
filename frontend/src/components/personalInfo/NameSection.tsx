import { Form, Input } from 'antd';

import { Employee } from '../../utils/type';
import React from 'react';

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
              onChange={(e) => onChange('firstName', e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name='lastName'
            label='Last Name'
            rules={[{ required: true, message: 'Last Name is required' }]}
          >
            <Input
              disabled={unchangeable}
              onChange={(e) => onChange('lastName', e.target.value)}
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
