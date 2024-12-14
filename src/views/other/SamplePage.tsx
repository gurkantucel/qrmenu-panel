'use client';
// project-imports
import MainCard from 'components/MainCard';
import Calendar from 'views/apps/Calendar';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  return (
    <MainCard title="Takvim">
      <Calendar />
    </MainCard>
  );
}
