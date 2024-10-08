import { useState } from 'react';
import { Card, Input, Button, Form, message } from 'antd';
import { sendRegistrationLinkApi } from '../../api/registration';

const SendRegistrationLink = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isSent, setIsSent] = useState(false); 

  const handleSubmit = async (values: { firstName: string; lastName: string; email: string }) => {
    setLoading(true);
    try {
      await sendRegistrationLinkApi(values);
      message.success('Registration link sent successfully!');
      setIsSent(true);
    } catch (error) {
      message.error('Failed to send registration link');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setIsSent(false);
    form.resetFields();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {isSent ? (
        <Card style={{ width: 400, textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📧</div>
          <h3>We have sent the registration link to this email, please check that!</h3>
          <Button type="primary" onClick={handleResend} style={{ marginTop: '20px' }}>
            Send Again
          </Button>
        </Card>
      ) : (
        <Card title="Send Registration Link" style={{ width: 400 }}>
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please input the first name!' }]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Please input the last name!' }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input the email!' }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Send Registration Link
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default SendRegistrationLink;
