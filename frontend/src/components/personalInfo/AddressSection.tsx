import { Form, Input } from 'antd';

import { Employee } from '../../utils/type';
import React from 'react';

interface AddressSectionProps {
  employee: Employee;
  isEditing: boolean;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  employee,
  isEditing,
}) => {
  const [form] = Form.useForm();

  return (
    <div className='bg-white p-4 rounded shadow-md'>
      <h2 className='text-xl font-semibold'>Address</h2>
      {isEditing ? (
        <Form
          form={form}
          layout='vertical'
          initialValues={{
            building: employee.address?.building,
            street: employee.address?.street,
            city: employee.address?.city,
            state: employee.address?.state,
            zip: employee.address?.zip,
          }}
        >
          <Form.Item name='building' label='Building'>
            <Input />
          </Form.Item>
          <Form.Item name='street' label='Street'>
            <Input />
          </Form.Item>
          <Form.Item name='city' label='City'>
            <Input />
          </Form.Item>
          <Form.Item name='state' label='State'>
            <Input />
          </Form.Item>
          <Form.Item name='zip' label='Zip'>
            <Input />
          </Form.Item>
        </Form>
      ) : (
        <div>
          <p>
            <strong>Building:</strong> {employee.address?.building || 'N/A'}
          </p>
          <p>
            <strong>Street:</strong> {employee.address?.street || 'N/A'}
          </p>
          <p>
            <strong>City:</strong> {employee.address?.city || 'N/A'}
          </p>
          <p>
            <strong>State:</strong> {employee.address?.state || 'N/A'}
          </p>
          <p>
            <strong>Zip:</strong> {employee.address?.zip || 'N/A'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressSection;
