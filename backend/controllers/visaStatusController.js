import VisaStatus from '../models/visaStatusModel.js';
import Employee from '../models/employeeModel.js';

// Upload Visa Documents
export const uploadVisaDocuments = async (req, res) => {
  try {
    // console.log('req:', req);
    const { employeeId } = req.params;
    const { fileType } = req.body;

    let visaStatus = await VisaStatus.findOne({ employee: employeeId });

    if (!visaStatus) {
      visaStatus = new VisaStatus({ employee: employeeId, visaType: 'OPT' });
    }

    // Add uploaded files to the respective field
    if (fileType === 'optReceipt') {
      visaStatus.optReceipt.files.push(...req.files.map(file => file.path));
    } else if (fileType === 'optEAD') {
      visaStatus.optEAD.files.push(...req.files.map(file => file.path));
    } else if (fileType === 'i983Form') {
      visaStatus.i983Form.files.push(...req.files.map(file => file.path));
    } else if (fileType === 'i20Form') {
      visaStatus.i20Form.files.push(...req.files.map(file => file.path));
    }

    await visaStatus.save();
    res.status(200).json({ message: 'Files uploaded successfully', visaStatus });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading files', error });
  }
};

// Fetch Visa Status by Employee
export const getVisaStatusByEmployee = async (req, res) => {
    // console.log('req.params:', req.params);
  try {
    const { employeeId } = req.params;
    const visaStatus = await VisaStatus.findOne({ employee: employeeId }).populate('employee');
    // console.log('visaStatus:', visaStatus);
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