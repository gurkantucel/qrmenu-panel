"use client"
//import { useState, MouseEvent } from 'react';

// material-ui
//import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
//import ListItemButton from '@mui/material/ListItemButton';

// project-imports
import MainCard from 'components/MainCard';
//import MoreIcon from 'components/@extended/MoreIcon';
//import IconButton from 'components/@extended/IconButton';
import RepeatCustomerChart from './RepeatCustomerChart';
import { DropdownListData } from 'utils/models/dropdown-list-model';

// ==============================|| CHART - REPEAT CUSTOMER RATE ||============================== //

type Props = {
  title:string
  data: DropdownListData[]
}

export default function RepeatCustomerRate({title,data}: Props) {
  //const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  //const open = Boolean(anchorEl);

  /*const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };*/

  return (
    <MainCard>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography variant="h5">{title}</Typography>
        {/*<IconButton
          color="secondary"
          id="wallet-button"
          aria-controls={open ? 'wallet-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{ transform: 'rotate(90deg)' }}
        >
          <MoreIcon />
        </IconButton>
        <Menu
          id="wallet-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'wallet-button',
            sx: { p: 1.25, minWidth: 150 }
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <ListItemButton onClick={handleClose}>Today</ListItemButton>
          <ListItemButton onClick={handleClose}>Weekly</ListItemButton>
          <ListItemButton onClick={handleClose}>Monthly</ListItemButton>
        </Menu>*/}
      </Stack>
      <RepeatCustomerChart title={title} data={data}  />
    </MainCard>
  );
}
