import '@react-pdf-viewer/core/lib/styles/index.css'; // Import the core styles

import { Button, Modal, Upload, message } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';

import { Employee } from '../../utils/type';

interface DocumentsSectionProps {
  employee: Employee;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
  form: any;
  unchangeable: boolean;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  employee,
  isEditing,
  onChange,
  form,
  unchangeable,
}) => {
  const [visible, setVisible] = useState(false);
  const [modalPdfUrl, setModalPdfUrl] = useState<string | null>(null);

  const handlePreview = (filePath: string) => {
    setModalPdfUrl(`http://localhost:3000${filePath}`);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setModalPdfUrl(null);
  };

  return (
    <div className='bg-white p-4 rounded shadow-md'>
      <h2 className='text-xl font-semibold'>Documents</h2>
      {employee.workAuthorization?.files?.length > 0 ? (
        <div>
          <h3>Work Authorization Files:</h3>
          <ul>
            {employee.workAuthorization.files.map((filePath, index) => {
              const fileName = filePath.split('/').pop();
              return (
                <li key={index} className='flex items-center space-x-2'>
                  <span>{fileName}</span>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handlePreview(filePath)}
                  >
                    Preview
                  </Button>
                  <a
                    href={`http://localhost:3000${filePath}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Button icon={<DownloadOutlined />}>Download</Button>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        'No files uploaded'
      )}

      <Modal
        title='PDF Preview'
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width='80%'
      >
        {modalPdfUrl && (
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
          >
            <div style={{ height: '750px' }}>
              <Viewer fileUrl={modalPdfUrl} />
            </div>
          </Worker>
        )}
      </Modal>
    </div>
  );
};

export default DocumentsSection;
