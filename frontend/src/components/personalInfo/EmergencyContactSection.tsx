import { Form, Input } from 'antd';

import { Employee } from '../../utils/type';
import React from 'react';

interface EmergencyContactSectionProps {
  employee: Employee;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
}

const EmergencyContactSection: React.FC<EmergencyContactSectionProps> = ({
  employee,
  isEditing,
  onChange,
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
                <Input
                  onChange={(e) =>
                    onChange(
                      `emergencyContacts[${index}].firstName`,
                      e.target.value
                    )
                  }
                />
              </Form.Item>
              <Form.Item name='lastName' label='Last Name'>
                <Input
                  onChange={(e) =>
                    onChange(
                      `emergencyContacts[${index}].lastName`,
                      e.target.value
                    )
                  }
                />
              </Form.Item>
              <Form.Item name='middleName' label='Middle Name'>
                <Input
                  onChange={(e) =>
                    onChange(
                      `emergencyContacts[${index}].middleName`,
                      e.target.value
                    )
                  }
                />
              </Form.Item>
              <Form.Item name='phone' label='Phone'>
                <Input
                  onChange={(e) =>
                    onChange(
                      `emergencyContacts[${index}].phone`,
                      e.target.value
                    )
                  }
                />
              </Form.Item>
              <Form.Item name='email' label='Email'>
                <Input
                  onChange={(e) =>
                    onChange(
                      `emergencyContacts[${index}].email`,
                      e.target.value
                    )
                  }
                />
              </Form.Item>
              <Form.Item name='relationship' label='Relationship'>
                <Input
                  onChange={(e) =>
                    onChange(
                      `emergencyContacts[${index}].relationship`,
                      e.target.value
                    )
                  }
                />
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
                <strong>Middle Name:</strong> {contact.middleName || ''}
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
