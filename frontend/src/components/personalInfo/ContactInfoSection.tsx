import { Form, Input } from 'antd';

import { Employee } from '../../utils/type';
import React from 'react';

interface ContactInfoSectionProps {
  employee: Employee;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  employee,
  isEditing,
  onChange,
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
            <Input
              onChange={(e) => onChange('phone.cellPhone', e.target.value)}
            />
          </Form.Item>
          <Form.Item name='workPhone' label='Work Phone'>
            <Input
              onChange={(e) => onChange('phone.workPhone', e.target.value)}
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
