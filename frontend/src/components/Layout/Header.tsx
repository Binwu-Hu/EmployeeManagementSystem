import { Layout, Menu } from 'antd';

import { Link } from 'react-router-dom';
import { RootState } from '../../app/store';
import SignOutButton from '../auth/SignOutButton';
import { useSelector } from 'react-redux';

const { Header } = Layout;

const MergedHeader = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );
  console.log('isauth', isAuthenticated);

  return (
    <Header className='bg-black text-white px-0 md:px-4 h-12 md:h-20'>
      <div className='flex flex-col md:flex-row justify-between items-center w-full'>
        <div className='text-2xl font-bold text-white flex-shrink-0'>
          <a href='/' style={{ color: 'white' }}>
            Employee
          </a>
          <span className='text-base text-white hidden md:inline'>
            {' '}
            Management Chuwa
          </span>
        </div>

        {isAuthenticated && user && (
          <div className='flex justify-center md:justify-end items-center w-full md:w-auto bg-black px-4'>
            <Menu
              theme='dark'
              mode='horizontal'
              className='bg-black text-white flex space-x-1'
            >
              <Menu.Item key='home'>
                <Link to='/'>Home</Link>
              </Menu.Item>

              {user.role === 'Employee' && (
                <>
                  <Menu.Item key='onboarding'>
                    <Link to={`/onboarding/user/${user.id}`}>
                      Onboarding Application
                    </Link>
                  </Menu.Item>
                  <Menu.Item key='personal-info'>
                    <Link to={`/employees/user/${user.id}`}>
                      Personal Information
                    </Link>
                  </Menu.Item>
                  <Menu.Item key='visa-status'>
                    <Link to='/visa-status'>Visa Status Management</Link>
                  </Menu.Item>
                </>
              )}

              {user.role === 'HR' && (
                <>
                  <Menu.Item key='employee-profiles'>
                    <Link to='/employee-profiles'>Employee Profiles</Link>
                  </Menu.Item>
                  <Menu.Item key='visa-status'>
                    <Link to='/visa-status-management'>Visa Status Management</Link>
                  </Menu.Item>
                  <Menu.Item key='hiring-management'>
                    <Link to='/hiring-management'>Hiring Management</Link>
                  </Menu.Item>
                </>
              )}

              <Menu.Item
                key='1'
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  transition: 'color 0.3s',
                }}
                className='hover:text-yellow-500'
              >
                <SignOutButton />
              </Menu.Item>
            </Menu>
          </div>
        )}
      </div>
    </Header>
  );
};

export default MergedHeader;
