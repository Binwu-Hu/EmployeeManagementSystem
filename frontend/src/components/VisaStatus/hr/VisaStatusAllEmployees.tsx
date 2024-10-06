import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Modal } from 'antd';
import { fetchVisaStatusesApi } from '../../../api/visaStatus';
import moment from 'moment';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const { Search } = Input;

const VisaStatusAllEmployees: React.FC = () => {
  const [visaStatuses, setVisaStatuses] = useState<any[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<any[]>([]);
  const [visaTypeFilters, setVisaTypeFilters] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalPdfUrl, setModalPdfUrl] = useState<string | null>(null);

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

  const handlePreview = (fileUrl: string) => {
    setModalPdfUrl(fileUrl);
    setIsModalVisible(true);
  };

  const handleDownload = (fileUrl: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = ''; // 这里可以设置文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFileLink = (files: string[]) => {
    return files?.map((file, index) => (
      <div key={index}>
        <Button type="link" onClick={() => handlePreview(`http://localhost:3000/${file}`)}>
          Preview
        </Button>
        |
        <Button type="link" onClick={() => handleDownload(`http://localhost:3000/${file}`)}>
          Download
        </Button>
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
      filters: visaTypeFilters,
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
      <Modal
        title="PDF Preview"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width="80%"
      >
        {modalPdfUrl && (
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <Viewer fileUrl={modalPdfUrl} />
          </Worker>
        )}
      </Modal>
    </div>
  );
};

export default VisaStatusAllEmployees;