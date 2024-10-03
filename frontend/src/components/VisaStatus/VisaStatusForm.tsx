import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVisaDocument } from '../../features/visaStatus/visaStatusSlice';
import { RootState } from '../../app/store';
import { Select, Upload, Button, message } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';

const VisaStatusForm = ({ employeeId }: { employeeId: string }) => {
  const dispatch = useDispatch();
  const { visaStatus } = useSelector((state: RootState) => state.visaStatus);

  const [fileType, setFileType] = useState('optReceipt');
  const [files, setFiles] = useState<UploadFile[]>([]);

  const handleFileChange = (info: any) => {
    console.log('FileList:', info.fileList);
    setFiles(info.fileList);
  };

  const handleSubmit = () => {
    if (!files.length) {
      message.error('Please upload a file!');
      return;
    }

    // Extract the original File objects
    const fileList = files.map(file => file.originFileObj).filter(Boolean);

    console.log('files', fileList);
    console.log('fileType', fileType);  
    dispatch(uploadVisaDocument({ employeeId, fileType, files: fileList }))
    .then((res) => {
      console.log('Upload success:', res);
    })
    .catch((error) => {
      message.error(error.message); 
      console.error('Upload error:', error);
    });

  };

  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold">Upload Visa Document</h2>
      {/* ... rest of your component ... */}

      <Select
        value={fileType}
        onChange={setFileType}
        className="mb-3"
        disabled={visaStatus?.optReceipt?.status !== 'Approved' && fileType !== 'optReceipt'}
      >
        {/* ... options ... */}
      </Select>

      <Upload
        multiple
        beforeUpload={() => false} 
        fileList={files}
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