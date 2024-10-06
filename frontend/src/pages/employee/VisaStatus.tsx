import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { fetchEmployeeByUserId } from '../../features/employee/employeeSlice';
import { fetchVisaStatus } from '../../features/visaStatus/visaStatusSlice'; // Fetch visa status
import OPTReceiptSection from '../../components/VisaStatus/OPTReceiptSection';
import OPTEADSection from '../../components/VisaStatus/OPTEADSection';
import I983FormSection from '../../components/VisaStatus/I983FormSection';
import I20FormSection from '../../components/VisaStatus/I20FormSection';
import { Layout, Menu } from 'antd';

const { Sider, Content } = Layout;

const VisaStatusPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const { employee, loading, error } = useSelector((state: RootState) => state.employee);
  const { visaStatus } = useSelector((state: RootState) => state.visaStatus); // Fetch visa status from Redux store
  const [selectedKey, setSelectedKey] = useState('optReceipt');

  // Fetch employee and visa status data on component mount
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchEmployeeByUserId(user.id));
    }
  }, [dispatch, user]);

  // Fetch visa status once employee is loaded
  useEffect(() => {
    if (employee?._id) {
      dispatch(fetchVisaStatus(employee._id)); // Fetch visa status for the employee
    }
  }, [dispatch, employee]);

  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
  };

  const renderSection = () => {
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
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  console.log('visaStatus', visaStatus);
  if (visaStatus?.visaType !== 'F1') {
    return (
      <Layout className="min-h-screen">
        <Content className="p-6">
          <h1 className="text-2xl font-bold mb-4">Visa Status Management</h1>
          <p>This feature is only available for F-1 visa holders. Please contact your HR for further assistance.</p>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Sider width={200} className="bg-gray-800 text-white h-screen sticky top-0">
        <Menu
          mode="inline"
          theme="dark"
          className="h-full"
          selectedKeys={[selectedKey]}
          onClick={(e) => handleMenuClick(e.key)}
        >
          <Menu.Item key="optReceipt">OPT Receipt</Menu.Item>
          <Menu.Item key="optEAD">OPT EAD</Menu.Item>
          <Menu.Item key="i983Form">I-983 Form</Menu.Item>
          <Menu.Item key="i20Form">I-20 Form</Menu.Item>
        </Menu>
      </Sider>

      <Layout className="bg-gray-50">
        <Content className="p-6">
          <h1 className="text-2xl font-bold mb-4">Visa Status Management</h1>
          {employee && visaStatus && renderSection()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default VisaStatusPage;
