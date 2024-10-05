import { AppDispatch, RootState } from '../../app/store';
import { Input, Table, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchAllApplications } from '../../features/application/applicationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const { Search } = Input;

const HiringManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, loading, error } = useSelector(
    (state: RootState) => state.application
  );

  const [filteredPending, setFilteredPending] = useState(
    applications?.pending || []
  );
  const [filteredRejected, setFilteredRejected] = useState(
    applications?.rejected || []
  );
  const [filteredApproved, setFilteredApproved] = useState(
    applications?.approved || []
  );

  useEffect(() => {
    dispatch(fetchAllApplications());
  }, [dispatch]);

  useEffect(() => {
    setFilteredPending(applications?.pending || []);
    setFilteredRejected(applications?.rejected || []);
    setFilteredApproved(applications?.approved || []);
  }, [applications]);

  const handleSearch = (value: string) => {
    const filterByName = (list: any[]) =>
      list.filter(
        (application) =>
          application.fullName?.toLowerCase().includes(value.toLowerCase()) ||
          application.email?.toLowerCase().includes(value.toLowerCase())
      );

    setFilteredPending(filterByName(applications?.pending || []));
    setFilteredRejected(filterByName(applications?.rejected || []));
    setFilteredApproved(filterByName(applications?.approved || []));
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Submitted At', dataIndex: 'submittedAt', key: 'submittedAt' },
    { title: 'Feedback', dataIndex: 'feedback', key: 'feedback' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: any) =>
        record.userId ? (
          <Link to={`/hiring/user/${record.userId}`} target='_blank'>
            <Button type='primary'>View Application</Button>
          </Link>
        ) : null,
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Application Management</h1>

      <Search
        placeholder='Search by name or email'
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: 20, maxWidth: 400 }}
      />

      <h2>Pending Applications</h2>
      <Table
        dataSource={filteredPending.map((application) => ({
          key: application.userId,
          fullName: application.fullName,
          email: application.email,
          submittedAt: new Date(application.submittedAt).toLocaleString(),
          feedback: application.feedback,
          employeeId: application.employeeId,
          userId: application.userId,
        }))}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />

      <h2>Rejected Applications</h2>
      <Table
        dataSource={filteredRejected.map((application) => ({
          key: application.userId,
          fullName: application.fullName,
          email: application.email,
          submittedAt: new Date(application.submittedAt).toLocaleString(),
          feedback: application.feedback,
          employeeId: application.employeeId,
          userId: application.userId,
        }))}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />

      <h2>Approved Applications</h2>
      <Table
        dataSource={filteredApproved.map((application) => ({
          key: application.userId,
          fullName: application.fullName,
          email: application.email,
          submittedAt: new Date(application.submittedAt).toLocaleString(),
          feedback: application.feedback,
          employeeId: application.employeeId,
          userId: application.userId,
        }))}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default HiringManagement;
