import { Form, Input } from 'antd';

import { Employee } from '../../utils/type';
import React from 'react';

interface EmergencyContactSectionProps {
  employee: Employee;
  isEditing: boolean;
}

const EmergencyContactSection: React.FC<EmergencyContactSectionProps> = ({
  employee,
  isEditing,
}) => {
  const [form] = Form.useForm();

  return (
    <div className='bg-white p-4 rounded shadow-md'>
      <h2 className='text-xl font-semibold'>Emergency Contacts</h2>
      {employee.emergencyContacts?.map((contact, index) => (
        <div key={index}>
          {isEditing ? (
            <Form
              form={form}
              layout='vertical'
              initialValues={{
                firstName: contact.firstName,
                lastName: contact.lastName,
                middleName: contact.middleName,
                phone: contact.phone,
                email: contact.email,
                relationship: contact.relationship,
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
              <Form.Item name='phone' label='Phone'>
                <Input />
              </Form.Item>
              <Form.Item name='email' label='Email'>
                <Input />
              </Form.Item>
              <Form.Item name='relationship' label='Relationship'>
                <Input />
              </Form.Item>
            </Form>
          ) : (
            <div>
              <p>
                <strong>First Name:</strong> {contact.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {contact.lastName}
              </p>
              <p>
                <strong>Middle Name:</strong> {contact.middleName || 'N/A'}
              </p>
              <p>
                <strong>Phone:</strong> {contact.phone}
              </p>
              <p>
                <strong>Email:</strong> {contact.email}
              </p>
              <p>
                <strong>Relationship:</strong> {contact.relationship}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmergencyContactSection;
