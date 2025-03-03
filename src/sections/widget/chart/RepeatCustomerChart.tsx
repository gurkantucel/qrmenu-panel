import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';
import { DropdownListData } from 'utils/models/dropdown-list-model';
import { useIntl } from 'react-intl';

// chart options
const areaChartOptions = {
  chart: {
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 1
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      type: 'vertical',
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  grid: {
    strokeDashArray: 4
  }
};

// ==============================|| CHART - REPEAT CUSTOMER CHART ||============================== //

function aylikVeriDuzenle(veri: any) {
  const tumAylar = [
    "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06",
    "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12"
  ];

  const duzenlenmisVeri = tumAylar.map(ay => {
    const bulunanAy = veri.find((item: any) => item.label === ay);
    return bulunanAy ? bulunanAy.value : 0;
  });

  return duzenlenmisVeri;
}

type Props = {
  title: string
  data: DropdownListData[]
}

export default function RepeatCustomerChart({ title, data }: Props) {
  const theme = useTheme();
  const intl = useIntl();
  const mode = theme.palette.mode;
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState<ChartProps>(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories: [
          intl.formatMessage({ id: "janM" }),
          intl.formatMessage({ id: "febM" }),
          intl.formatMessage({ id: "marM" }),
          intl.formatMessage({ id: "aprM" }),
          intl.formatMessage({ id: "mayM" }),
          intl.formatMessage({ id: "junM" }),
          intl.formatMessage({ id: "julM" }),
          intl.formatMessage({ id: "augM" }),
          intl.formatMessage({ id: "sepM" }),
          intl.formatMessage({ id: "octM" }),
          intl.formatMessage({ id: "novM" }),
          intl.formatMessage({ id: "decM" })
        ],
        labels: {
          style: {
            colors: [
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary
            ]
          }
        },
        axisBorder: {
          show: false,
          color: line
        },
        axisTicks: {
          show: false
        },
        tickAmount: 11
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme]);

  const [series] = useState([
    {
      name: title,
      data: aylikVeriDuzenle(data)
    }
  ]);

  return <ReactApexChart options={options} series={series} type="area" height={260} />;
}
