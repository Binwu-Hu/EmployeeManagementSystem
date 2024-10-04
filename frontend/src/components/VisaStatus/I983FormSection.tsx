import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVisaDocument } from '../../features/visaStatus/visaStatusSlice';
import { RootState } from '../../app/store';
import { Upload, Button, message, Card } from 'antd';

const I983FormSection = ({ employeeId }: { employeeId: string }) => {
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
    dispatch(uploadVisaDocument({ employeeId, fileType: 'i983Form', files: fileList }))
      .then(() => {
        message.success('I-983 Form upload successful');
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card
        title="I-983 Form"
        bordered={false}
        style={{ width: 400, textAlign: 'center' }}
      >
        {visaStatus?.visaStatus?.i983Form?.status !== 'Approved' ? (
          <>
            <p>Waiting for HR to approve your I-983 Form</p>
            <Upload multiple onChange={handleFileChange} fileList={files}>
              <Button>Select File</Button>
            </Upload>
            <Button type="primary" onClick={handleSubmit} className="mt-3">
              Upload I-983 Form
            </Button>
          </>
        ) : (
          <p>Your I-983 Form is approved.</p>
        )}
      </Card>
    </div>
  );
};

export default I983FormSection;
