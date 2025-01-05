import { useState, useEffect } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';

// third-party
import { format } from 'date-fns';

// project-imports
import IconButton from 'components/@extended/IconButton';

// assets
import { ArrowLeft2, ArrowRight2, Calendar1, Category, Grid6, TableDocument } from 'iconsax-react';
import { tr } from 'date-fns/locale';
import { useIntl } from 'react-intl';

// constant
const viewOptions = [
  {
    label: 'Ay',
    value: 'dayGridMonth',
    icon: Category
  },
  {
    label: 'Hafta',
    value: 'timeGridWeek',
    icon: Grid6
  },
  {
    label: 'Gün',
    value: 'timeGridDay',
    icon: Calendar1
  },
  {
    label: 'Gündem',
    value: 'listWeek',
    icon: TableDocument
  }
];

// ==============================|| CALENDAR - TOOLBAR ||============================== //

export interface ToolbarProps {
  date: number | Date;
  view: string;
  onClickNext: () => void;
  onClickPrev: () => void;
  onClickToday: () => void;
  onChangeView: (s: string) => void;
}

export default function Toolbar({ date, view, onClickNext, onClickPrev, onClickToday, onChangeView, ...others }: ToolbarProps) {
  const matchDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const [viewFilter, setViewFilter] = useState(viewOptions);

  const intl = useIntl()

  useEffect(() => {
    if (matchDownSM) {
      const filter = viewOptions.filter((item) => item.value !== 'dayGridMonth' && item.value !== 'timeGridWeek');
      setViewFilter(filter);
    } else {
      setViewFilter(viewOptions);
    }
  }, [matchDownSM]);

  return (
    <Grid alignItems="center" container justifyContent="space-between" spacing={matchDownSM ? 1 : 3} {...others} sx={{ pb: 3 }}>
      <Grid item>
        <Button variant="outlined" onClick={onClickToday} size={matchDownSM ? 'small' : 'medium'}>
          {intl.formatMessage({id: "today"})}
        </Button>
      </Grid>
      <Grid item>
        <Stack direction="row" alignItems="center" spacing={matchDownSM ? 1 : 3}>
          <IconButton onClick={onClickPrev} size={matchDownSM ? 'small' : 'large'}>
            <ArrowLeft2 />
          </IconButton>
          <Typography variant={matchDownSM ? 'h5' : 'h3'} color="text.primary">
            {format(date, 'MMMM yyyy',{locale: tr})}
          </Typography>
          <IconButton onClick={onClickNext} size={matchDownSM ? 'small' : 'large'}>
            <ArrowRight2 />
          </IconButton>
        </Stack>
      </Grid>
      <Grid item>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          {viewFilter.map((viewOption) => {
            const Icon = viewOption.icon;
            return (
              <Tooltip title={viewOption.label} key={viewOption.value}>
                <Button
                  size={matchDownSM ? 'small' : 'large'}
                  disableElevation
                  variant={viewOption.value === view ? 'contained' : 'outlined'}
                  onClick={() => onChangeView(viewOption.value)}
                >
                  <Icon variant={viewOption.value === view ? 'Bold' : 'Linear'} />
                </Button>
              </Tooltip>
            );
          })}
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}
