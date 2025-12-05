// material-ui
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

// project-imports
import useUser from 'hooks/useUser';
import { useGetMenuMaster } from 'api/menu';

// assets
import NameAvatar from 'components/NameAvatar';

/*interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
  drawerOpen: boolean;
}*/

/*const ExpandMore = styled(({ expand, drawerOpen, ...other }: ExpandMoreProps) => {
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
}));*/

// ==============================|| LIST - USER ||============================== //

export default function UserList() {
  //const theme = useTheme();
  //const router = useRouter();
  const user = useUser();
 // const intl = useIntl()
  //const dispatch = useAppDispatch();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  /*const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("refreshToken");
    deleteCookie("personAuthorizations");
    deleteCookie("membership");
    dispatch(resetMenuItemState());
    router.push('/auth/login');
  };*/

  //const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  /*const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };*/

  return (
    <Box sx={{ p: 1.25, px: !drawerOpen ? 1.25 : 3, borderTop: '2px solid ', borderTopColor: 'divider' }}>
      <List disablePadding>
        <ListItem
          disablePadding
          /*secondaryAction={
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
          }*/
          sx={{
            ...(!drawerOpen && { display: 'flex', justifyContent: 'flex-end' }),
            '& .MuiListItemSecondaryAction-root': { right: !drawerOpen ? 16 : -16 }
          }}
        >
          <ListItemAvatar>
            <NameAvatar fullName={user ? user.name : ""} />
          </ListItemAvatar>
          <ListItemText primary={user ? user?.name : ''} sx={{ ...(!drawerOpen && { display: 'none' }) }} />
        </ListItem>
      </List>
      {/*<Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuItem component={Link} href="/app/order-list" onClick={handleClose}>
          {intl.formatMessage({id: "myOrders"})}
        </MenuItem>
        <MenuItem onClick={handleLogout}>{intl.formatMessage({ id: "logout" })}</MenuItem>
      </Menu>*/}
    </Box>
  );
}
