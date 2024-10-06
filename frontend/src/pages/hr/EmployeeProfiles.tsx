import { AppDispatch, RootState } from '../../app/store';
import { Input, Table, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  fetchEmployees,
  setSelectedEmployee,
} from '../../features/employee/employeeSlice';
import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

const { Search } = Input;

const EmployeeProfilesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error } = useSelector(
    (state: RootState) => state.employee
  );

  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    setFilteredEmployees(employees); // Update the filtered list when employees are loaded
  }, [employees]);

  const handleSearch = (value: string) => {
    const filtered = employees.filter(
      (employee) =>
        employee.firstName?.toLowerCase().includes(value.toLowerCase()) ||
        employee.lastName?.toLowerCase().includes(value.toLowerCase()) ||
        employee.preferredName?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const handleEmployeeClick = (employee: any) => {
    dispatch(setSelectedEmployee(employee));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Link
          to={`/employees/user/${record.userId}`}
          target='_blank'
          onClick={() => handleEmployeeClick(record)}
        >
          {text}
        </Link>
      ),
    },
    { title: 'SSN', dataIndex: 'ssn', key: 'ssn' },
    {
      title: 'Work Authorization Title',
      dataIndex: 'workAuthorization',
      key: 'workAuthorization',
    },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
  ];

  if (loading)
    return (
      <div className='flex justify-center items-center h-96'>
        <Spin size='large' />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Employee Profiles</h1>

      <Search
        placeholder='Search by first name, last name, or preferred name'
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: 20, maxWidth: 400 }}
      />

      <Table
        dataSource={filteredEmployees.map((employee) => ({
          key: employee._id,
          name: `${employee.firstName} ${employee.lastName}`,
          userId: employee.userId,
          ssn: employee.ssn,
          workAuthorization: employee.workAuthorization?.visaType || 'N/A',
          phone: employee.phone?.cellPhone || 'N/A',
          email: employee.email,
        }))}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default EmployeeProfilesPage;
