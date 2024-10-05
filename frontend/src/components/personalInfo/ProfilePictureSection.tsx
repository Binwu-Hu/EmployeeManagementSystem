import { Button, Form, Upload } from 'antd';

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
  return (
    <div className='bg-white p-4 rounded shadow-md'>
      <h2 className='text-xl font-semibold'>Profile Picture</h2>
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          profilePicture:
            employee.documents?.profilePicture || 'default-placeholder.png',
        }}
      >
        <Form.Item
          name='profilePicture'
          label='Profile Picture'
          // rules={[{ required: true, message: 'Profile picture is required' }]}
        >
          <Upload
            listType='picture'
            maxCount={1}
            onChange={(info) =>
              onChange('documents.profilePicture', info.file.name)
            }
          >
            <Button disabled={unchangeable} icon={<UploadOutlined />}>
              {employee.documents?.profilePicture || 'Upload Profile Picture'}
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfilePictureSection;
