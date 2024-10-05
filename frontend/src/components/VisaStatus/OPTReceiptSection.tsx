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

  console.log('visaStatus', visaStatus);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card
        title="OPT Receipt"
        bordered={false}
        style={{ width: 400, textAlign: 'center' }}
      >
        {visaStatus?.visaStatus.optReceipt?.status === 'Unsubmitted' && (
          <>
            <p>Please upload a copy of your OPT Receipt</p>
            <Upload multiple onChange={handleFileChange} fileList={files}>
              <Button>Select File</Button>
            </Upload>
            <Button type="primary" onClick={handleSubmit} className="mt-3">
              Upload OPT Receipt
            </Button>
          </>
        )}
        {visaStatus?.visaStatus.optReceipt?.status === 'Pending' && <p>Waiting for HR to approve your OPT Receipt</p>}
        {visaStatus?.visaStatus.optReceipt?.status === 'Approved' && (
          <>
            <p>OPT Receipt Approved</p>
            {visaStatus.optReceipt?.files?.[0] && (
              <Button type="link" onClick={() => window.open(visaStatus.visaStatus.optReceipt.files[0], '_blank')}>
                View Uploaded OPT Receipt
              </Button>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default OPTReceiptSection;