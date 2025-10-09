import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import { useReadChartDieticianPatientMeasurementQuery } from 'reduxt/features/patient/patient-measurement-api';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { PatientTabEnum } from 'reduxt/features/definition/patientTabSlice';
import { Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import CustomScaleLoader from 'components/CustomScaleLoader';

// ==============================|| CHART - REPEAT CUSTOMER CHART ||============================== //


export default function MeasurementChart() {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const line = theme.palette.divider;

  const { data: { selectTab } } = useAppSelector((state: RootState) => state.patientTab);

  const initLineChartOpts: ChartProps = {
    series: [{ name: 'Göğüs (cm)', data: [112, 116, 118] }, { name: 'Bel (cm)', data: [102, 112, 114] }],
    chart: { height: 350, type: 'line', zoom: { enabled: !1 }, toolbar: { tools: { download: false } } },
    dataLabels: { enabled: !1 },
    stroke: { curve: 'straight', width: [3, 3, 3] },
    grid: { row: { colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'], opacity: 0.02, borderColor: line } },
  }

  const [basicLineChartOpts, setBasicLineChartOpts] = useState<ChartProps>(initLineChartOpts)
  const [weightLineChartOpts, setWeightLineChartOpts] = useState<ChartProps>(initLineChartOpts)
  const [bmiLineChartOpts, setBmiLineChartOpts] = useState<ChartProps>(initLineChartOpts)

  const params = useParams<{ slug: string }>()

  const { data: getMeasurementData, isLoading: isMeasurementChartLoading, isFetching: isMeasurementChartFetching } = useReadChartDieticianPatientMeasurementQuery({
    patient_id: params.slug,
    start_date: dayjs().startOf('year').format('YYYY-MM-DD'), end_date: dayjs().endOf('year').format('YYYY-MM-DD')
  },
    { skip: selectTab != PatientTabEnum.olcumler && !params.slug }
  )

  const [series, setSeries] = useState([{ name: "Boy", data: [0] }]);
  const [weightSeries, setWeightSeries] = useState([{ name: "Kilo", data: [0] }]);
  const [bmiSeries, setBmiSeries] = useState([{ name: "BMI", data: [0] }]);


  useEffect(() => {
    if (getMeasurementData?.data != null) {
      const opts = basicLineChartOpts;

      const filteredData = getMeasurementData.data.filter(item => item.label);

      setBasicLineChartOpts({
        ...opts,
        xaxis: { categories: filteredData.map(item => dayjs(item.label).format("DD.MM.YYYY")) },
        theme: { mode: mode === ThemeMode.DARK ? 'dark' : 'light' }
      });

      setWeightLineChartOpts({
        ...opts,
        xaxis: { categories: filteredData.map(item => dayjs(item.label).format("DD.MM.YYYY")) },
        theme: { mode: mode === ThemeMode.DARK ? 'dark' : 'light' }
      });

      setBmiLineChartOpts({
        ...opts,
        series: [{ name: 'BMI', data: [30.2, 30, 28] }],
        xaxis: { categories: filteredData.map(item => dayjs(item.label).format("DD.MM.YYYY")) },
        theme: { mode: mode === ThemeMode.DARK ? 'dark' : 'light' }
      });

      setSeries([
        { name: "Bel", data: filteredData.map(item => Number(item.waist)) },
        { name: "Kalça", data: filteredData.map(item => Number(item.hip)) },
        { name: "Göğüs", data: filteredData.map(item => Number(item.chest)) },
      ]);

      setWeightSeries([
        { name: "Kilo", data: filteredData.map(item => Number(item.weight)) },
      ]);

      setBmiSeries([
        { name: "BMI", data: [30.2,29,28] },
      ]);

    }
  }, [getMeasurementData, theme])

  if (isMeasurementChartLoading || isMeasurementChartFetching) {
    return (
      <Grid item xs={12}>
        <MainCard><CustomScaleLoader /></MainCard>
      </Grid>
    )
  }

  return <>
    <Typography variant='h5'>{"Bel/Kalça/Göğüs"}</Typography>
    <ReactApexChart options={basicLineChartOpts} series={series} type="line" height={340} />
    <Typography variant='h5'>{"Kilo"}</Typography>
    <ReactApexChart options={weightLineChartOpts} series={weightSeries} type="line" height={340} />
    <Typography variant='h5'>{"Vücut Kitle İndeksi"}</Typography>
    <ReactApexChart options={bmiLineChartOpts} series={bmiSeries} type="line" height={340} />
  </>;
}
