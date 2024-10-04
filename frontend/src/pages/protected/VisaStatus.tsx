import { AppDispatch, RootState } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';

import VisaStatusForm from '../../components/VisaStatus/VisaStatusForm';
import VisaStatusList from '../../components/VisaStatus/VisaStatusList';
import { fetchEmployeeByUserId } from '../../features/employee/employeeSlice';
import { useEffect } from 'react';

const VisaStatusPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { employee, loading, error } = useSelector((state: RootState) => state.employee);

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchEmployeeByUserId(user.id));
    }
  }, [dispatch, user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto my-5">
      <h1 className="text-2xl font-bold text-center mb-4">Visa Status Management</h1>
      {employee ? (
        <>
          <VisaStatusForm employeeId={employee._id} />
          <VisaStatusList employeeId={employee._id} />
        </>
      ) : (
        <p className="text-center text-red-500">You do not have access to this page.</p>
      )}
    </div>
  );
};

export default VisaStatusPage;
