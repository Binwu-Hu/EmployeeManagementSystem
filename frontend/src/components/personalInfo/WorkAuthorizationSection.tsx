import { Button, DatePicker, Form, Input, Radio, Upload } from 'antd';

import { Employee } from '../../utils/type';
import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

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
          ...(employee.workAuthorization?.visaType === 'F1' && {
            permanentResident: 'No',
            visaType: 'F1',
          }),
        }}
      >
        <Form.Item
          label='Are you a permanent resident or citizen of the U.S.?'
          name='permanentResident'
          rules={[{ required: true, message: 'This field is required' }]}
        >
          <Radio.Group
            disabled={unchangeable || !isEditing}
            onChange={(e) =>
              onChange('workAuthorization.visaType', e.target.value)
            }
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
              onChange={(e) =>
                onChange('workAuthorization.visaType', e.target.value)
              }
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
                onChange={(e) =>
                  onChange('workAuthorization.visaType', e.target.value)
                }
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
              <Form.Item label='Upload OPT Receipt'>
                <Upload
                  disabled={unchangeable || !isEditing}
                  onChange={(info) =>
                    onChange('documents.workAuthorization', info.file.name)
                  }
                >
                  <Button
                    icon={<UploadOutlined />}
                    disabled={unchangeable || !isEditing}
                  >
                    Upload OPT Receipt
                  </Button>
                </Upload>
              </Form.Item>
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
