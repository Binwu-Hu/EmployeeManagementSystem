import { AppDispatch, RootState } from '../../app/store';
import { Button, Form, Layout, Menu, message, Input } from 'antd'; // Add Input for feedback
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  fetchEmployeeByUserId
} from '../../features/employee/employeeSlice';

import AddressSection from '../../components/personalInfo/AddressSection';
import ContactInfoSection from '../../components/personalInfo/ContactInfoSection';
import DocumentsSection from '../../components/personalInfo/DocumentsSection';
import EmergencyContactSection from '../../components/personalInfo/EmergencyContactSection';
import NameSection from '../../components/personalInfo/NameSection';
import ProfilePictureSection from '../../components/personalInfo/ProfilePictureSection';
import UserSection from '../../components/personalInfo/UserSection';
import WorkAuthorizationSection from '../../components/personalInfo/WorkAuthorizationSection';

import { fetchAllApplications } from '../../features/application/applicationSlice';
import axios from 'axios';

const { Sider, Content } = Layout;

const ApplicationManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employee, loading, error } = useSelector(
    (state: RootState) => state.employee
  );

  const { applications, loading: applicationLoading } = useSelector(
    (state: RootState) => state.application
  );

  const { userId } = useParams<{ userId: string }>();
  console.log('Received userId:', userId);

  const [form] = Form.useForm();
  //const [updatedData, setUpdatedData] = useState(employee);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(
    null
  );
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (userId) {
      dispatch(fetchEmployeeByUserId(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(fetchAllApplications());
  }, [dispatch]);

  // useEffect(() => {
  //   setUpdatedData(employee);
  // }, [employee]);

  useEffect(() => {
    if (applications && userId) {
      const pendingApp = applications.pending.find(
        (app: any) => app.userId === userId
      );
      const rejectedApp = applications.rejected.find(
        (app: any) => app.userId === userId
      );
      const approvedApp = applications.approved.find(
        (app: any) => app.userId === userId
      );

      if (pendingApp) {
        setApplicationStatus(pendingApp.status);
      } else if (rejectedApp) {
        setApplicationStatus(rejectedApp.status);
        setFeedback(rejectedApp.feedback);
      } else if (approvedApp) {
        setApplicationStatus(approvedApp.status);
      } else {
        setApplicationStatus('No application found');
      }
    }
  }, [applications, userId]);

  const handleFieldChange = (field: string, value: any) => {
    // setUpdatedData((prev) => {
    //   if (!prev) return prev;
    //   return {
    //     ...prev,
    //     [field]: value,
    //   };
    // });
  };

  const handleApprove = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('No authentication token found.');
      return;
    }

    axios
      .put(
        `/api/application/${userId}`,
        { status: 'Approved' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        message.success('Application approved successfully!', 0.8, () => {
          window.location.reload();
        });
        console.log('Response:', response.data);
      })
      .catch((error) => {
        message.error(error.response?.data?.message || 'Failed to approve.');
        console.error('Error:', error);
      });
  };

  const handleReject = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('No authentication token found.');
      return;
    }

    axios
      .put(
        `/api/application/${userId}`,
        { status: 'Rejected', feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        message.success('Application rejected successfully!', 0.8, () => {
          window.location.reload();
        });
        console.log('Response:', response.data);
      })
      .catch((error) => {
        message.error(error.response?.data?.message || 'Failed to reject.');
        console.error('Error:', error);
      });
  };

  if (loading || applicationLoading) return <div>Loading...</div>;

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
          <Form form={form} layout='vertical'>
            {applicationStatus === 'Pending' && (
              <div className='flex justify-end space-x-4 mb-4'>
                <Button
                  type='primary'
                  htmlType='button'
                  onClick={handleApprove}
                >
                  Approve
                </Button>

                <Button type='primary' htmlType='button' onClick={handleReject}>
                  Reject
                </Button>
              </div>
            )}

            {applicationStatus && (
              <div className='mb-6'>
                <h3 className='text-lg font-bold'>Application Status</h3>
                <p>{applicationStatus}</p>

                {applicationStatus === 'Pending' && (
                  <>
                    <h3 className='text-lg font-bold'>Feedback</h3>
                    <Input.TextArea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder='Enter feedback for rejection'
                    />
                  </>
                )}

                {applicationStatus === 'Rejected' && feedback && (
                  <>
                    <h3 className='text-lg font-bold'>Feedback</h3>
                    <p>{feedback}</p>
                  </>
                )}
              </div>
            )}

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

export default ApplicationManagement;
