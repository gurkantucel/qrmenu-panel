import { useMemo } from 'react';

// third-party
import ReactApexChart from 'react-apexcharts';
import ApexCharts, { ApexOptions } from "apexcharts";

// project-imports
import { useReadChartDieticianPatientMeasurementQuery } from 'reduxt/features/patient/patient-measurement-api';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { PatientTabEnum } from 'reduxt/features/definition/patientTabSlice';
import { Button, Grid, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import CustomScaleLoader from 'components/CustomScaleLoader';
import { DocumentDownload } from 'iconsax-react';

// ==============================|| CHART - REPEAT CUSTOMER CHART ||============================== //


export default function MeasurementChart() {

  const { data: { selectTab } } = useAppSelector((state: RootState) => state.patientTab);

  const params = useParams<{ slug: string }>()

  const { data: getMeasurementData, isLoading: isMeasurementChartLoading, isFetching: isMeasurementChartFetching } = useReadChartDieticianPatientMeasurementQuery({
    patient_id: params.slug,
    start_date: dayjs().startOf('year').format('YYYY-MM-DD'), end_date: dayjs().endOf('year').format('YYYY-MM-DD')
  },
    { skip: selectTab != PatientTabEnum.olcumler && !params.slug }
  )

  const handleDownload = async (chartId: string) => {
    await ApexCharts.exec(chartId, "updateOptions", {
      dataLabels: { enabled: true },
    });
    await new Promise((r) => setTimeout(r, 200));
    const { imgURI } = await ApexCharts.exec(chartId, "dataURI");
    await ApexCharts.exec(chartId, "updateOptions", {
      dataLabels: { enabled: false },
    });
    const a = document.createElement("a");
    a.href = imgURI;
    a.download = "chart.png";
    a.click();
  };

  const waistHipChestData = useMemo(() => {
    if (!getMeasurementData) return { series: [], options: {} };

    const filteredData = getMeasurementData.data.filter(item => item.label);

    const dates = filteredData.map(item => dayjs(item.label).format("DD.MM.YYYY"));

    const waists = filteredData.map(item => Number(item.waist));
    const hips = filteredData.map(item => Number(item.hip));
    const chests = filteredData.map(item => Number(item.chest));

    const options: ApexOptions = {
      chart: { "id": "waist-hip-chest-chart", height: 400, type: "line" as const, zoom: { enabled: !1 }, toolbar: { tools: { download: false } } },
      stroke: { curve: 'smooth', width: [3, 3, 3] },
      xaxis: {
        categories: dates,
        labels: { rotate: -45 },
      },
      colors: ["#d4e09b", "#a44a3f", "#f19c79"],
      //grid: { row: { colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'], opacity: 0.02} },
    }

    return {
      series: [
        {
          name: "Bel",
          data: waists,
        },
        {
          name: "Kalça",
          data: hips,
        },
        {
          name: "Göğüs",
          data: chests,
        },
      ],
      options: options
    }

  }, [getMeasurementData]);

  const weightData = useMemo(() => {
    if (!getMeasurementData) return { series: [], options: {} };

    const filteredData = getMeasurementData.data.filter(item => item.label);

    const dates = filteredData.map(item => dayjs(item.label).format("DD.MM.YYYY"));

    const weights = filteredData.map(item => Number(item.weight));

    const maxValue = Math.max(...weights);
    const maxIndex = weights.indexOf(maxValue);
    const maxDate = dates[maxIndex];

    const options: ApexOptions = {
      chart: { "id": "weight-chart", height: 350, type: "line" as const, zoom: { enabled: !1 }, toolbar: { tools: { download: false } } },
      stroke: { curve: 'straight', width: [3] },
      xaxis: {
        categories: dates,
        labels: { rotate: -45 },
      },
      annotations: {
        xaxis: [
          {
            x: maxDate, // 🔹 X eksenindeki değer (kategori)
            borderColor: "#FF4560",
            label: {
              borderColor: "#FF4560",
              style: {
                color: "#fff",
                background: "#FF4560",
              },
              text: `📈 En yüksek ölçüm (${maxValue})`,
            },
          },
        ],
        points: [
          {
            x: maxDate,
            y: maxValue,
            marker: {
              size: 6,
              fillColor: "#FF4560",
              strokeColor: "#fff",
              //radius: "2",
            },
            label: {
              borderColor: "#FF4560",
              offsetY: 0,
              style: {
                color: "#fff",
                background: "#FF4560",
              },
              text: `En yüksek: ${maxValue}`,
            },
          },
        ],
      },
      colors: ["#cbdfbd"],
    }

    return {
      series: [
        {
          name: "Kilo",
          data: weights,
        },
      ],
      options: options
    }

  }, [getMeasurementData]);

  const bmiData = useMemo(() => {
    if (!getMeasurementData) return { series: [], options: {} };

    const filteredData = getMeasurementData.data.filter(item => item.label);

    const dates = filteredData.map(item => dayjs(item.label).format("DD.MM.YYYY"));

    const bmis = filteredData.map(item => Number(item.bmi));

    const options: ApexOptions = {
      chart: { "id": "bmi-chart", height: 350, type: "line" as const, zoom: { enabled: !1 }, toolbar: { tools: { download: false } } },
      stroke: { curve: 'smooth', width: [3] },
      xaxis: {
        categories: dates,
        title: { text: "Tarih" },
        labels: { rotate: -45 },
      },
      colors: ["#403d39"],
    }

    return {
      series: [
        {
          name: "BMI",
          data: bmis,
        },
      ],
      options: options
    }

  }, [getMeasurementData]);


  if (isMeasurementChartLoading || isMeasurementChartFetching) {
    return (
      <Grid item xs={12}>
        <MainCard><CustomScaleLoader /></MainCard>
      </Grid>
    )
  }

  return <>
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2 }} // alt boşluk örneği
    >
      <Typography variant='h5'>{"Bel/Kalça/Göğüs"}</Typography>
      <Button variant="text" color="primary" title='Bel/Kalça/Göğüs Resim Olarak İndir' onClick={() => handleDownload("waist-hip-chest-chart")} sx={{
        "& svg": {
          width: 28,
          height: 28,
        },
      }}>
        <DocumentDownload size={28} />
      </Button>
    </Stack>
    <ReactApexChart options={waistHipChestData.options} series={waistHipChestData.series} type="line" height={340} />
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2 }} // alt boşluk örneği
    >
      <Typography variant='h5'>{"Kilo"}</Typography>
      <Button variant="text" color="primary" title='Kilo Resim Olarak İndir' onClick={() => handleDownload("weight-chart")} sx={{
        "& svg": {
          width: 28,
          height: 28,
        },
      }}>
        <DocumentDownload size={28} />
      </Button>
    </Stack>
    <ReactApexChart options={weightData.options} series={weightData.series} type="line" height={340} />
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2 }} // alt boşluk örneği
    >
      <Typography variant='h5'>{"Vücut Kitle İndeksi"}</Typography>
      <Button variant="text" color="primary" title='BMI Resim Olarak İndir' onClick={() => handleDownload("bmi-chart")} sx={{
        "& svg": {
          width: 28,
          height: 28,
        },
      }}>
        <DocumentDownload size={28} />
      </Button>
    </Stack>
    <ReactApexChart options={bmiData.options} series={bmiData.series} type="line" height={340} />
  </>;
}
