import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';

import { Employee } from '../../utils/type';

interface NameSectionProps {
  employee: Employee;
}

const NameSection: React.FC<NameSectionProps> = ({ employee }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    // Logic for saving the updated values
    message.success('Changes saved');
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
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
          onFinish={onFinish}
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
          <div className='flex justify-end space-x-2'>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type='primary' htmlType='submit'>
              Save
            </Button>
          </div>
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
            <strong>Middle Name:</strong> {employee.middleName}
          </p>
          <p>
            <strong>Preferred Name:</strong> {employee.preferredName}
          </p>
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        </div>
      )}
    </div>
  );
};

export default NameSection;
