import { AppDispatch, RootState } from '../../app/store';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  clearEmployee,
  fetchEmployeeByUserId,
} from '../../features/employee/employeeSlice';
import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-scroll';
import NameSection from '../../components/personalInfo/NameSection';

const { Sider, Content } = Layout;

const PersonalInfoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { employee, loading, error } = useSelector(
    (state: RootState) => state.employee
  );

  useEffect(() => {
    if (user) {
        dispatch(fetchEmployeeByUserId(user.id));
    }

    return () => {
      dispatch(clearEmployee()); // Clear the employee data when leaving the page
    };
  }, [dispatch, user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout className='min-h-screen'>
      <Sider width={200} className='bg-gray-800 text-white'>
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
          {employee ? (
            <div id='nameSection'>
              <NameSection employee={employee} />
            </div>
          ) : (
            <div>Loading employee data...</div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PersonalInfoPage;
