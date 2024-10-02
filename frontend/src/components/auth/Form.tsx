import { Form, Input, Button } from 'antd';

interface FormProps {
  formType: 'login';  // Currently only handling login
  onSubmit: (values: { email: string; password: string }) => void;
  loading?: boolean;
}

const AuthForm: React.FC<FormProps> = ({ formType, onSubmit, loading }) => {

  const handleSubmit = (values: { email: string; password: string }) => {
    onSubmit(values);
  };

  return (
    <Form onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' },
        ]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>

      {/* Password Field */}
      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 4, message: 'Password must be at least 4 characters long!' },
        ]}
      >
        <Input.Password placeholder="Enter your password" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
        >
          {formType === 'login' ? 'Login' : 'Submit'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AuthForm;
