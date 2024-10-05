import { Button, Form, Input } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { Employee } from '../../utils/type';
import React from 'react';

interface EmergencyContactSectionProps {
  employee: Employee;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
  form: any;
}

const EmergencyContactSection: React.FC<EmergencyContactSectionProps> = ({
  employee,
  isEditing,
  onChange,
  form,
}) => {
  return (
    <div className='bg-white p-4 rounded shadow-md'>
      <h2 className='text-xl font-semibold'>
        Reference and Emergency Contacts
      </h2>

      {/* Reference Section */}
      <h3 className='text-lg font-semibold mt-4'>Reference</h3>
      {isEditing ? (
        <Form
          form={form}
          layout='vertical'
          initialValues={{
            referenceFirstName: employee.reference?.firstName || '',
            referenceLastName: employee.reference?.lastName || '',
            referenceMiddleName: employee.reference?.middleName || '',
            referencePhone: employee.reference?.phone || '',
            referenceEmail: employee.reference?.email || '',
            referenceRelationship: employee.reference?.relationship || '',
            emergencyContacts: employee.emergencyContacts || [],
          }}
        >
          {/* Reference Inputs */}
          <Form.Item
            name='referenceFirstName'
            label='First Name'
            rules={[{ required: true, message: 'First Name is required' }]}
          >
            <Input
              onChange={(e) => onChange('reference.firstName', e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name='referenceLastName'
            label='Last Name'
            rules={[{ required: true, message: 'Last Name is required' }]}
          >
            <Input
              onChange={(e) => onChange('reference.lastName', e.target.value)}
            />
          </Form.Item>
          <Form.Item name='referenceMiddleName' label='Middle Name'>
            <Input
              onChange={(e) => onChange('reference.middleName', e.target.value)}
            />
          </Form.Item>
          <Form.Item name='referencePhone' label='Phone'>
            <Input
              onChange={(e) => onChange('reference.phone', e.target.value)}
            />
          </Form.Item>
          <Form.Item name='referenceEmail' label='Email'>
            <Input
              onChange={(e) => onChange('reference.email', e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name='referenceRelationship'
            label='Relationship'
            rules={[{ required: true, message: 'Relationship is required' }]}
          >
            <Input
              onChange={(e) =>
                onChange('reference.relationship', e.target.value)
              }
            />
          </Form.Item>

          {/* Emergency Contacts Section */}
          <h3 className='text-lg font-semibold mt-4'>Emergency Contacts</h3>
          <Form.List name='emergencyContacts'>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div key={index} style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'firstName']}
                      label='First Name'
                      rules={[
                        { required: true, message: 'First Name is required' },
                      ]}
                    >
                      <Input
                        onChange={(e) =>
                          onChange(
                            `emergencyContacts[${index}].firstName`,
                            e.target.value
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'lastName']}
                      label='Last Name'
                      rules={[
                        { required: true, message: 'Last Name is required' },
                      ]}
                    >
                      <Input
                        onChange={(e) =>
                          onChange(
                            `emergencyContacts[${index}].lastName`,
                            e.target.value
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'middleName']}
                      label='Middle Name'
                    >
                      <Input
                        onChange={(e) =>
                          onChange(
                            `emergencyContacts[${index}].middleName`,
                            e.target.value
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'phone']}
                      label='Phone'
                    >
                      <Input
                        onChange={(e) =>
                          onChange(
                            `emergencyContacts[${index}].phone`,
                            e.target.value
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'email']}
                      label='Email'
                    >
                      <Input
                        onChange={(e) =>
                          onChange(
                            `emergencyContacts[${index}].email`,
                            e.target.value
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'relationship']}
                      label='Relationship'
                      rules={[
                        { required: true, message: 'Relationship is required' },
                      ]}
                    >
                      <Input
                        onChange={(e) =>
                          onChange(
                            `emergencyContacts[${index}].relationship`,
                            e.target.value
                          )
                        }
                      />
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => remove(field.name)}
                      style={{ marginLeft: 8, marginTop: 40 }}
                    />
                  </div>
                ))}

                <Form.Item>
                  <Button
                    type='dashed'
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add Emergency Contact
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      ) : (
        <div>
          {employee.emergencyContacts?.length > 0 ? (
            employee.emergencyContacts.map((contact, index) => (
              <div key={index} style={{ marginBottom: 16 }}>
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
            ))
          ) : (
            <p>No emergency contacts available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmergencyContactSection;
