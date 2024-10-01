import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { Layout } from 'antd';
import React from 'react';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer className='bg-black text-white'>
      <div className='flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-4 gap-8'>
        <p>©2024 All Rights Reserved.</p>

        {/* Flexbox for social media icons, centered properly */}
        <div className='flex space-x-4 justify-center items-center'>
          <YoutubeOutlined style={{ fontSize: '20px' }} />
          <TwitterOutlined style={{ fontSize: '20px' }} />
          <FacebookOutlined style={{ fontSize: '20px' }} />
          <InstagramOutlined style={{ fontSize: '20px' }} />
        </div>

        <div className='flex flex-row space-x-4'>
          <a href='/' className='hover:underline'>
            Contact us
          </a>
          <a href='/' className='hover:underline'>
            Privacy Policies
          </a>
          <a href='/' className='hover:underline'>
            Help
          </a>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;