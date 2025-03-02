'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { ThemeMode } from 'config';

// assets
import { Cloud } from 'iconsax-react';
import { CurrentAccountReadListModel } from 'reduxt/features/current-account/models/current-account-model';
import { useIntl } from 'react-intl';
const cardBack = '/assets/images/widget/img-dropbox-bg.svg';

// ===========================|| STATISTICS - DROPBOX ||=========================== //

type Props = {
  currentAccountData?: CurrentAccountReadListModel
  isCurrentAccountLoading?: boolean
}

export default function TotalUsedStorage({ currentAccountData, isCurrentAccountLoading }: Props) {
  const theme = useTheme();
  const intl = useIntl()

  return (
    <MainCard
      sx={{
        color: 'common.white',
        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.100' : 'secondary.800',
        '&:after': {
          content: '""',
          background: `url("${cardBack}") 100% / cover no-repeat`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          opacity: 0.5
        }
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="h5">{intl.formatMessage({id: "storage"})}</Typography>
            <Typography variant="h4">{isCurrentAccountLoading ? "...." : currentAccountData?.data.total_storage} GB</Typography>
          </Stack>
          <Avatar color="secondary" variant="rounded" sx={{ mt: 0.75, bgcolor: 'secondary.dark' }}>
            <Cloud color={theme.palette.secondary.light} />
          </Avatar>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={0.75}>
            <Typography variant="caption">{`${currentAccountData?.data.total_used_storage ?? 0} GB/10 GB`}</Typography>
            <Box sx={{ display: 'flex' }}>
              <LinearProgress variant="determinate" value={100} color="error" sx={{ width: '15%' }} />
              <LinearProgress variant="determinate" value={100} color="success" sx={{ width: '85%', right: 8 }} />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
