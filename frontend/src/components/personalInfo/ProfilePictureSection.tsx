import { Button, Form, Image, Upload } from 'antd';

import { Employee } from '../../utils/type';
import React from 'react';
import { UploadOutlined } from '@ant-design/icons';

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
  const profilePictureSrc =
    employee.documents?.profilePicture || '../../../public/default-avatar.jpg';
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
            {/* Display profile picture */}
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
              onChange={(info) =>
                onChange('profilePicture', info.file.name)
              }
            >
              <Button disabled={unchangeable} icon={<UploadOutlined />}>
                {employee.documents?.profilePicture || 'Upload Profile Picture'}
              </Button>
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfilePictureSection;
