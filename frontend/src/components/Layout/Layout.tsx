import AppFooter from './Footer';
import MergedHeader from './Header';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import React from 'react';

const { Content } = Layout;

const AppLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen flex flex-col">
      <MergedHeader />

      <Content className="flex-grow bg-gray-100 flex justify-center items-center">
        <Outlet />
      </Content>

      <AppFooter />
    </Layout>
  );
};

export default AppLayout;
