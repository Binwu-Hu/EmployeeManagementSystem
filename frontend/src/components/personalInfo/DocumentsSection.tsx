import '@react-pdf-viewer/core/lib/styles/index.css'; // Import the core styles

import { Button, Modal, message } from 'antd';
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

  const handleDownload = async (filePath: string) => {
    try {
      const response = await fetch(`http://localhost:3000${filePath}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filePath.split('/').pop() || 'file.pdf'); // Set file name
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      // Revoke the object URL after download (clean up)
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      message.error('Failed to download the file');
    }
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
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(filePath)}
                  >
                    Download
                  </Button>
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
