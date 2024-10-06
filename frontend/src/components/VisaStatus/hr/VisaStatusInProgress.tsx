import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Table, Input, Button, Modal, Form, Input as AntInput } from 'antd';
import { fetchVisaStatusesApi, updateVisaDocumentStatusApi, sendNotificationApi } from '../../../api/visaStatus';
import { approveVisaStatus } from '../../../features/visaStatus/visaStatusSlice';
import moment from 'moment';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const { Search } = Input;
const { TextArea } = AntInput;

const VisaStatusInProgress: React.FC = () => {
  const dispatch = useDispatch(); 
  const [visaStatuses, setVisaStatuses] = useState<VisaStatusType[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<VisaStatusType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [pdfFile, setPdfFile] = useState<string | null>(null); // URL of the PDF file
  const [rejecting, setRejecting] = useState<boolean>(false); // Track if we are rejecting

  // Separate fetch function to be reused
  const fetchVisaStatuses = async () => {
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

  // Fetch data on component mount
  useEffect(() => {
    fetchVisaStatuses();
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

    setPdfFile(correctPath); // Set the URL of the PDF file
    setIsModalVisible(true);
  };

  const getPendingFileType = (visaStatus: any) => {
    if (visaStatus.optReceipt.status === 'Pending') return 'optReceipt';
    if (visaStatus.optEAD.status === 'Pending') return 'optEAD';
    if (visaStatus.i983Form.status === 'Pending') return 'i983Form';
    if (visaStatus.i20Form.status === 'Pending') return 'i20Form';
    return null; // No pending fileType found
  };  


  const getRejectedOrUnsubmittedFileType = (visaStatus: any) => {
    if (visaStatus.optReceipt.status === 'Rejected') return 'optReceipt';
    if (visaStatus.optEAD.status === 'Rejected') return 'optEAD';
    if (visaStatus.i983Form.status === 'Rejected') return 'i983Form';
    if (visaStatus.i20Form.status === 'Rejected') return 'i20Form';
  
    if (visaStatus.optReceipt.status === 'Unsubmitted') return 'optReceipt';
    if (visaStatus.optEAD.status === 'Unsubmitted') return 'optEAD';
    if (visaStatus.i983Form.status === 'Unsubmitted') return 'i983Form';
    if (visaStatus.i20Form.status === 'Unsubmitted') return 'i20Form';
  
    return null;
  };

  
  const handleApproveReject = async (visaStatus: any, action: 'Approved' | 'Rejected') => {
    try {
      const { _id: employeeId } = visaStatus.employee;
      const fileType = getPendingFileType(visaStatus); 
      
      if (!fileType) {
        console.error('No pending document found to approve/reject.');
        return;
      }

      if (action === 'Rejected') {
        // Set rejecting flag and open modal for feedback
        setSelectedDocument({ employeeId, fileType, action });
        setRejecting(true);
        setIsModalVisible(true);
      } else {
        // Directly approve
        await updateVisaDocumentStatusApi(employeeId, fileType, action);
        alert(`Document ${fileType} has been ${action}`);
        fetchVisaStatuses(); // Re-fetch visa statuses to reflect the update
      }
    } catch (error) {
      console.error('Error updating visa status:', error);
      alert('Error updating visa status');
    }
  };

  const handleSendNotification = async (employeeId: string, fileType: string) => {
    try {
      await sendNotificationApi(employeeId, fileType); 
      alert('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification');
    }
  };

  const handleModalSubmit = async () => {
    if (rejecting) {
      const { employeeId, fileType, action } = selectedDocument;
      
      try {
        // Include feedback when rejecting
        await updateVisaDocumentStatusApi(employeeId, fileType, action, feedback);
        alert(`Document ${fileType} has been ${action} with feedback: ${feedback}`);
        fetchVisaStatuses(); // Re-fetch visa statuses after rejection
      } catch (error) {
        console.error('Error updating visa status:', error);
        alert('Error updating visa status');
      }
  
      setRejecting(false); // Reset rejecting state
    }
  
    // Close modal and clear feedback
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
          <Button type="default" style={{ color: 'blue', border: '0.5px solid blue', backgroundColor: 'white' }} onClick={() => handleApproveReject(visaStatus, 'Approved')}>Approve</Button>
          <Button danger onClick={() => handleApproveReject(visaStatus, 'Rejected')}>Reject</Button>
        </>
      );
    } else {
      const fileType = getRejectedOrUnsubmittedFileType(visaStatus); 
      console.log('fileType', fileType);
      return <Button type="primary" onClick={() => handleSendNotification(visaStatus.employee._id, fileType)}>Send Notification</Button>;

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
      render: (visaStatus: any) =>
        visaStatus.employee.workAuthorization.visaType === 'F1'
          ? getNextStep(visaStatus)
          : '',
    },
    {
      title: 'Action',
      key: 'action',
      render: (visaStatus: any) =>
        visaStatus.employee.workAuthorization.visaType === 'F1'
          ? handleAction(visaStatus)
          : null,
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
          setRejecting(false); // Reset rejecting state if modal closed
          setFeedback('');
          setPdfFile(null); // Clear current PDF preview
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