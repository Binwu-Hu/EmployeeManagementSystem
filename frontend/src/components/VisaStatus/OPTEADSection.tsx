import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVisaDocument } from '../../features/visaStatus/visaStatusSlice';
import { RootState } from '../../app/store';
import { Upload, Button, message, Card } from 'antd';

const OPTEADSection = ({ employeeId }: { employeeId: string }) => {
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
    dispatch(uploadVisaDocument({ employeeId, fileType: 'optEAD', files: fileList }))
      .then(() => {
        message.success('OPT EAD upload successful');
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const renderContent = () => {
    const status = visaStatus?.optEAD?.status;
    const optReceiptStatus = visaStatus?.optReceipt?.status; // Check OPT Receipt status
    // console.log('status', status);
    if (status == 'Unsubmitted' && optReceiptStatus != 'Approved') {
      return <p>Please upload your OPT Receipt first before submitting your OPT EAD.</p>;
    }
    switch (status) {
      case 'Unsubmitted':
        return (
          <>
            <p>Please upload your OPT EAD.</p>
            <Upload multiple onChange={handleFileChange} fileList={files}>
              <Button>Select File</Button>
            </Upload>
            <Button type="primary" onClick={handleSubmit} className="mt-3">
              Upload OPT EAD
            </Button>
          </>
        );
      case 'Pending':
        return <p>Waiting for HR to approve your OPT EAD.</p>;
      case 'Approved':
        return <p>Your OPT EAD is approved.</p>;
      case 'Rejected':
        return (
          <>
            <p>Your OPT EAD was rejected. Feedback: {visaStatus.optEAD.feedback}</p>
            <Upload multiple onChange={handleFileChange} fileList={files}>
              <Button>Select File</Button>
            </Upload>
            <Button type="primary" onClick={handleSubmit} className="mt-3">
              Re-upload OPT EAD
            </Button>
          </>
        );
      default:
        return <p>Unknown status.</p>;
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card title="OPT EAD" bordered={false} style={{ width: 400, textAlign: 'center' }}>
        {renderContent()}
      </Card>
    </div>
  );
};

export default OPTEADSection;