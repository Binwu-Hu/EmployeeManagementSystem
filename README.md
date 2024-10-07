# Employee Management System

## Overview

The **Employee Management System** is a full-stack web application designed to manage employees' personal information, visa status, work authorization documents, and other key details. It includes features for employee management, file uploads, visa document handling, and more. The application is split into frontend and backend parts, allowing smooth communication between a React-based user interface and an Express.js-powered API.

The backend is built using **Node.js** and **Express**, with **MongoDB** as the database for managing employee data. The frontend uses **React**, **Ant Design**, and **TailwindCSS** to provide a clean and responsive interface for users.

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime for building the backend server.
- **Express.js**: Web framework for creating RESTful APIs.
- **MongoDB**: NoSQL database for storing employee data.
- **Mongoose**: ODM for MongoDB to manage data models.
- **Multer**: Middleware for handling file uploads.
- **JWT (Json Web Token)**: Used for user authentication.
- **SendGrid**: Sending email notifications.
- **Nodemon**: Development tool for automatically restarting the server.

### Frontend
- **React.js**: JavaScript library for building the user interface.
- **Redux Toolkit**: State management for managing application state.
- **Ant Design (Antd)**: UI component library for styling and UI components.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **Axios**: For handling HTTP requests.
- **React Router Dom**: Routing library for React.
- **React-PDF Viewer**: For viewing uploaded PDFs directly in the application.
- **Redux-Persist**: Persisting Redux state across sessions.

## Features

### Backend
- **User Authentication**: Signup, login, and JWT-based authentication for secure access.
- **Employee Management**: APIs for creating, updating, and fetching employee data.
- **File Uploads**: Ability to upload visa documents and other files related to employees.
- **Visa Status Tracking**: Manage visa status, work authorization, and associated documents.
- **Notifications**: HR can send notifications via email using the SendGrid API.

### Frontend
- **Dashboard**: View, add, and update employee information.
- **File Upload**: Employees can upload files, including work authorization documents.
- **Form Handling**: Interactive forms for entering employee details with validation.
- **Visa Status**: Employees can track and view their visa status.
- **PDF Preview**: Users can preview uploaded PDFs directly in the application.

## API Endpoints

### Users
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/users/signup` | POST | User signup |
| `/api/users/login` | POST | User login |

### Registration
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/registration/send` | POST | Send registration link |

### Employees
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/employees/user/:id` | GET | Get employee by user ID |
| `/api/employees/user/:id` | PUT | Update employee information |
| `/api/employees` | GET | Get all employees |
| `/api/employees/upload/:id` | POST | Upload employee files |

### Applications
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/application` | POST | Create new application |
| `/api/application` | PUT | Update an application |
| `/api/application/all` | GET | Get all applications |
| `/api/application/:id` | GET | Get application details |
| `/api/application/:id` | PUT | Update application status |

### Visa Status
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/visa-status/upload/:employeeId` | POST | Upload visa documents for an employee |
| `/api/visa-status/all` | GET | Get visa status for all employees |
| `/api/visa-status/:employeeId` | GET | Get visa status by employee ID |
| `/api/visa-status/update/:employeeId` | PATCH | Approve or reject visa documents |
| `/api/visa-status/notify/:employeeId` | POST | Send notification to employee |

## Installation and Setup

1. **Clone the Repository**:
```
   git clone https://github.com/Binwu-Hu/EmployeeManagementSystem.git
   cd EmployeeManagementSystem
```

2. **Install Backend Dependencies**:
```
   cd backend
   npm install
```

3. **Configure Environment Variables**:
```
   #.env
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   SENDGRID_API_KEY=<your-sendgrid-api-key>
```

4. **Install Frontend Dependencies**:
```
   cd frontend
   npm install
```

5. **Start the application**:
```
   npm run dev
```
