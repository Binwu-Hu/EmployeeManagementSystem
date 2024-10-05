import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVisaDocument } from '../../features/visaStatus/visaStatusSlice';
import { RootState } from '../../app/store';
import { Upload, Button, message, Card } from 'antd';

const I20FormSection = ({ employeeId }: { employeeId: string }) => {
  const dispatch = useDispatch();
  const { visaStatus } = useSelector((state: RootState) => state.visaStatus);
  const [files, setFiles] = React.useState([]);

  const handleFileChange = (info: any) => {
    setFiles(info.fileList);
  };

  const handleSubmit = () => {
    if (!files.length) {
      message.error('Please upload a file!');
      return;
    }

    const fileList = files.map(file => file.originFileObj).filter(Boolean);
    dispatch(uploadVisaDocument({ employeeId, fileType: 'i20Form', files: fileList }))
      .then(() => {
        message.success('I-20 Form upload successful');
      })
      .catch((error) => {
        message.error(error.message);
      });
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
            <Upload multiple onChange={handleFileChange} fileList={files}>
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
            <Upload multiple onChange={handleFileChange} fileList={files}>
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

  // Base URL for serving uploaded files
  const fileBaseUrl = "http://localhost:3000/";

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card title="I-20 Form" bordered={false} style={{ width: 400, textAlign: 'center' }}>
        
        {/* Conditionally render the previously uploaded file if status is not 'Unsubmitted' */}
        {visaStatus?.i20Form?.status !== 'Unsubmitted' && visaStatus?.i20Form?.files?.[0] && (
          <Button
            type="link"
            onClick={() => window.open(`${fileBaseUrl}${visaStatus.i20Form.files[0]}`, '_blank')}
          >
            View Uploaded I-20 Form
          </Button>
        )}
        
        {/* Render the rest of the content */}
        {renderContent()}
      </Card>
    </div>
  );
};

export default I20FormSection;
