import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import SendRegistrationLink from '../../components/auth/SendRegistrationLink';
import LinkHistory from './LinkHistory';
import HiringList from './HiringList';

const { Sider, Content } = Layout;

const HiringManagement: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>(
    localStorage.getItem('selectedKey') || '1'
  );

  useEffect(() => {
    localStorage.setItem('selectedKey', selectedKey);
  }, [selectedKey]);

  return (
    <Layout className='min-h-screen'>
      <Sider
        width={200}
        className='bg-gray-800 text-white h-screen sticky top-0'
      >
        <Menu
          mode='inline'
          theme='dark'
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
        >
          <Menu.Item key='1'>SendRegistrationLink</Menu.Item>
          <Menu.Item key='2'>RegistrationLinkHistory</Menu.Item>
          <Menu.Item key='3'>ApplicationList</Menu.Item>
        </Menu>
      </Sider>
      <Layout className='bg-gray-50'>
        <Content className='p-6'>
          {selectedKey === '1' && <SendRegistrationLink />}
          {selectedKey === '2' && <LinkHistory />}
          {selectedKey === '3' && <HiringList />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HiringManagement;
