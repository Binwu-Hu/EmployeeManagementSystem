import { AppDispatch, RootState } from '../../app/store';
import { Button, Form, Image, Upload, message } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Employee } from '../../utils/type';
import { UploadOutlined } from '@ant-design/icons';
import { uploadEmployeeFile } from '../../features/employee/employeeSlice';

interface ProfilePictureSectionProps {
  employee: Employee;
  onChange: (field: string, value: any) => void;
  form: any;
  unchangeable: boolean;
}

const ProfilePictureSection: React.FC<ProfilePictureSectionProps> = ({
  employee,
  onChange,
  form,
  unchangeable,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const [profilePictureSrc, setProfilePictureSrc] = useState<string>(
    employee?.profilePicture
      ? `http://localhost:3000${employee.profilePicture}`
      : '../../../public/default-avatar.jpg'
  );

  const handleFileUpload = (file: any) => {
    const userId = user?.id;
    if (userId) {
      dispatch(uploadEmployeeFile({ userId, file }))
        .unwrap()
        .then(({ filePath }) => {
          //   onChange('profilePicture', filePath);
          const imageUrl = `http://localhost:3000${filePath}`;
          setProfilePictureSrc(imageUrl);

          message.success('Profile picture uploaded successfully!');
        })
        .catch((error) => {
          console.error('Upload failed:', error);
          message.error('Failed to upload profile picture');
        });
    }
  };

  return (
    <div className='bg-white p-4 rounded shadow-md'>
      <h2 className='text-xl font-semibold'>Profile Picture</h2>
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          profilePicture: profilePictureSrc,
        }}
      >
        <Form.Item name='profilePicture'>
          <div className='flex items-center space-x-4 mt-4'>
            {/* Display the profile picture */}
            <Image
              width={100}
              height={100}
              src={profilePictureSrc}
              alt='Profile Picture'
              fallback='../../../public/default-avatar.jpg'
            />
            <Upload
              listType='picture'
              maxCount={1}
              showUploadList={false}
              beforeUpload={(file) => {
                handleFileUpload(file);
                return false; // Prevent default upload behavior
              }}
            >
              <Button disabled={unchangeable} icon={<UploadOutlined />}>
                {employee.profilePicture
                  ? 'Change Profile Picture'
                  : 'Upload Profile Picture'}
              </Button>
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfilePictureSection;
