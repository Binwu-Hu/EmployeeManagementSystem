import React, { useEffect, useState } from 'react';
import { Table, Input } from 'antd';
import { fetchVisaStatusesApi } from '../../api/visaStatus';

const { Search } = Input;

const VisaStatusInProgress: React.FC = () => {
  const [visaStatuses, setVisaStatuses] = useState<VisaStatusType[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<VisaStatusType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchVisaStatusesApi();
        setVisaStatuses(response);
        setFilteredStatuses(response);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (value: string) => {
    const filteredData = visaStatuses.filter((status: any) =>
      `${status.employee.firstName} ${status.employee.lastName}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStatuses(filteredData);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'employee',
      key: 'name',
      render: (employee: any) => `${employee.firstName} ${employee.lastName}`,
    },
    {
      title: 'SSN',
      dataIndex: 'employee',
      key: 'ssn',
      render: (employee: any) => employee.ssn || 'N/A',
    },
    {
      title: 'Work Authorization',
      dataIndex: 'visaType',
      key: 'visaType',
    },
    {
      title: 'OPT Receipt Status',
      dataIndex: 'optReceipt',
      key: 'optReceipt',
      render: (optReceipt: any) => optReceipt?.status || 'N/A',
    },
    {
      title: 'OPT EAD Status',
      dataIndex: 'optEAD',
      key: 'optEAD',
      render: (optEAD: any) => optEAD?.status || 'N/A',
    },
    {
      title: 'I-983 Form Status',
      dataIndex: 'i983Form',
      key: 'i983Form',
      render: (i983Form: any) => i983Form?.status || 'N/A',
    },
    {
      title: 'I-20 Form Status',
      dataIndex: 'i20Form',
      key: 'i20Form',
      render: (i20Form: any) => i20Form?.status || 'N/A',
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Search
        placeholder="Search by employee name"
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: 20, maxWidth: 400 }}
      />
      <Table
        dataSource={filteredStatuses.map((status: any) => ({
          key: status._id,
          employee: status.employee,
          visaType: status.visaType,
          optReceipt: status.optReceipt,
          optEAD: status.optEAD,
          i983Form: status.i983Form,
          i20Form: status.i20Form,
        }))}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default VisaStatusInProgress;