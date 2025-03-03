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

// ==============================|| STATISTICS - ECOMMERCE CARD  ||==========================//

interface Props {
  title: string;
  count: string;
  percentage?: number;
  isLoss?: boolean;
  color?: ChipProps['color'];
  extra: string;
}

export default function AnalyticEcommerce({ color = 'primary', title, count, percentage, isLoss, extra }: Props) {

  const intl = useIntl()

  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h4" color="inherit">
              {count}
            </Typography>
          </Grid>
          {percentage != null && (
            <Grid item>
              <Chip
                variant="combined"
                color={percentage == 0 ? "warning" : percentage > 0 ? "success" : "error"}
                icon={percentage == 0 ? <></> : percentage > 0 ? <ArrowUp style={{ transform: 'rotate(45deg)' }} /> : <ArrowRight style={{ transform: 'rotate(45deg)' }} />
                }
                label={`${percentage}%`}
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
          <Typography variant="caption" sx={{ color: `${percentage == 0 ? "warning" : (percentage ?? 0) > 0 ? "success" : "error"}.main` }}>
            {extra}
          </Typography>
        </Typography>
      </Box>
    </MainCard>
  );
}
