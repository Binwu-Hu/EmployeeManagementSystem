import { Form, Input, Button } from 'antd';

interface FormProps {
  formType: 'login' | 'signup';
  onSubmit: (values: { email: string; password: string; username?: string }) => void;
  loading?: boolean;
}

const AuthForm: React.FC<FormProps> = ({ formType, onSubmit, loading }) => {

  const [form] = Form.useForm();

  const handleSubmit = (values: { email: string; password: string; confirmPassword?: string }) => {
    const { confirmPassword, ...data } = values;
    onSubmit(data); 
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical" className="form-container">
      <h2 style={{ textAlign: 'center' }}>
        {formType === 'login' ? 'Login' : 'Sign Up'}
      </h2>
      
      {formType === 'signup' && (
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Please input your username!' },
          ]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>
      )}

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

      {formType === 'signup' && (
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm your password" />
        </Form.Item>
      )}

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          {formType === 'login' ? 'Login' : 'Sign Up'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AuthForm;
