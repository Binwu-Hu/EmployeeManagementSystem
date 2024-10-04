import { AppDispatch, RootState } from '../../app/store';
import { Button, Form, Layout, Menu, message } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  fetchEmployeeByUserId,
  updateEmployee,
} from '../../features/employee/employeeSlice';
import { useDispatch, useSelector } from 'react-redux';

import AddressSection from '../../components/personalInfo/AddressSection';
import ContactInfoSection from '../../components/personalInfo/ContactInfoSection';
import DocumentsSection from '../../components/personalInfo/DocumentsSection';
import EmergencyContactSection from '../../components/personalInfo/EmergencyContactSection';
import NameSection from '../../components/personalInfo/NameSection';
import ProfilePictureSection from '../../components/personalInfo/ProfilePictureSection';
import UserSection from '../../components/personalInfo/UserSection';
import WorkAuthorizationSection from '../../components/personalInfo/WorkAuthorizationSection';

const { Sider, Content } = Layout;

const OnboardingPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { employee, loading, error } = useSelector(
    (state: RootState) => state.employee
  );

  const userId = user?.id;

  const [form] = Form.useForm(); // Create a form instance
  const [updatedData, setUpdatedData] = useState(employee);

  useEffect(() => {
    if (userId) {
      dispatch(fetchEmployeeByUserId(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    setUpdatedData(employee); // Reset data when employee data is fetched
  }, [employee]);

  const handleSubmit = () => {
    form
      .validateFields() // Validate required fields before submission
      .then(() => {
        if (updatedData && userId) {
          dispatch(updateEmployee({ userId, updatedData }))
            .then(() => {
              message.success('Onboarding information submitted successfully!');
            })
            .catch(() => {
              message.error('Failed to submit onboarding information');
            });
        }
      })
      .catch(() => {
        message.error('Please fill in all required fields.');
      });
  };

  const handleFieldChange = (field: string, value: any) => {
    setUpdatedData((prev) => {
      if (!prev) return prev;
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
            <a href='#nameSection'>Name</a>
          </Menu.Item>
          <Menu.Item key='profile-picture'>
            <a href='#profilePictureSection'>Profile Picture</a>
          </Menu.Item>
          <Menu.Item key='address'>
            <a href='#addressSection'>Address</a>
          </Menu.Item>
          <Menu.Item key='contact-info'>
            <a href='#contactInfoSection'>Contact Info</a>
          </Menu.Item>
          <Menu.Item key='user-info'>
            <a href='#userInfoSection'>Employee Info</a>
          </Menu.Item>
          <Menu.Item key='work-authorization'>
            <a href='#workAuthorizationSection'>Work Authorization</a>
          </Menu.Item>
          <Menu.Item key='emergency-contacts'>
            <a href='#emergencyContactSection'>Emergency Contacts</a>
          </Menu.Item>
          <Menu.Item key='documents'>
            <a href='#documentsSection'>Documents</a>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className='bg-gray-50'>
        <Content className='p-6'>
          <Form form={form} layout='vertical' onFinish={handleSubmit}>
            {/* Submit button */}
            <div className='flex justify-end space-x-4 mb-4'>
              <Button type='primary' htmlType='submit'>
                Submit
              </Button>
            </div>

            {employee && (
              <>
                <div id='nameSection'>
                  <NameSection
                    employee={employee}
                    isEditing={true}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>
                <div id='profilePictureSection'>
                  <ProfilePictureSection
                    employee={employee}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>
                <div id='addressSection' className='mt-6'>
                  <AddressSection
                    employee={employee}
                    isEditing={true}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>
                <div id='contactInfoSection' className='mt-6'>
                  <ContactInfoSection
                    employee={employee}
                    isEditing={true}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>
                <div id='userInfoSection' className='mt-6'>
                  <UserSection
                    employee={employee}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>
                <div id='workAuthorizationSection' className='mt-6'>
                  <WorkAuthorizationSection
                    employee={employee}
                    isEditing={true}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>
                <div id='emergencyContactSection' className='mt-6'>
                  <EmergencyContactSection
                    employee={employee}
                    isEditing={true}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>

                <div id='documentsSection' className='mt-6'>
                  <DocumentsSection
                    employee={employee}
                    isEditing={true}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>
              </>
            )}
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default OnboardingPage;
