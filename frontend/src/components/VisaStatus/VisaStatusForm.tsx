import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVisaDocument } from '../../features/visaStatus/visaStatusSlice';
import { RootState } from '../../app/store';
import { Select, Upload, Button, message } from 'antd';

const VisaStatusForm = ({ employeeId }: { employeeId: string }) => {
  const dispatch = useDispatch();
  const { visaStatus } = useSelector((state: RootState) => state.visaStatus);

  const [fileType, setFileType] = useState('optReceipt');
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (info: any) => {
    setFiles(info.fileList);
  };

  const handleSubmit = () => {
    if (!files.length) {
      message.error('Please upload a file!');
      return;
    }
    dispatch(uploadVisaDocument({ employeeId, fileType, files }));
  };

  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold">Upload Visa Document</h2>
      {visaStatus?.optReceipt?.status !== 'Approved' && (
        <p>Waiting for HR to approve your OPT Receipt before you can upload the next document.</p>
      )}
      {visaStatus?.optReceipt?.status === 'Approved' && visaStatus?.optEAD?.status !== 'Approved' && (
        <p>Please upload a copy of your OPT EAD.</p>
      )}
      {visaStatus?.optEAD?.status === 'Approved' && visaStatus?.i983Form?.status !== 'Approved' && (
        <p>Please upload the I-983 Form.</p>
      )}

      <Select
        value={fileType}
        onChange={setFileType}
        className="mb-3"
        disabled={
          (fileType === 'optEAD' && visaStatus?.optReceipt?.status !== 'Approved') ||
          (fileType === 'i983Form' && visaStatus?.optEAD?.status !== 'Approved') ||
          (fileType === 'i20Form' && visaStatus?.i983Form?.status !== 'Approved')
        }
      >
        <Select.Option value="optReceipt">OPT Receipt</Select.Option>
        <Select.Option value="optEAD">OPT EAD</Select.Option>
        <Select.Option value="i983Form">I-983 Form</Select.Option>
        <Select.Option value="i20Form">I-20 Form</Select.Option>
      </Select>

      <Upload
        multiple
        onChange={handleFileChange}
        disabled={
          (fileType === 'optEAD' && visaStatus?.optReceipt?.status !== 'Approved') ||
          (fileType === 'i983Form' && visaStatus?.optEAD?.status !== 'Approved') ||
          (fileType === 'i20Form' && visaStatus?.i983Form?.status !== 'Approved')
        }
      >
        <Button>Select File</Button>
      </Upload>

      <Button type="primary" onClick={handleSubmit} className="mt-3">
        Upload Document
      </Button>
    </div>
  );
};

export default VisaStatusForm;