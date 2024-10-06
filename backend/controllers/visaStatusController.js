import Employee from '../models/employeeModel.js';
import VisaStatus from '../models/visaStatusModel.js';

// Upload Visa Documents
export const uploadVisaDocuments = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { fileType } = req.body;
        // console.log('req.files:', req.files);
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
        visaStatus.optReceipt.status = 'Pending';
      } else if (fileType === 'optEAD') {
        if (!visaStatus.optEAD.files) visaStatus.optEAD.files = [];
        visaStatus.optEAD.files.push(...req.files.map(file => file.path));
        visaStatus.optEAD.status = 'Pending';
      } else if (fileType === 'i983Form') {
        if (!visaStatus.i983Form.files) visaStatus.i983Form.files = [];
        visaStatus.i983Form.files.push(...req.files.map(file => file.path));
        visaStatus.i983Form.status = 'Pending';
      } else if (fileType === 'i20Form') {
        if (!visaStatus.i20Form.files) visaStatus.i20Form.files = [];
        visaStatus.i20Form.files.push(...req.files.map(file => file.path));
        visaStatus.i20Form.status = 'Pending';
      }
    //   console.log('visaStatus:', visaStatus);
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

// // Controller function to update visa status
// export const updateVisaStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;  // Get new status from request body

//   try {
//     // Find the visa status by ID and update its status field
//     const updatedVisaStatus = await VisaStatus.findByIdAndUpdate(
//       id,
//       { status },  // Update status field
//       { new: true }  // Return the updated document
//     );

//     if (!updatedVisaStatus) {
//       return res.status(404).json({ message: 'Visa status not found' });
//     }

//     res.status(200).json(updatedVisaStatus);  // Send updated visa status back to frontend
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

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
    const { fileType } = req.body; // Capture fileType from the request body

    // Your logic to send the notification (e.g., send email, log notification, etc.)
    console.log(`Sending notification for employee ${employeeId} about ${fileType}`);

    // Respond with success
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Error sending notification', error });
  }
};
