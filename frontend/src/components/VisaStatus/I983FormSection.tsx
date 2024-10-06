import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVisaDocument, fetchVisaStatus } from '../../features/visaStatus/visaStatusSlice';
import { RootState } from '../../app/store';
import { Upload, Button, message, Card, Modal } from 'antd';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const I983FormSection = ({ employeeId }: { employeeId: string }) => {
  const dispatch = useDispatch();
  const { visaStatus } = useSelector((state: RootState) => state.visaStatus);
  const [files, setFiles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPdfUrl, setModalPdfUrl] = useState<string | null>(null);

  const base_url = "http://localhost:3000";

  const handleFileChange = (info: any) => {
    setFiles(info.fileList);
  };

  const handleSubmit = () => {
    if (!files.length) {
      message.error('Please upload a file!');
      return;
    }

    const fileList = files.map((file) => file.originFileObj).filter(Boolean);
    dispatch(uploadVisaDocument({ employeeId, fileType: 'i983Form', files: fileList }))
      .then(() => {
        message.success('I-983 Form upload successful');
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

  const renderFileLink = (files: string[], employeeName: string, fileType: string) => {
    return files?.map((file, index) => (
      <div key={index}>
        <span>Document {index + 1} : </span>
        <Button type="link" onClick={() => handlePreview(`${base_url}/${file}`)}>
          Preview
        </Button>
        |
        <Button type="link" onClick={() => handleDownload(`${base_url}/${file}`, employeeName, fileType, index)}>
          Download
        </Button>
      </div>
    ));
  };

  const renderContent = () => {
    const status = visaStatus?.i983Form?.status;
    const OPTEADStatus = visaStatus?.optEAD?.status;

    if (status === 'Unsubmitted' && OPTEADStatus !== 'Approved') {
      return <p>Please upload your OPT EAD first before submitting your I-983.</p>;
    }

    switch (status) {
      case 'Unsubmitted':
        return (
          <>
            <p>Please upload your I-983 Form.</p>
            <Upload multiple onChange={handleFileChange} fileList={files} beforeUpload={() => false}>
              <Button>Select File</Button>
            </Upload>
            <Button type="primary" onClick={handleSubmit} className="mt-3">
              Upload I-983 Form
            </Button>
          </>
        );
      case 'Pending':
        return <p>Waiting for HR to approve and sign your I-983 Form.</p>;
      case 'Approved':
        return <p>Your I-983 Form is approved. Please upload a copy of your I-20 form.</p>;
      case 'Rejected':
        return (
          <>
            <p>Your I-983 Form was rejected. Feedback: {visaStatus.i983Form.feedback}</p>
            <Upload multiple onChange={handleFileChange} fileList={files} beforeUpload={() => false}>
              <Button>Select File</Button>
            </Upload>
            <Button type="primary" onClick={handleSubmit} className="mt-3">
              Re-upload I-983 Form
            </Button>
          </>
        );
      default:
        return <p>Unknown status.</p>;
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card title="I-983 Form" bordered={false} style={{ width: 400, textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <p>Download/Preview Templates:</p>

          <div style={{ marginBottom: '10px' }}>
            <Button type="link" onClick={() => handlePreview(`${base_url}/static/i983-empty-template.pdf`)}>
              Preview Empty Template
            </Button>
            <Button
              onClick={() =>
                handleDownload(
                  `${base_url}/static/i983-empty-template.pdf`,
                  `${visaStatus?.employee?.firstName}${visaStatus?.employee?.lastName}`,
                  'i983-empty-template'
                )
              }
            >
              Download Empty Template
            </Button>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <Button type="link" onClick={() => handlePreview(`${base_url}/static/i983-sample-template.pdf`)}>
              Preview Sample Template
            </Button>
            <Button
              onClick={() =>
                handleDownload(
                  `${base_url}/static/i983-sample-template.pdf`,
                  `${visaStatus?.employee?.firstName}${visaStatus?.employee?.lastName}`,
                  'i983-sample-template'
                )
              }
            >
              Download Sample Template
            </Button>
          </div>
        </div>

        {visaStatus?.i983Form?.status !== 'Unsubmitted' && visaStatus?.i983Form?.files?.[0] && (
          <div>
            <p>Uploaded Files:</p>
            {renderFileLink(
              visaStatus.i983Form.files,
              `${visaStatus?.employee?.firstName}${visaStatus?.employee?.lastName}`,
              'i983Form'
            )}
          </div>
        )}

        {renderContent()}
      </Card>

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
    </div>
  );
};

export default I983FormSection;