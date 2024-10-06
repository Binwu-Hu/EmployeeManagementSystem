import { Employee } from '../../utils/type';
import React from 'react';
import WorkAuthorizationSection from './WorkAuthorizationSection';

interface EmploymentSectionProps {
  employee: Employee;
  isEditing: boolean;
  onChange: (field: string, value: any) => void;
  form: any;
}

const EmploymentSection: React.FC<EmploymentSectionProps> = ({
  employee,
  isEditing,
  onChange,
  form,
}) => {
  return (
    <>
      {isEditing ? (
        <WorkAuthorizationSection
          employee={employee}
          isEditing={isEditing}
          onChange={onChange}
          form={form}
        />
      ) : (
        <div className='bg-white p-4 rounded shadow-md'>
          <h2 className='text-xl font-semibold'>Employment</h2>
          <div>
            <p>
              <strong>Visa Type:</strong>{' '}
              {employee.workAuthorization?.visaType || ''}
            </p>
            <p>
              <strong>Start Date:</strong>{' '}
              {employee.workAuthorization?.startDate || ''}
            </p>
            <p>
              <strong>End Date:</strong>{' '}
              {employee.workAuthorization?.endDate || ''}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default EmploymentSection;
