"use client"
// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip, { ChipProps } from '@mui/material/Chip';
import Box from '@mui/material/Box';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { ArrowRight, ArrowUp } from 'iconsax-react';
import { useIntl } from 'react-intl';
import { MenuItem, Select } from '@mui/material';
import { ReadVenue } from 'reduxt/features/statistic/models/statistic-model';
import { useState } from 'react';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||==========================//

interface Props {
  title: string;
  color?: ChipProps['color'];
  data: ReadVenue[]
}

export default function StaticReadVenue({ color = 'primary', title, data }: Props) {

  const intl = useIntl()

  const [selectData, setSelectData] = useState(data[0])

  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Grid container justifyContent={"space-between"}>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          {selectData !=null && <Select value={selectData.currency_code} onChange={(event) => {
            const find = data.find((item) => item.currency_code == event.target.value);
            if (find) {
              setSelectData(find);
            }
          }} size='small' sx={{
            '& .MuiSelect-select': {
              paddingRight: 4,
              paddingLeft: "10px",
              paddingTop: "2px",
              paddingBottom: "2px",
            }
          }}>
            {data.map((item) => (<MenuItem key={item.currency_code} value={item.currency_code}>{item.currency_code}</MenuItem>))}
          </Select>}
        </Grid>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h4" color="inherit">
              {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: selectData?.currency_code ?? "TRY" }).format(Number(selectData?.total ?? "0"))}
            </Typography>
          </Grid>
          {selectData?.increase != null && (
            <Grid item>
              <Chip
                variant="combined"
                color={selectData.increase == 0 ? "warning" : selectData.increase > 0 ? "success" : "error"}
                icon={selectData.increase == 0 ? <></> : selectData.increase > 0 ? <ArrowUp style={{ transform: 'rotate(45deg)' }} /> : <ArrowRight style={{ transform: 'rotate(45deg)' }} />
                }
                label={`${selectData.increase.toFixed(0)}%`}
                sx={{ ml: 1.25, pl: 1, borderRadius: 1 }}
                size="small"
              />
            </Grid>
          )}
        </Grid>
      </Stack>
      <Box sx={{ pt: 2.25 }}>
        <Typography variant="body1" color="text.secondary">
          {intl.formatMessage({ id: "thisMonth" })} {' '}
          <Typography variant="caption" sx={{ color: `${color || 'primary'}.main` }}>
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: selectData?.currency_code ?? "TRY" }).format(Number(selectData?.this_month ?? "0"))}
          </Typography>
        </Typography>
      </Box>
    </MainCard>
  );
}
