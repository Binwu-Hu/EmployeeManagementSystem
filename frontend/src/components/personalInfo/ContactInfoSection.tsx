import { Form, Input } from 'antd';

import { Employee } from '../../utils/type';
import React from 'react';

interface ContactInfoSectionProps {
  employee: Employee;
  isEditing: boolean;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  employee,
  isEditing,
}) => {
  const [form] = Form.useForm();

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
          <Form.Item name='cellPhone' label='Cell Phone'>
            <Input />
          </Form.Item>
          <Form.Item name='workPhone' label='Work Phone'>
            <Input />
          </Form.Item>
        </Form>
      ) : (
        <div>
          <p>
            <strong>Cell Phone:</strong> {employee.phone?.cellPhone || 'N/A'}
          </p>
          <p>
            <strong>Work Phone:</strong> {employee.phone?.workPhone || 'N/A'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactInfoSection;
