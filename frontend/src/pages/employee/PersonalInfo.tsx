import { AppDispatch, RootState } from '../../app/store';
import { Button, Form, Layout, Menu, message } from 'antd';
import React, { useEffect, useState } from 'react';
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

  const userId = user?.id;

  const [form] = Form.useForm();

  // Edit state that controls all sections
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState(employee);

  useEffect(() => {
    if (userId) {
      dispatch(fetchEmployeeByUserId(userId));
    }
    return () => {
      dispatch(clearEmployee()); // Clear the employee data when leaving the page
    };
  }, [dispatch, userId]);

  useEffect(() => {
    setUpdatedData(employee); // Reset data when employee data is fetched
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
    setUpdatedData(employee); // Reset to original data on cancel
    setIsEditing(false);
    message.info('Changes discarded');
  };

  const handleFieldChange = (field: string, value: any) => {
    setUpdatedData((prev) => {
      if (!prev) return prev; // Handle the case when prev is null
      return {
        ...prev,
        [field]: value,
      };
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
          <Menu.Item key='employment'>
            <Link to='employmentSection' smooth={true} offset={-70}>
              Employment
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
              <div id='employmentSection' className='mt-6'>
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
                <DocumentsSection
                  employee={employee}
                  isEditing={isEditing}
                  onChange={handleFieldChange}
                  form={form}
                />
              </div>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PersonalInfoPage;
