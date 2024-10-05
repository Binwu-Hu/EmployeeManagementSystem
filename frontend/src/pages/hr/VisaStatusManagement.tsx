import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import VisaStatusInProgress from '../../components/VisaStatus/VisaStatusInProgress';

const { Sider, Content } = Layout;

const VisaStatusManagement: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('1');

  return (
    <Layout className="min-h-screen">
      <Sider width={200} className="bg-gray-800 text-white h-screen sticky top-0">
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
        >
          <Menu.Item
            key="1"
            style={{
              backgroundColor: selectedKey === '1' ? 'transparent' : '',
              color: selectedKey === '1' ? '#fff' : '',
            }}
          >
            Visa Status In Progress
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="bg-gray-50">
        <Content className="p-6">
          {selectedKey === '1' && <VisaStatusInProgress />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default VisaStatusManagement;