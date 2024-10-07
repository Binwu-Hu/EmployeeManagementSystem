import { AppDispatch, RootState } from '../../app/store';
import { Button, DatePicker, Form, Input, Radio, Upload, message } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Employee } from '../../utils/type';
import moment from 'moment';
import { uploadEmployeeFile } from '../../features/employee/employeeSlice';

interface WorkAuthorizationSectionProps {
  employee: Employee;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
  form: any;
  unchangeable: boolean;
}

const WorkAuthorizationSection: React.FC<WorkAuthorizationSectionProps> = ({
  employee,
  isEditing,
  onChange,
  form,
  unchangeable,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const [uploadedFiles, setUploadedFiles] = useState<string[]>(
    employee?.workAuthorization?.files || []
  );

  const handleUpload = (file: any) => {
    const userId = user?.id;
    if (userId) {
      dispatch(uploadEmployeeFile({ userId, file, visaType: 'F1' }))
        .unwrap()
        .then(({ filePath }) => {
          const newFiles = [...uploadedFiles, filePath];
          setUploadedFiles(newFiles);

          // Update the OPT receipt field with the file path
          onChange('workAuthorization.files', newFiles);
          message.success('OPT Receipt uploaded successfully!');
        })
        .catch((error) => {
          message.error('Failed to upload OPT Receipt');
        });
    }
  };

  const handleFileRemove = (filePath: string) => {
    const updatedFiles = uploadedFiles.filter((file) => file !== filePath);
    setUploadedFiles(updatedFiles);
    onChange('workAuthorization.files', updatedFiles);

    message.success('File removed successfully');
  };

  // Use form.setFieldsValue to explicitly set form values on change
  const handleVisaTypeChange = (e: any) => {
    form.setFieldsValue({ visaType: e.target.value });
    onChange('workAuthorization.visaType', e.target.value);
  };

  return (
    <div className='bg-white p-4 rounded shadow-md'>
      <h2 className='text-xl font-semibold'>Work Authorization</h2>
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          permanentResident:
            employee.workAuthorization?.visaType === 'Citizen' ||
            employee.workAuthorization?.visaType === 'Green Card'
              ? 'Yes'
              : 'No',
          visaType: employee.workAuthorization?.visaType || undefined,
        }}
      >
        <Form.Item
          label='Are you a permanent resident or citizen of the U.S.?'
          name='permanentResident'
          rules={[{ required: true, message: 'This field is required' }]}
        >
          <Radio.Group
            disabled={unchangeable || !isEditing}
            onChange={(e) => {
              form.setFieldsValue({ permanentResident: e.target.value });
              onChange('workAuthorization.permanentResident', e.target.value);
            }}
          >
            <Radio value='Yes'>Yes</Radio>
            <Radio value='No'>No</Radio>
          </Radio.Group>
        </Form.Item>

        {form.getFieldValue('permanentResident') === 'Yes' && (
          <Form.Item
            name='visaType'
            label='Select your status'
            rules={[
              {
                required: true,
                message: 'Please select either Green Card or Citizen',
              },
            ]}
          >
            <Radio.Group
              disabled={unchangeable || !isEditing}
              onChange={handleVisaTypeChange}
            >
              <Radio value='Green Card'>Green Card</Radio>
              <Radio value='Citizen'>Citizen</Radio>
            </Radio.Group>
          </Form.Item>
        )}

        {form.getFieldValue('permanentResident') === 'No' && (
          <>
            <Form.Item
              name='visaType'
              label='Work Authorization Type'
              rules={[
                {
                  required: true,
                  message: 'Work Authorization Type is required',
                },
              ]}
            >
              <Radio.Group
                disabled={unchangeable || !isEditing}
                onChange={handleVisaTypeChange}
              >
                <Radio value='H1-B'>H1-B</Radio>
                <Radio value='L2'>L2</Radio>
                <Radio value='F1'>F1 (CPT/OPT)</Radio>
                <Radio value='H4'>H4</Radio>
                <Radio value='Other'>Other</Radio>
              </Radio.Group>
            </Form.Item>

            {/* Show Upload Field Only if Visa Type is F1 */}
            {form.getFieldValue('visaType') === 'F1' && (
              <>
                <Form.Item
                  label='Upload OPT Receipt'
                  name='optReceipt'
                  rules={[
                    {
                      required: form.getFieldValue('visaType') === 'F1',
                      message: 'OPT Receipt is required for F1 visa type',
                    },
                  ]}
                >
                  <Upload
                    listType='text'
                    accept='.pdf' // Accept only PDF files
                    disabled={unchangeable || !isEditing}
                    beforeUpload={(file) => {
                      handleUpload(file);
                      return false;
                    }}
                    showUploadList={false}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      disabled={unchangeable || !isEditing}
                    >
                      Upload OPT Receipt
                    </Button>
                  </Upload>
                </Form.Item>
                <ul>
                  {uploadedFiles.map((filePath) => (
                    <li key={filePath} className='flex items-center space-x-2'>
                      <a
                        href={`http://localhost:3000${filePath}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {filePath.split('/').pop()}{' '}
                        {/* Display the file name */}
                      </a>
                      {isEditing && (
                        <Button
                          type='link'
                          icon={<DeleteOutlined />}
                          onClick={() => handleFileRemove(filePath)}
                        >
                          Remove
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {form.getFieldValue('visaType') === 'Other' && (
              <Form.Item
                name='visaTitle'
                label='Please specify your visa title'
                rules={[{ required: true, message: 'Visa title is required' }]}
              >
                <Input
                  disabled={unchangeable || !isEditing}
                  onChange={(e) =>
                    onChange('workAuthorization.visaTitle', e.target.value)
                  }
                />
              </Form.Item>
            )}

            {/* Start Date and End Date Fields */}
            <Form.Item name='startDate' label='Start Date'>
              <DatePicker
                disabled={unchangeable || !isEditing}
                onChange={(date) =>
                  onChange('workAuthorization.startDate', date?.toISOString())
                }
                defaultValue={
                  employee.workAuthorization?.startDate
                    ? moment(employee.workAuthorization?.startDate)
                    : undefined
                }
              />
            </Form.Item>

            <Form.Item name='endDate' label='End Date'>
              <DatePicker
                disabled={unchangeable || !isEditing}
                onChange={(date) =>
                  onChange('workAuthorization.endDate', date?.toISOString())
                }
                defaultValue={
                  employee.workAuthorization?.endDate
                    ? moment(employee.workAuthorization?.endDate)
                    : undefined
                }
              />
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};

export default WorkAuthorizationSection;
