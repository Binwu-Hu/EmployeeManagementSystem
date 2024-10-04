import { Button, Upload } from 'antd';

import { Employee } from '../../utils/type';
import React from 'react';
import { UploadOutlined } from '@ant-design/icons';

interface DocumentsSectionProps {
  employee: Employee;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
  form: any;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  employee,
  isEditing,
  onChange,
  form,
}) => {
  return (
    <div className='bg-white p-4 rounded shadow-md'>
      <h2 className='text-xl font-semibold'>Documents</h2>
      {isEditing ? (
        <>
          <Upload
            onChange={(info) =>
              onChange('documents.profilePicture', info.file.name)
            }
          >
            <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
          </Upload>
          <Upload
            onChange={(info) =>
              onChange('documents.driverLicense', info.file.name)
            }
          >
            <Button icon={<UploadOutlined />}>Upload Driver License</Button>
          </Upload>
          <Upload
            onChange={(info) =>
              onChange('documents.workAuthorization', info.file.name)
            }
          >
            <Button icon={<UploadOutlined />}>Upload Work Authorization</Button>
          </Upload>
        </>
      ) : (
        <div>
          <p>
            <strong>Profile Picture:</strong>{' '}
            {employee.documents?.profilePicture || 'No Profile Picture'}
          </p>
          <p>
            <strong>Driver License:</strong>{' '}
            {employee.documents?.driverLicense || 'No Driver License'}
          </p>
          <p>
            <strong>Work Authorization:</strong>{' '}
            {employee.documents?.workAuthorization || 'No Work Authorization'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentsSection;
