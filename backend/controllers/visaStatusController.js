import Employee from '../models/employeeModel.js';
import VisaStatus from '../models/visaStatusModel.js';
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

      // Clear the previous files and set the new ones
      if (fileType === 'optReceipt') {
        visaStatus.optReceipt.files = []; // Clear previous files
        visaStatus.optReceipt.files.push(...req.files.map(file => file.path));
        visaStatus.optReceipt.status = 'Pending';
      } else if (fileType === 'optEAD') {
        visaStatus.optEAD.files = []; // Clear previous files
        visaStatus.optEAD.files.push(...req.files.map(file => file.path));
        visaStatus.optEAD.status = 'Pending';
      } else if (fileType === 'i983Form') {
        visaStatus.i983Form.files = []; // Clear previous files
        visaStatus.i983Form.files.push(...req.files.map(file => file.path));
        visaStatus.i983Form.status = 'Pending';
      } else if (fileType === 'i20Form') {
        visaStatus.i20Form.files = []; // Clear previous files
        visaStatus.i20Form.files.push(...req.files.map(file => file.path));
        visaStatus.i20Form.status = 'Pending';
      }

      // Save the visa status
      await visaStatus.save();
      res.status(200).json({ message: 'Files uploaded successfully', visaStatus });

  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ message: 'Error uploading files', error: error.message });
    }
  };  

// Fetch Visa Status for all employees
export const getAllVisaStatuses = async (req, res) => {
    try {
      const visaStatuses = await VisaStatus.find().populate('employee'); // Populate employee details
    //   const visaStatuses = await VisaStatus.find();
    //   console.log('visaStatuses:', visaStatuses);
      if (!visaStatuses.length) {
        return res.status(404).json({ message: 'No visa statuses found' });
      }
      res.status(200).json(visaStatuses);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching visa statuses', error });
    }
  };  


// Fetch Visa Status by Employee
export const getVisaStatusByEmployee = async (req, res) => {

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

// Update visa status function
export const updateVisaStatus = async (employeeId, visaType, files=[]) => {
  // console.log('visaType in updateVisaStatus:', visaType);
  try {

    let visaStatus = await VisaStatus.findOne({ employee: employeeId });
    // If visa type is Green Card or Citizen, delete existing visa status
    if (visaType === 'Green Card' || visaType === 'Citizen') {
      if (visaStatus) {
        await VisaStatus.deleteOne({ employee: employeeId });
        return { message: 'Visa status deleted successfully for Green Card or Citizen' };
      } else {
        
        return { message: 'No visa status to delete for Green Card or Citizen' };
      }
    }

    if (visaType === 'F1') {
      if (visaStatus) {
        // update existing visa status
        visaStatus.visaType = visaType;
        visaStatus.optReceipt = { files: files, status: 'Unsubmitted' };
        visaStatus.optEAD = { files: [], status: 'Unsubmitted' };
        visaStatus.i983Form = { files: [], status: 'Unsubmitted' };
        visaStatus.i20Form = { files: [], status: 'Unsubmitted' };
        await visaStatus.save();
        return { message: 'Visa status updated successfully for F1', visaStatus };
      } else {
        // create new visa status
        visaStatus = new VisaStatus({
          employee: employeeId,
          visaType: visaType,
          optReceipt: { files: files, status: 'Unsubmitted' },
          optEAD: { files: [], status: 'Unsubmitted' },
          i983Form: { files: [], status: 'Unsubmitted' },
          i20Form: { files: [], status: 'Unsubmitted' },
        });
        await visaStatus.save();
        return { message: 'New visa status created successfully for F1', visaStatus };
      }
    }

    // non-F1 visa types
    if (visaStatus) {
      visaStatus.visaType = visaType;
      // delete existing f-1 related files
      visaStatus.optReceipt = undefined;
      visaStatus.optEAD = undefined;
      visaStatus.i983Form = undefined;
      visaStatus.i20Form = undefined;
      await visaStatus.save();
      return { message: `Visa status updated successfully for ${visaType}`, visaStatus };
    } else {
      visaStatus = new VisaStatus({
        employee: employeeId,
        visaType: visaType,
      });
      await visaStatus.save();
      return { message: `New visa status created successfully for ${visaType}`, visaStatus };
    }
  } catch (error) {
    throw new Error(`Error updating visa status: ${error.message}`);
  }
};

// HR Action: Approve/Reject Visa Documents
export const approveOrRejectVisaDocument = async (req, res) => {
  console.log('req.body:', req.body);
  try {
    const { employeeId } = req.params;
    const { fileType, action, feedback } = req.body;

    let visaStatus = await VisaStatus.findOne({ employee: employeeId });

    if (!visaStatus) {
      return res.status(404).json({ message: 'Visa status not found' });
    }

    // Update the document status based on the action (Approve/Reject)
    if (fileType === 'optReceipt') {
      visaStatus.optReceipt.status = action;
      if (action === 'Rejected') visaStatus.optReceipt.feedback = feedback; // Add feedback if rejected
    } else if (fileType === 'optEAD') {
      visaStatus.optEAD.status = action;
      if (action === 'Rejected') visaStatus.optEAD.feedback = feedback;
    } else if (fileType === 'i983Form') {
      visaStatus.i983Form.status = action;
      if (action === 'Rejected') visaStatus.i983Form.feedback = feedback;
    } else if (fileType === 'i20Form') {
      visaStatus.i20Form.status = action;
      if (action === 'Rejected') visaStatus.i20Form.feedback = feedback;
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
    const { fileType } = req.body;
    console.log('employeeId:', employeeId);
    console.log('fileType:', fileType);
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const { email, firstName } = employee; 

    const message = `
      <p>Hi ${firstName},</p>
      <p>Your document for <strong>${fileType}</strong> is pending approval or needs attention. Please review the status and take necessary actions.</p>
      <p>Thank you,</p>
      <p>Your HR Team</p>
    `;

    console.log('Sending notification to:', email);
    console.log('Message:', message);

    await sgMail.send({
      to: email,
      from: 'ecommercemanagementchuwa@gmail.com',
      subject: `Notification for ${fileType} Document`,
      html: message,
    });

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Error sending notification', error });
  }
};
