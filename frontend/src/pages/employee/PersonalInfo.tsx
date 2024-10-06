import { AppDispatch, RootState } from '../../app/store';
import { Button, Form, Layout, Menu, message } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
  clearEmployee,
  fetchEmployeeByUserId,
  updateEmployee,
} from '../../features/employee/employeeSlice';
import { useDispatch, useSelector } from 'react-redux';

import AddressSection from '../../components/personalInfo/AddressSection';
import ContactInfoSection from '../../components/personalInfo/ContactInfoSection';
import DocumentsSection from '../../components/personalInfo/DocumentsSection';
import EmergencyContactSection from '../../components/personalInfo/EmergencyContactSection';
import EmploymentSection from '../../components/personalInfo/EmploymentSection';
import { Link } from 'react-scroll';
import NameSection from '../../components/personalInfo/NameSection';

const { Sider, Content } = Layout;

const PersonalInfoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { employee, loading, error } = useSelector(
    (state: RootState) => state.employee
  );

  const userId = useMemo(() => {
    if (user?.role === 'Employee') {
      return user.id;
    } else if (user?.role === 'HR') {
      return employee?.userId;
    }
    return undefined;
  }, [user]);

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState(employee);

  useEffect(() => {
    if (userId) {
      dispatch(fetchEmployeeByUserId(userId));
    }
    return () => {
      dispatch(clearEmployee());
    };
  }, [dispatch, userId]);

  // Synchronize updatedData with employee data once fetched
  useEffect(() => {
    if (employee) {
      setUpdatedData(employee);
    }
  }, [employee]);

  const handleSave = () => {
    if (updatedData && userId) {
      dispatch(updateEmployee({ userId, updatedData }))
        .then(() => {
          message.success('Changes saved successfully!');
          setIsEditing(false);
        })
        .catch(() => {
          message.error('Failed to save changes');
        });
    }
  };

  const handleCancel = () => {
    setUpdatedData(employee);
    setIsEditing(false);
    message.info('Changes discarded');
  };

//   const handleFieldChange = (field: string, value: any) => {
//     setUpdatedData((prev) => {
//       if (!prev) return prev;
//       return {
//         ...prev,
//         [field]: value,
//       };
//     });
//   };

const handleFieldChange = (field: string, value: any) => {
  setUpdatedData((prev) => {
    if (!prev) return prev;

    const fieldParts = field.split('.');

    const updateNestedField = (
      object: any,
      keys: string[],
      value: any
    ): any => {
      const [currentKey, ...restKeys] = keys;

      if (!currentKey) return object;

      const arrayMatch = currentKey.match(/^(\w+)\[(\d+)\]$/);
      if (arrayMatch) {
        const arrayKey = arrayMatch[1];
        const index = parseInt(arrayMatch[2], 10);

        const array = object[arrayKey] ? [...object[arrayKey]] : [];

        while (array.length <= index) {
          array.push({});
        }

        array[index] = updateNestedField(array[index], restKeys, value);

        return {
          ...object,
          [arrayKey]: array,
        };
      } else {
        if (restKeys.length === 0) {
          return {
            ...object,
            [currentKey]: value,
          };
        } else {
          return {
            ...object,
            [currentKey]: updateNestedField(
              object[currentKey] || {},
              restKeys,
              value
            ),
          };
        }
      }
    };

    const newData = updateNestedField(prev, fieldParts, value);

    console.log('Field:', field);
    console.log('Value:', value);
    console.log('UpdatedData:', newData);

    return newData;
  });
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout className='min-h-screen'>
      <Sider
        width={200}
        className='bg-gray-800 text-white h-screen sticky top-0'
      >
        <Menu mode='inline' theme='dark' className='h-full'>
          <Menu.Item key='name'>
            <Link to='nameSection' smooth={true} offset={-70}>
              Name
            </Link>
          </Menu.Item>
          <Menu.Item key='address'>
            <Link to='addressSection' smooth={true} offset={-70}>
              Address
            </Link>
          </Menu.Item>
          <Menu.Item key='contact-info'>
            <Link to='contactInfoSection' smooth={true} offset={-70}>
              Contact Info
            </Link>
          </Menu.Item>
          <Menu.Item key='work-authorization'>
            <Link to='workAuthorizationSection' smooth={true} offset={-70}>
              Work Authorization
            </Link>
          </Menu.Item>
          <Menu.Item key='emergency-contacts'>
            <Link to='emergencyContactSection' smooth={true} offset={-70}>
              Emergency Contacts
            </Link>
          </Menu.Item>
          <Menu.Item key='documents'>
            <Link to='documentsSection' smooth={true} offset={-70}>
              Documents
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className='bg-gray-50'>
        <Content className='p-6'>
          <div className='flex justify-end space-x-4 mb-4'>
            {isEditing ? (
              <>
                <Button type='default' onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type='primary' onClick={handleSave}>
                  Save
                </Button>
              </>
            ) : (
              <Button type='primary' onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>

          {employee && (
            <>
              <div id='nameSection'>
                <NameSection
                  employee={employee}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  form={form}
                />
              </div>
              <div id='addressSection' className='mt-6'>
                <AddressSection
                  employee={employee}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  form={form}
                />
              </div>
              <div id='contactInfoSection' className='mt-6'>
                <ContactInfoSection
                  employee={employee}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  form={form}
                />
              </div>
              <div id='workAuthorizationSection' className='mt-6'>
                <EmploymentSection
                  employee={employee}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  form={form}
                />
              </div>
              <div id='emergencyContactSection' className='mt-6'>
                <EmergencyContactSection
                  employee={employee}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  form={form}
                />
              </div>

              <div id='documentsSection' className='mt-6'>
                <DocumentsSection employee={employee} />
              </div>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PersonalInfoPage;
