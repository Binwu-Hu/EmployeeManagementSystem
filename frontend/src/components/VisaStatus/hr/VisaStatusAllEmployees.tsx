import React, { useEffect, useState } from 'react';
import { Table, Input } from 'antd';
import { fetchVisaStatusesApi } from '../../../api/visaStatus';
import moment from 'moment';

const { Search } = Input;

const VisaStatusAllEmployees: React.FC = () => {
  const [visaStatuses, setVisaStatuses] = useState<any[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<any[]>([]);
  const [visaTypeFilters, setVisaTypeFilters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchVisaStatusesApi();
        setVisaStatuses(response);
        setFilteredStatuses(response); 

        const uniqueVisaTypes = Array.from(new Set(response.map((status: any) => status.employee.workAuthorization.visaType)));
        setVisaTypeFilters(uniqueVisaTypes.map(visaType => ({
          text: visaType,
          value: visaType,
        })));

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

  const renderFileLink = (files: string[]) => {
    return files?.map((file, index) => (
      <div key={index}>
        <a href={`http://localhost:3000/${file}`} target="_blank" rel="noopener noreferrer">
          Preview
        </a>{' '}
        |{' '}
        <a href={`http://localhost:3000/${file}`} download>
          Download
        </a>
      </div>
    ));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'employee',
      key: 'name',
      render: (employee: any) => `${employee.firstName} ${employee.lastName}`,
    },
    {
      title: 'Work Authorization',
      dataIndex: 'employee',
      key: 'visaType',
      filters: visaTypeFilters,  // 使用生成的 visaTypeFilters 进行筛选
      onFilter: (value: any, record: any) => record.employee.workAuthorization.visaType === value,
      render: (employee: any) => employee.workAuthorization.visaType,
    },
    {
      title: 'Start Date',
      dataIndex: 'employee',
      key: 'startDate',
      render: (employee: any) =>
        employee.workAuthorization.startDate
          ? moment(employee.workAuthorization.startDate).format('YYYY-MM-DD')
          : 'N/A',
    },
    {
      title: 'End Date',
      dataIndex: 'employee',
      key: 'endDate',
      render: (employee: any) =>
        employee.workAuthorization.endDate
          ? moment(employee.workAuthorization.endDate).format('YYYY-MM-DD')
          : 'N/A',
    },
    {
      title: 'OPT Receipt Files',
      dataIndex: 'optReceipt',
      key: 'optReceiptFiles',
      render: (optReceipt: any) => (optReceipt.status === 'Approved' ? renderFileLink(optReceipt.files) : 'N/A'),
    },
    {
      title: 'OPT EAD Files',
      dataIndex: 'optEAD',
      key: 'optEADFiles',
      render: (optEAD: any) => (optEAD.status === 'Approved' ? renderFileLink(optEAD.files) : 'N/A'),
    },
    {
      title: 'I-983 Form Files',
      dataIndex: 'i983Form',
      key: 'i983FormFiles',
      render: (i983Form: any) => (i983Form.status === 'Approved' ? renderFileLink(i983Form.files) : 'N/A'),
    },
    {
      title: 'I-20 Form Files',
      dataIndex: 'i20Form',
      key: 'i20FormFiles',
      render: (i20Form: any) => (i20Form.status === 'Approved' ? renderFileLink(i20Form.files) : 'N/A'),
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

export default VisaStatusAllEmployees;