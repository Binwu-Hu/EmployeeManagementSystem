import { AppDispatch, RootState } from '../../app/store';
import { Button, Form, Layout, Menu, Modal, message } from 'antd';
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
import axios from 'axios';
import { fetchApplicationByEmployeeId } from '../../features/application/applicationSlice';

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

  const [form] = Form.useForm();
  const [updatedData, setUpdatedData] = useState(employee);

  useEffect(() => {
    if (userId) {
      dispatch(fetchEmployeeByUserId(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (employee?._id) {
      dispatch(fetchApplicationByEmployeeId(employee?._id));
    }
  }, [dispatch, employee?._id]);

  useEffect(() => {
    if (employee) {
      if (
        applicationMessage ===
          'Please fill in the application fields and submit.' ||
        application?.status === 'Rejected'
      ) {
        setUnchangeable(false);
      } else {
        setUnchangeable(true);
      }

      setUpdatedData(employee);
    }
  }, [employee, applicationMessage, application?.status]);

    const handleSubmit = () => {
      form
        .validateFields()
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

//   const handleSubmit = () => {
//     form
//       .validateFields() // Validate fields
//       .then(() => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           message.error('No authentication token found.');
//           return;
//         }

//         // Update employee information
//         if (updatedData && userId) {
//           dispatch(updateEmployee({ userId, updatedData }))
//             .then(() => {
//               message.success('Onboarding information submitted successfully!');
//             })
//             .catch(() => {
//               message.error('Please fill in all required fields.');
//             });
//         }

//         // If application status allows, submit the application
//         if (application?.status === 'Rejected' || !application?.status) {
//           axios
//             .post(
//               '/api/application',
//               {},
//               {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             )
//             // .then((response) => {
//             //   message.success(
//             //     'Application submitted successfully!',
//             //     0.8,
//             //     () => {
//             //       window.location.reload();
//             //     }
//             //   );
//             //   console.log('Response:', response.data);
//             // })
//             .catch((error) => {
//               message.error(
//                 error.response?.data?.message ||
//                   'Failed to apply. Please fill in all required fields.'
//               );
//               console.error('Error:', error);
//             });
//         }
//       })
//       .catch(() => {
//         message.error('Please fill in all required fields.');
//       });
//   };

    const handleApply = () => {
      Modal.confirm({
        title: 'Confirm Submission',
        content:
          'Unsaved changes will not be updated. Are you sure you want to submit the application?',
        okText: 'Yes, Submit',
        cancelText: 'Cancel',
        onOk: () => {
          form
            .validateFields()
            .then(() => {
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
                  message.success(
                    'Application submitted successfully!',
                    0.8,
                    () => {
                      window.location.reload();
                    }
                  );
                  console.log('Response:', response.data);
                });
            })
            .catch((error) => {
              message.error(
                error.response?.data?.message ||
                  'Failed to apply. Please fill in all required fields.'
              );
              console.error('Error:', error);
            });
        },
      });
    };

  if (loading || applicationLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (application?.status === 'Approved') {
    return (
      <div className='bg-white p-10 rounded shadow-md text-xl font-semibold text-green-500'>
        Your application has been approved.
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
              <Button
                type='primary'
                htmlType='submit'
                onClick={handleSubmit}
                disabled={application?.status === 'Pending'}
              >
                Save
              </Button>

              <Button
                type='primary'
                htmlType='submit'
                onClick={handleApply}
                disabled={application?.status === 'Pending'}
              >
                {application?.status === 'Rejected' ? 'Resubmit' : 'Submit'}
              </Button>
            </div>

            <div className='bg-white p-4 rounded shadow-md '>
              <h2 className='text-xl font-semibold mb-2 text-red-500'>
                {applicationMessage ===
                  'Please fill in the application fields and submit.' &&
                  `${applicationMessage}`}

                <div className={'text-red-500'}>{application?.status}</div>
              </h2>

              <h2 className='text-xl font-semibold'>
                {application?.status === 'Rejected' &&
                  `HR feedback: ${application?.feedback}`}
              </h2>
            </div>

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
                  <DocumentsSection employee={employee} />
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
