import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVisaDocument } from '../../features/visaStatus/visaStatusSlice';
import { RootState } from '../../app/store';
import { Upload, Button, message, Card } from 'antd';

const OPTReceiptSection = ({ employeeId }: { employeeId: string }) => {
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
    dispatch(uploadVisaDocument({ employeeId, fileType: 'optReceipt', files: fileList }))
      .then(() => {
        message.success('OPT Receipt upload successful');
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const renderContent = () => {
    const status = visaStatus?.optReceipt?.status;
    // console.log('status', visaStatus);
    switch (status) {
      case 'Unsubmitted':
        return (
          <>
            <p>Please upload your OPT Receipt.</p>
            <Upload multiple onChange={handleFileChange} fileList={files}>
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
        return (
          <>
            <p>Your OPT Receipt is approved.</p>
          </>
        );
      case 'Rejected':
        return (
          <>
            <p>Your OPT Receipt was rejected. Feedback: {visaStatus.optReceipt.feedback}</p>
            <Upload multiple onChange={handleFileChange} fileList={files}>
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
  
  const fileBaseUrl = "http://localhost:3000/";
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card title="OPT Receipt" bordered={false} style={{ width: 400, textAlign: 'center' }}>
        
        {/* Conditionally render the previously uploaded file if status is not 'Unsubmitted' */}
        {visaStatus?.optReceipt?.status !== 'Unsubmitted' && visaStatus?.optReceipt?.files?.[0] && (
          <Button
            type="link"
            onClick={() => window.open(`${fileBaseUrl}${visaStatus.optReceipt.files[0]}`, '_blank')}
          >
            View Uploaded OPT Receipt
          </Button>
        )}
        
        {/* Render the rest of the content */}
        {renderContent()}
      </Card>
    </div>
  );
};

export default OPTReceiptSection;