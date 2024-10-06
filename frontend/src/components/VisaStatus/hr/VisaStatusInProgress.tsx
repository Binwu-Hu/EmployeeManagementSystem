import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, Input as AntInput } from 'antd';
import { fetchVisaStatusesApi } from '../../../api/visaStatus';
import moment from 'moment';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const { Search } = Input;
const { TextArea } = AntInput;

const VisaStatusInProgress: React.FC = () => {
  const [visaStatuses, setVisaStatuses] = useState<VisaStatusType[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<VisaStatusType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [pdfFile, setPdfFile] = useState<string | null>(null); // URL of the PDF file

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

  const handleViewDocument = (document: string) => {
    const correctPath = document.startsWith('http')
      ? document
      : `http://localhost:3000/${document}`;

    console.log('correctPath', correctPath);

    setPdfFile(correctPath); // Set the URL of the PDF file
    setIsModalVisible(true);
  };

  const handleApproveReject = (visaStatus: any, status: 'Approved' | 'Rejected') => {
    setSelectedDocument(visaStatus); // Select the document to process
    setIsModalVisible(true); // Open modal
  };

  const handleModalSubmit = () => {
    // Submit approval result and feedback
    setIsModalVisible(false);
    setFeedback('');
    setPdfFile(null); // Clear current PDF preview
  };

  const handleAction = (visaStatus: any) => {
    const pendingDocs = [
      { name: 'OPT Receipt', status: visaStatus.optReceipt.status, files: visaStatus.optReceipt.files },
      { name: 'OPT EAD', status: visaStatus.optEAD.status, files: visaStatus.optEAD.files },
      { name: 'I-983 Form', status: visaStatus.i983Form.status, files: visaStatus.i983Form.files },
      { name: 'I-20 Form', status: visaStatus.i20Form.status, files: visaStatus.i20Form.files }
    ];

    const pendingDoc = pendingDocs.find(doc => doc.status === 'Pending');

    if (pendingDoc) {
      return (
        <>
          <Button onClick={() => handleViewDocument(pendingDoc.files[0])}>View</Button>
          <Button type="primary" onClick={() => handleApproveReject(visaStatus, 'Approved')}>Approve</Button>
          <Button danger onClick={() => handleApproveReject(visaStatus, 'Rejected')}>Reject</Button>
        </>
      );
    } else {
      return <Button type="primary">Send Notification</Button>;
    }
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

      <Modal
        title="Approve or Reject Document"
        visible={isModalVisible}
        onOk={handleModalSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          setPdfFile(null); // Clear PDF preview
        }}
        width={800} // Increase modal width
      >
        {pdfFile ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div style={{ height: '750px' }}>
              <Viewer fileUrl={pdfFile} />
            </div>
          </Worker>
        ) : (
          <Form>
            <Form.Item label="Feedback">
              <TextArea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback if rejecting the document"
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default VisaStatusInProgress;