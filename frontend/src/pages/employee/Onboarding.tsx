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

import { getApplicationStatus } from '../../features/application/applicationSlice';
import axios from 'axios';

const { Sider, Content } = Layout;

const OnboardingPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { employee, loading, error } = useSelector(
    (state: RootState) => state.employee
  );

  const [unchangeable, setUnchangeable] = useState<boolean>(true);

  const {
    application,
    applicationMessage,
    loading: applicationLoading,
  } = useSelector((state: RootState) => state.application);

  const userId = user?.id;

  const [form] = Form.useForm(); // Create a form instance
  const [updatedData, setUpdatedData] = useState(employee);

  useEffect(() => {
    if (userId) {
      dispatch(fetchEmployeeByUserId(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (employee?._id) {
      dispatch(getApplicationStatus());
    }
  }, [dispatch, employee?._id]);

  useEffect(() => {
    setUpdatedData(employee);
  }, [employee]);

  useEffect(() => {
    if (
      applicationMessage ===
        'Please fill in the application fields and submit.' ||
      applicationMessage ===
        'Your application was rejected. Please review the feedback, make changes, and resubmit.'
    ) {
      setUnchangeable(false);
    } else {
      setUnchangeable(true);
    }
  }, [applicationMessage]);

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

  const handleApply = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('No authentication token found.');
      return;
    }

    axios
      .post(
        '/api/application',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        message.success('Application applied successfully!', 0.8, () => {
          window.location.reload();
        });
        console.log('Response:', response.data);
      })
      .catch((error) => {
        message.error(error.response?.data?.message || 'Failed to apply.');
        console.error('Error:', error);
      });
  };

  if (loading || applicationLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (
    applicationMessage ===
    'Your application has been approved. Redirecting to the home page...'
  ) {
    return (
      <div>
        Your application has been approved. Redirecting to the home page...
      </div>
    );
  }

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
          <Form form={form} layout='vertical'>
            {/* Submit button */}
            <div className='flex justify-end space-x-4 mb-4'>
              <Button type='primary' htmlType='submit' onClick={handleSubmit}>
                Submit
              </Button>

              <Button type='primary' htmlType='button' onClick={handleApply}>
                Apply
              </Button>
            </div>

            <div>{applicationMessage}</div>

            {employee && (
              <>
                <div id='nameSection'>
                  <NameSection
                    unchangeable={unchangeable}
                    employee={employee}
                    isEditing={true}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>
                <div id='profilePictureSection'>
                  <ProfilePictureSection
                  unchangeable={unchangeable}
                    employee={employee}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>
                <div id='addressSection' className='mt-6'>
                  <AddressSection
                    unchangeable={unchangeable}
                    employee={employee}
                    isEditing={true}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>
                <div id='contactInfoSection' className='mt-6'>
                  <ContactInfoSection
                    unchangeable={unchangeable}
                    employee={employee}
                    isEditing={true}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>
                <div id='userInfoSection' className='mt-6'>
                  <UserSection
                    unchangeable={unchangeable}
                    employee={employee}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>
                <div id='workAuthorizationSection' className='mt-6'>
                  <WorkAuthorizationSection
                    unchangeable={unchangeable}
                    employee={employee}
                    isEditing={true}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>
                <div id='emergencyContactSection' className='mt-6'>
                  <EmergencyContactSection
                    unchangeable={unchangeable}
                    employee={employee}
                    isEditing={true}
                    onChange={handleFieldChange}
                    form={form}
                  />
                </div>

                <div id='documentsSection' className='mt-6'>
                  <DocumentsSection
                    unchangeable={unchangeable}
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
