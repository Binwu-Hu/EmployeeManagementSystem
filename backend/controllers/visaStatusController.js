import Employee from '../models/employeeModel.js';
import VisaStatus from '../models/visaStatusModel.js';

// Upload Visa Documents
export const uploadVisaDocuments = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { fileType } = req.body;
  
      let visaStatus = await VisaStatus.findOne({ employee: employeeId });
      if (!visaStatus) {
        visaStatus = new VisaStatus({ employee: employeeId, visaType: 'OPT' });
      }
      
      if (fileType === 'optEAD' && visaStatus.optReceipt.status !== 'Approved') {
        return res.status(400).json({ message: 'You must upload OPT Receipt and get it approved before uploading OPT EAD.' });
      }
      if (fileType === 'i983Form' && visaStatus.optEAD.status !== 'Approved') {
        return res.status(400).json({ message: 'You must upload OPT EAD and get it approved before uploading I-983 Form.' });
      }
      if (fileType === 'i20Form' && visaStatus.i983Form.status !== 'Approved') {
        return res.status(400).json({ message: 'You must upload I-983 and get it approved before uploading I-20.' });
      }
  
      if (fileType === 'optReceipt') {
        if (!visaStatus.optReceipt.files) visaStatus.optReceipt.files = []; 
        
        visaStatus.optReceipt.files.push(...req.files.map(file => file.path));
      } else if (fileType === 'optEAD') {
        if (!visaStatus.optEAD.files) visaStatus.optEAD.files = [];
        visaStatus.optEAD.files.push(...req.files.map(file => file.path));
      } else if (fileType === 'i983Form') {
        if (!visaStatus.i983Form.files) visaStatus.i983Form.files = [];
        visaStatus.i983Form.files.push(...req.files.map(file => file.path));
      } else if (fileType === 'i20Form') {
        if (!visaStatus.i20Form.files) visaStatus.i20Form.files = [];
        visaStatus.i20Form.files.push(...req.files.map(file => file.path));
      }
    //   console.log('visaStatus:', visaStatus);
      await visaStatus.save();
      res.status(200).json({ message: 'Files uploaded successfully', visaStatus });
    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ message: 'Error uploading files', error: error.message });
    }
  };  

// Fetch Visa Status by Employee
export const getVisaStatusByEmployee = async (req, res) => {

  try {
    const { employeeId } = req.params;
    const visaStatus = await VisaStatus.findOne({ employee: employeeId }).populate('employee');
    console.log('visaStatus:', visaStatus);
    if (!visaStatus) {
      return res.status(404).json({ message: 'Visa status not found' });
    }

    res.status(200).json(visaStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visa status', error });
  }
};

// HR Action: Approve/Reject Visa Documents
export const approveOrRejectVisaDocument = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { fileType, action } = req.body;

    let visaStatus = await VisaStatus.findOne({ employee: employeeId });

    if (!visaStatus) {
      return res.status(404).json({ message: 'Visa status not found' });
    }

    // Update the document status based on the action (Approve/Reject)
    if (fileType === 'optReceipt') {
      visaStatus.optReceipt.status = action;
    } else if (fileType === 'optEAD') {
      visaStatus.optEAD.status = action;
    } else if (fileType === 'i983Form') {
      visaStatus.i983Form.status = action;
    } else if (fileType === 'i20Form') {
      visaStatus.i20Form.status = action;
    }

    await visaStatus.save();
    res.status(200).json({ message: 'Document status updated successfully', visaStatus });
  } catch (error) {
    res.status(500).json({ message: 'Error updating document status', error });
  }
};

// HR sends Notification
export const sendNotification = async (req, res) => {
  try {
    const { employeeId } = req.params;
    // You can implement your email sending logic here using a service like nodemailer
    res.status(200).json({ message: 'Notification sent to employee' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending notification', error });
  }
};