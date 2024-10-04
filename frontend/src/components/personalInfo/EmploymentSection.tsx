import { DatePicker, Form, Input } from 'antd';

import { Employee } from '../../utils/type';
import React from 'react';
import moment from 'moment';

interface EmploymentSectionProps {
  employee: Employee;
  isEditing: boolean;
}

const EmploymentSection: React.FC<EmploymentSectionProps> = ({
  employee,
  isEditing,
}) => {
  const [form] = Form.useForm();

  return (
    <div className='bg-white p-4 rounded shadow-md'>
      <h2 className='text-xl font-semibold'>Employment</h2>
      {isEditing ? (
        <Form
          form={form}
          layout='vertical'
          initialValues={{
            visaType: employee.workAuthorization?.visaType,
            startDate: employee.workAuthorization?.startDate
              ? moment(employee.workAuthorization.startDate)
              : undefined,
            endDate: employee.workAuthorization?.endDate
              ? moment(employee.workAuthorization.endDate)
              : undefined,
          }}
        >
          <Form.Item name='visaType' label='Visa Type'>
            <Input />
          </Form.Item>
          <Form.Item name='startDate' label='Start Date'>
            <DatePicker />
          </Form.Item>
          <Form.Item name='endDate' label='End Date'>
            <DatePicker />
          </Form.Item>
        </Form>
      ) : (
        <div>
          <p>
            <strong>Visa Type:</strong>{' '}
            {employee.workAuthorization?.visaType || 'N/A'}
          </p>
          <p>
            <strong>Start Date:</strong>{' '}
            {employee.workAuthorization?.startDate || 'N/A'}
          </p>
          <p>
            <strong>End Date:</strong>{' '}
            {employee.workAuthorization?.endDate || 'N/A'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmploymentSection;
