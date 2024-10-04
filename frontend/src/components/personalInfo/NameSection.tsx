import { Form, Input } from 'antd';

import { Employee } from '../../utils/type';
import React from 'react';

interface NameSectionProps {
  employee: Employee;
  isEditing: boolean;
}

const NameSection: React.FC<NameSectionProps> = ({ employee, isEditing }) => {
  const [form] = Form.useForm();

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
          <Form.Item name='firstName' label='First Name'>
            <Input />
          </Form.Item>
          <Form.Item name='lastName' label='Last Name'>
            <Input />
          </Form.Item>
          <Form.Item name='middleName' label='Middle Name'>
            <Input />
          </Form.Item>
          <Form.Item name='preferredName' label='Preferred Name'>
            <Input />
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
            <strong>Middle Name:</strong> {employee.middleName || 'N/A'}
          </p>
          <p>
            <strong>Preferred Name:</strong> {employee.preferredName || 'N/A'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NameSection;
