import { AppDispatch, RootState } from '../../app/store';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchTokenList } from '../../features/application/applicationSlice';
import { useDispatch, useSelector } from 'react-redux';

const LinkHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tokens, loading, error } = useSelector(
    (state: RootState) => state.application
  );

  const [filteredTokens, setFilteredTokens] = useState(tokens || []);

  useEffect(() => {
    dispatch(fetchTokenList());
  }, [dispatch]);

  useEffect(() => {
    if (tokens) {
      setFilteredTokens(tokens);
    }
  }, [tokens]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Application Status',
      dataIndex: 'applicationStatus',
      key: 'applicationStatus',
    },
    {
      title: 'Registration Token',
      dataIndex: 'token',
      key: 'registrationToken',
      maxWidth: '500px',
      render: (text: string) => (
        <div
          style={{
            maxWidth: '500px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {text}
        </div>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>History of email addresses that received a registration link</h1>

      {filteredTokens.length > 0 ? (
        <Table
          dataSource={filteredTokens.map((token) => ({
            key: token.token,
            name: token.name,
            email: token.email,
            employeeId: token.employeeId,
            applicationStatus: token.applicationStatus,
            token: token.token,
          }))}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      ) : (
        <div>No tokens available</div>
      )}
    </div>
  );
};

export default LinkHistory;
