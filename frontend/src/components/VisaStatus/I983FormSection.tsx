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

  // Base URL for serving uploaded files
  const fileBaseUrl = "http://localhost:3000/";

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card title="I-983 Form" bordered={false} style={{ width: 400, textAlign: 'center' }}>
        
        {/* Always display the two template buttons */}
        <div style={{ marginBottom: '20px' }}>
          <p>Download/Preview Templates:</p>

          <div style={{ marginBottom: '10px' }}>
            <Button
              type="link"
              href="http://localhost:3000/static/i983-empty-template.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Preview Empty Template
            </Button>
            <a
              href="http://localhost:3000/static/i983-empty-template.pdf"
              download="I-983_Empty_Template.pdf"
            >
              <Button>Download Empty Template</Button>
            </a>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <Button
              type="link"
              href="http://localhost:3000/static/i983-sample-template.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Preview Sample Template
            </Button>
            <a
              href="http://localhost:3000/static/i983-sample-template.pdf"
              download="I-983_Sample_Template.pdf"
            >
              <Button>Download Sample Template</Button>
            </a>
          </div>
        </div>

        {/* Conditionally render the previously uploaded file if status is not 'Unsubmitted' */}
        {visaStatus?.i983Form?.status !== 'Unsubmitted' && visaStatus?.i983Form?.files?.[0] && (
          <Button
            type="link"
            onClick={() => window.open(`${fileBaseUrl}${visaStatus.i983Form.files[0]}`, '_blank')}
          >
            View Uploaded I-983 Form
          </Button>
        )}
        
        {/* Render the rest of the content based on the form status */}
        {renderContent()}
      </Card>
    </div>
  );
};

export default I983FormSection;
