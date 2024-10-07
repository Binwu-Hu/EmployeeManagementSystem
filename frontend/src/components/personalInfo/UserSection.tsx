import { DatePicker, Form, Input, Radio } from 'antd';

import { AppDispatch } from '../../app/store';
import { Employee } from '../../utils/type';
import React from 'react';
import moment from 'moment';
import { updateEmployeeField } from '../../features/employee/employeeSlice';
import { useDispatch } from 'react-redux';

interface UserSectionProps {
  employee: Employee;
  onChange: (field: string, value: any) => void;
  form: any;
  unchangeable: boolean;
}

const UserSection: React.FC<UserSectionProps> = ({
  employee,
  onChange,
  form,
  unchangeable,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleFieldChange = (field: string, value: any) => {
    onChange(field, value);

    const fieldParts = field.split('.');
    dispatch(updateEmployeeField({ field: fieldParts, value }));
  };

  return (
    <div className='bg-white p-4 rounded shadow-md'>
      <h2 className='text-xl font-semibold'>Employee Info</h2>
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          ssn: employee.ssn,
          dateOfBirth: employee.dateOfBirth
            ? moment(employee.dateOfBirth)
            : null,
          gender: employee.gender,
          email: employee.email,
        }}
      >
        {/* Email Field */}
        <Form.Item
          name='email'
          label='Email'
          rules={[{ required: true, message: 'Email is required' }]}
        >
          <Input disabled={true} value={employee.email} />{' '}
          {/* Prefilled and disabled */}
        </Form.Item>

        {/* SSN Field */}
        <Form.Item
          name='ssn'
          label='SSN'
          rules={[{ required: true, message: 'SSN is required' }]}
        >
          <Input
            disabled={unchangeable}
            onChange={
              (e) => handleFieldChange('ssn', e.target.value)
              // onChange('ssn', e.target.value)
            }
          />
        </Form.Item>

        {/* Date of Birth Field */}
        <Form.Item
          name='dateOfBirth'
          label='Date of Birth'
          rules={[{ required: true, message: 'Date of Birth is required' }]}
        >
          <DatePicker
            disabled={unchangeable}
            onChange={
              (date) => handleFieldChange('dateOfBirth', date?.toISOString())
              // onChange('dateOfBirth', date?.toISOString())
            }
          />
        </Form.Item>

        {/* Gender Field */}
        <Form.Item
          name='gender'
          label='Gender'
          rules={[{ required: true, message: 'Gender is required' }]}
        >
          <Radio.Group
            disabled={unchangeable}
            onChange={(e) => 
                handleFieldChange('gender', e.target.value)
                // onChange('gender', e.target.value)
            }
          >
            <Radio value='male'>Male</Radio>
            <Radio value='female'>Female</Radio>
            <Radio value='i do not wish to answer'>
              I do not wish to answer
            </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserSection;
