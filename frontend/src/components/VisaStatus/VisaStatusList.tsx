import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisaStatus } from '../../features/visaStatus/visaStatusSlice';
import { RootState } from '../../app/store';

const VisaStatusList = ({ employeeId }: { employeeId: string }) => {
  const dispatch = useDispatch();
  const { visaStatus } = useSelector((state: RootState) => state.visaStatus);

  useEffect(() => {
    dispatch(fetchVisaStatus(employeeId));
  }, [dispatch, employeeId]);

  return (
    <div>
      <h2 className="text-xl font-semibold">Visa Status</h2>
      {visaStatus && (
        <ul className="list-disc ml-5">
          <li>OPT Receipt: {visaStatus.optReceipt.status}</li>
          <li>OPT EAD: {visaStatus.optEAD.status}</li>
          <li>I-983: {visaStatus.i983Form.status}</li>
          <li>I-20: {visaStatus.i20Form.status}</li>
        </ul>
      )}
    </div>
  );
};

export default VisaStatusList;