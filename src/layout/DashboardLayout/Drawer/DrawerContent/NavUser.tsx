import { useState, MouseEvent } from 'react';

// next
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

// project-imports
import Avatar from 'components/@extended/Avatar';
import useUser from 'hooks/useUser';
import { useGetMenuMaster } from 'api/menu';

// assets
import { ArrowRight2 } from 'iconsax-react';
import { deleteCookie } from 'cookies-next';
import { useIntl } from 'react-intl';
import { useAppDispatch } from 'reduxt/hooks';
import { resetMenuItemState } from 'reduxt/features/auth/menuItemSlice';
import dayjs from 'dayjs';
import { Chip } from '@mui/material';

const avatar1 = '/assets/images/users/avatar-6.png';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
  drawerOpen: boolean;
}

const diffInDays = (endDate: string) => {
  const today = dayjs();
  const expiryDate = dayjs(endDate);
  const diffInDays = expiryDate.diff(today, 'day');
  return `${diffInDays.toString()} Gün`;
}

const ExpandMore = styled(({ expand, drawerOpen, ...other }: ExpandMoreProps) => {
  return <IconButton size="small" {...other} />;
})(({ theme, expand, drawerOpen }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(-90deg)',
  marginLeft: 'auto',
  color: theme.palette.secondary.dark,
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  }),
  ...(!drawerOpen && {
    opacity: 0,
    width: 50,
    height: 50
  })
}));

// ==============================|| LIST - USER ||============================== //

export default function UserList() {
  const theme = useTheme();
  const router = useRouter();
  const user = useUser();
  const intl = useIntl()
  const dispatch = useAppDispatch();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("refreshToken");
    deleteCookie("personAuthorizations");
    deleteCookie("membership");
    dispatch(resetMenuItemState());
    router.push('/app/auth/login');
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 1.25, px: !drawerOpen ? 1.25 : 3, borderTop: '2px solid ', borderTopColor: 'divider' }}>
      <List disablePadding>
        <ListItem
          disablePadding
          secondaryAction={
            <ExpandMore
              sx={{ svg: { height: 20, width: 20 } }}
              theme={theme}
              expand={open}
              drawerOpen={drawerOpen}
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              aria-label="show more"
            >
              <ArrowRight2 style={{ fontSize: '0.625rem' }} />
            </ExpandMore>
          }
          sx={{
            ...(!drawerOpen && { display: 'flex', justifyContent: 'flex-end' }),
            '& .MuiListItemSecondaryAction-root': { right: !drawerOpen ? 16 : -16 }
          }}
        >
          <ListItemAvatar>
            <Avatar alt="Avatar" src={avatar1} sx={{ ...(drawerOpen && { width: 46, height: 46 }) }} />
          </ListItemAvatar>
          <ListItemText primary={user ? user?.name : ''} sx={{ ...(!drawerOpen && { display: 'none' }) }} secondary={user ? <>
            <Chip size='small' variant="combined"
              color="primary" sx={{paddingLeft: 1}} label={<Chip size='small' color="info" label={diffInDays(user.membership.membership_end_date)} />} avatar={
                <>{user.membership.membership_package_name}</>
              } />
          </> : <>{'-'}</>} />
        </ListItem>
      </List>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuItem onClick={handleLogout}>{intl.formatMessage({ id: "logout" })}</MenuItem>
        <MenuItem component={Link} href="#" onClick={handleClose}>
          Profile
        </MenuItem>
        <MenuItem component={Link} href="#" onClick={handleClose}>
          My account
        </MenuItem>
      </Menu>
    </Box>
  );
}
