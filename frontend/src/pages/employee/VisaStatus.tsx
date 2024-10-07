import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { fetchEmployeeByUserId } from '../../features/employee/employeeSlice';
import { fetchVisaStatus } from '../../features/visaStatus/visaStatusSlice'; // Fetch visa status
import OPTReceiptSection from '../../components/VisaStatus/OPTReceiptSection';
import OPTEADSection from '../../components/VisaStatus/OPTEADSection';
import I983FormSection from '../../components/VisaStatus/I983FormSection';
import I20FormSection from '../../components/VisaStatus/I20FormSection';
import { Layout, Menu, Spin } from 'antd';

const { Sider, Content } = Layout;

const VisaStatusPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const {
    employee,
    loading: employeeLoading,
    error: employeeError,
  } = useSelector((state: RootState) => state.employee);

  // Extract only visaType to minimize re-renders
  const visaType = useSelector(
    (state: RootState) => state.visaStatus.visaStatus?.visaType
  );

  const [selectedKey, setSelectedKey] = useState('optReceipt');

  // Fetch employee data on component mount
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchEmployeeByUserId(user.id));
    }
  }, [dispatch, user]);

  // Fetch visa status once employee is loaded
  useEffect(() => {
    if (employee?._id) {
      dispatch(fetchVisaStatus(employee._id));
    }
  }, [dispatch, employee]);

  useEffect(() => {
    if (employee?._id) {
      dispatch(fetchVisaStatus(employee._id));
    }
  }, [dispatch, employee, selectedKey]);

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };

  const renderSection = useMemo(() => {
    if (!employee?._id) return null;

    switch (selectedKey) {
      case 'optReceipt':
        return <OPTReceiptSection employeeId={employee._id} />;
      case 'optEAD':
        return <OPTEADSection employeeId={employee._id} />;
      case 'i983Form':
        return <I983FormSection employeeId={employee._id} />;
      case 'i20Form':
        return <I20FormSection employeeId={employee._id} />;
      default:
        return <p>Select a section</p>;
    }
  }, [selectedKey, employee?._id]);

  if (employeeLoading)
    return (
      <div className='flex justify-center items-center h-96'>
        <Spin size='large' />
      </div>
    );
  if (employeeError) return <p>Error: {employeeError}</p>;

  if (visaType !== 'F1') {
    return (
      <Layout className='min-h-screen'>
        <Content className='p-6'>
          <h1 className='text-2xl font-bold mb-4'>Visa Status Management</h1>
          <p>
            This feature is only available for F-1 visa holders. Please contact
            your HR for further assistance.
          </p>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className='min-h-screen'>
      <Sider
        width={200}
        className='bg-gray-800 text-white h-screen sticky top-0'
      >
        <Menu
          mode='inline'
          theme='dark'
          className='h-full'
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
        >
          <Menu.Item key='optReceipt'>OPT Receipt</Menu.Item>
          <Menu.Item key='optEAD'>OPT EAD</Menu.Item>
          <Menu.Item key='i983Form'>I-983 Form</Menu.Item>
          <Menu.Item key='i20Form'>I-20 Form</Menu.Item>
        </Menu>
      </Sider>

      <Layout className='bg-gray-50'>
        <Content className='p-6'>
          <h1 className='text-2xl font-bold mb-4'>Visa Status Management</h1>
          {renderSection}
        </Content>
      </Layout>
    </Layout>
  );
};

export default VisaStatusPage;
