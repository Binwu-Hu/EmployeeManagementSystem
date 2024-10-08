import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVisaDocument, fetchVisaStatus } from '../../features/visaStatus/visaStatusSlice';
import { RootState } from '../../app/store';
import { Upload, Button, message, Card, Modal } from 'antd';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const OPTReceiptSection = ({ employeeId }: { employeeId: string }) => {
  const dispatch = useDispatch();
  const { visaStatus } = useSelector((state: RootState) => state.visaStatus);
  const [files, setFiles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPdfUrl, setModalPdfUrl] = useState<string | null>(null);

  // Handle file change and only set file, do not auto-upload
  const handleFileChange = (info: any) => {
    setFiles(info.fileList);
    const fileNames = info.fileList.map((file: any) => file.name);
    console.log("Uploaded file names:", fileNames);
  };

  // Handle the manual upload on button click
  const handleSubmit = () => {
    if (!files.length) {
      message.error('Please upload a file!');
      return;
    }

    const fileList = files.map((file) => file.originFileObj).filter(Boolean);
    dispatch(uploadVisaDocument({ employeeId, fileType: 'optReceipt', files: fileList }))
      .then(() => {
        message.success('OPT Receipt upload successful');
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
    const status = visaStatus?.optReceipt?.status;
    switch (status) {
      case 'Unsubmitted':
        return (
          <>
            <p>Please upload your OPT Receipt.</p>
            <Upload
              multiple
              onChange={handleFileChange}
              fileList={files}
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button>Select File</Button>
            </Upload>
            <Button type="primary" onClick={handleSubmit} className="mt-3">
              Upload OPT Receipt
            </Button>
          </>
        );
      case 'Pending':
        return <p>Waiting for HR to approve your OPT Receipt.</p>;
      case 'Approved':
        return <p>Your OPT Receipt is approved.</p>;
      case 'Rejected':
        return (
          <>
            <p>Your OPT Receipt was rejected. Feedback: {visaStatus.optReceipt.feedback}</p>
            <Upload
              multiple
              onChange={handleFileChange}
              fileList={files}
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button>Select File</Button>
            </Upload>
            <Button type="primary" onClick={handleSubmit} className="mt-3">
              Re-upload OPT Receipt
            </Button>
          </>
        );
      default:
        return <p>Unknown status.</p>;
    }
  };

  const fileBaseUrl = 'http://localhost:3000';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card title="OPT Receipt" bordered={false} style={{ width: 400, textAlign: 'center' }}>
        {/* Conditionally render the previously uploaded file if status is not 'Unsubmitted' */}
        {visaStatus?.optReceipt?.status !== 'Unsubmitted' && visaStatus?.optReceipt?.files?.length > 0 && (
          <div>
            <p>Uploaded Files:</p>
            {visaStatus.optReceipt.files.map((file, index) => (
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
                      'optReceipt',
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

        {/* Render the rest of the content */}
        {renderContent()}

        {/* Modal to preview the PDF */}
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

export default OPTReceiptSection;