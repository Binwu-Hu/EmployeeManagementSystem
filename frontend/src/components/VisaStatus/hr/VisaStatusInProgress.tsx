import React, { useEffect, useState } from 'react';
import { Table, Input, Button } from 'antd';
import { fetchVisaStatusesApi } from '../../../api/visaStatus';
import moment from 'moment';

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

  const getDaysRemaining = (endDate: string) => {
    const today = moment();
    const end = moment(endDate);
    return end.diff(today, 'days');
  };

  const getNextStep = (visaStatus: any) => {
    if (visaStatus.optReceipt.status === 'Pending') return 'Wait for OPT Receipt approval';
    if (visaStatus.optEAD.status === 'Pending') return 'Wait for OPT EAD approval';
    if (visaStatus.i983Form.status === 'Pending') return 'Wait for I-983 Form approval';
    if (visaStatus.i20Form.status === 'Pending') return 'Wait for I-20 Form approval';

    if (visaStatus.optReceipt.status === 'Unsubmitted') return 'Submit OPT Receipt';
    if (visaStatus.optEAD.status === 'Unsubmitted') return 'Submit OPT EAD';
    if (visaStatus.i983Form.status === 'Unsubmitted') return 'Submit I-983 Form';
    if (visaStatus.i20Form.status === 'Unsubmitted') return 'Submit I-20 Form';

    return 'All documents approved';
  };

  const handleAction = (visaStatus: any) => {
    if (getNextStep(visaStatus).includes('Submit')) {
      return <Button type="primary">Send Notification</Button>;
    }
    return null;
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
      title: 'Number of Days Remaining',
      key: 'daysRemaining',
      render: (visaStatus: any) =>
        visaStatus.employee.workAuthorization.endDate
          ? getDaysRemaining(visaStatus.employee.workAuthorization.endDate)
          : 'N/A',
    },
    {
      title: 'Next Steps',
      key: 'nextSteps',
      render: (visaStatus: any) => getNextStep(visaStatus),
    },
    {
      title: 'Action',
      key: 'action',
      render: (visaStatus: any) => handleAction(visaStatus),
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