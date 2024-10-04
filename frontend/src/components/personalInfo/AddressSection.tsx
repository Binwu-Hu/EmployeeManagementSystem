import { Form, Input } from 'antd';

import { Employee } from '../../utils/type';
import React from 'react';

interface AddressSectionProps {
  employee: Employee;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  employee,
  isEditing,
  onChange,
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
            <Input
              onChange={(e) => onChange('address.building', e.target.value)}
            />
          </Form.Item>
          <Form.Item name='street' label='Street'>
            <Input
              onChange={(e) => onChange('address.street', e.target.value)}
            />
          </Form.Item>
          <Form.Item name='city' label='City'>
            <Input onChange={(e) => onChange('address.city', e.target.value)} />
          </Form.Item>
          <Form.Item name='state' label='State'>
            <Input
              onChange={(e) => onChange('address.state', e.target.value)}
            />
          </Form.Item>
          <Form.Item name='zip' label='Zip'>
            <Input onChange={(e) => onChange('address.zip', e.target.value)} />
          </Form.Item>
        </Form>
      ) : (
        <div>
          <p>
            <strong>Building:</strong> {employee.address?.building || ''}
          </p>
          <p>
            <strong>Street:</strong> {employee.address?.street || ''}
          </p>
          <p>
            <strong>City:</strong> {employee.address?.city || ''}
          </p>
          <p>
            <strong>State:</strong> {employee.address?.state || ''}
          </p>
          <p>
            <strong>Zip:</strong> {employee.address?.zip || ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressSection;
