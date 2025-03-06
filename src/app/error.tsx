'use client';

// next
import Link from 'next/link';
import Image from 'next/image';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import { HOME_DEFAULT_PATH } from '../config';

// assets
const error500 = '/assets/images/maintenance/img-error-500.svg';

// ==============================|| ERROR 500 ||============================== //

export default function Error500() {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }} spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ width: downSM ? 240 : 325 }}>
          <Image
            src={error500}
            alt="able-pro"
            width={downSM ? 350 : 396}
            height={downSM ? 325 : 370}
            style={{
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Stack justifyContent="center" alignItems="center">
          <Typography align="center" variant={downSM ? 'h2' : 'h1'}>
          {"Dahili Sunucu Hatası"}
          </Typography>
          <Typography color="text.secondary" variant="body2" align="center" sx={{ width: { xs: '73%', sm: '70%' }, mt: 1 }}>
          {"Sunucu hatası 500. Sorunu düzeltiyoruz. Lütfen daha sonra tekrar deneyin."}
          </Typography>
          <Button component={Link} href={HOME_DEFAULT_PATH} variant="contained" sx={{ textTransform: 'none', mt: 4 }}>
          {"Ana Sayfaya Dön"}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
