import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { logout } from '../../features/user/userSlice';
import { useState } from 'react';

const SignOutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showLogoutModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsModalVisible(false);
  };

  return (
    <>
      <div className='flex items-center space-x-2' onClick={showLogoutModal}>
        <UserOutlined style={{ fontSize: '20px' }} />
        <span>Sign Out</span>
      </div>

      <Modal
        title="Confirm Logout"
        visible={isModalVisible}
        onOk={handleConfirmLogout}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
        centered
      >
        <p>Are you sure you want to sign out?</p>
      </Modal>
    </>
  );
};

export default SignOutButton;