import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVisaDocument, fetchVisaStatus } from '../../features/visaStatus/visaStatusSlice';
import { RootState } from '../../app/store';
import { Upload, Button, message, Card, Modal } from 'antd';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const I20FormSection = ({ employeeId }: { employeeId: string }) => {
  const dispatch = useDispatch();
  const { visaStatus } = useSelector((state: RootState) => state.visaStatus);
  const [files, setFiles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPdfUrl, setModalPdfUrl] = useState<string | null>(null);

  const handleFileChange = (info: any) => {
    setFiles(info.fileList);
  };

  const handleSubmit = () => {
    if (!files.length) {
      message.error('Please upload a file!');
      return;
    }

    const fileList = files.map((file) => file.originFileObj).filter(Boolean);
    dispatch(uploadVisaDocument({ employeeId, fileType: 'i20Form', files: fileList }))
      .then(() => {
        message.success('I-20 Form upload successful');
        dispatch(fetchVisaStatus(employeeId));
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handlePreview = (fileUrl: string) => {
    setModalPdfUrl(fileUrl);
    setIsModalVisible(true);
  };

  const handleDownload = (fileUrl: string, employeeName: string, fileType: string, index: number) => {
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        const fileName = `${employeeName}_${fileType}_${index + 1}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => console.error('Error while downloading the file:', err));
  };

  const renderContent = () => {
    const status = visaStatus?.i20Form?.status;
    const i983Status = visaStatus?.i983Form?.status;

    if (status === 'Unsubmitted' && i983Status !== 'Approved') {
      return <p>Please upload your I-983 first before submitting your I-20.</p>;
    }

    switch (status) {
      case 'Unsubmitted':
        return (
          <>
            <p>Please upload your I-20 Form.</p>
            <Upload multiple onChange={handleFileChange} fileList={files} beforeUpload={() => false}>
              <Button>Select File</Button>
            </Upload>
            <Button type="primary" onClick={handleSubmit} className="mt-3">
              Upload I-20 Form
            </Button>
          </>
        );
      case 'Pending':
        return <p>Waiting for HR to approve your I-20 Form.</p>;
      case 'Approved':
        return <p>All documents have been approved.</p>;
      case 'Rejected':
        return (
          <>
            <p>Your I-20 Form was rejected. Feedback: {visaStatus.i20Form.feedback}</p>
            <Upload multiple onChange={handleFileChange} fileList={files} beforeUpload={() => false}>
              <Button>Select File</Button>
            </Upload>
            <Button type="primary" onClick={handleSubmit} className="mt-3">
              Re-upload I-20 Form
            </Button>
          </>
        );
      default:
        return <p>Unknown status.</p>;
    }
  };

  const fileBaseUrl = 'http://localhost:3000/';
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card title="I-20 Form" bordered={false} style={{ width: 400, textAlign: 'center' }}>
        {visaStatus?.i20Form?.status !== 'Unsubmitted' && visaStatus?.i20Form?.files?.length > 0 && (
          <div>
            <p>Uploaded Files:</p>
            {visaStatus.i20Form.files.map((file, index) => (
              <div key={index}>
                Document {index + 1}:{' '}
                <Button type="link" onClick={() => handlePreview(`${fileBaseUrl}${file}`)}>
                  Preview
                </Button>{' '}
                |{' '}
                <Button
                  type="link"
                  onClick={() =>
                    handleDownload(
                      `${fileBaseUrl}${file}`,
                      `${visaStatus?.employee?.firstName}${visaStatus?.employee?.lastName}`,
                      'i20Form',
                      index
                    )
                  }
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}

        {renderContent()}
        <Modal
          title="PDF Preview"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width="80%"
        >
          {modalPdfUrl && (
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
              <Viewer fileUrl={modalPdfUrl} />
            </Worker>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default I20FormSection;