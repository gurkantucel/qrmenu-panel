"use client"
// project-imports
import MainCard from 'components/MainCard';
import MeasurementChart from './MeasurementChart';

// ==============================|| CHART - REPEAT CUSTOMER RATE ||============================== //


export default function RepeatCustomerRate() {
  return (
    <MainCard sx={{marginTop: 2}}>
      <MeasurementChart  />
    </MainCard>
  );
}
