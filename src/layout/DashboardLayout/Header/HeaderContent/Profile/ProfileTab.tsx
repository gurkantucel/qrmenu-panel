"use client"
// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import { Logout, PasswordCheck } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

interface Props {
  handleLogout: () => void;
}

export default function ProfileTab({ handleLogout }: Props) {
  //const [selectedIndex, setSelectedIndex] = useState<number>();
  /*const handleListItemClick = (event: MouseEvent<HTMLDivElement>, index: number) => {
    setSelectedIndex(index);
  };*/
  const router = useRouter();
  const intl = useIntl()

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      {/*<ListItemButton selected={selectedIndex === 0} onClick={(event: MouseEvent<HTMLDivElement>) => handleListItemClick(event, 0)}>
        <ListItemIcon>
          <Edit2 variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" />
      </ListItemButton>*/}
      <ListItemButton onClick={()=>{router.push("/user/update-password")}}>
        <ListItemIcon>
          <PasswordCheck variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: "changePassword" })} />
      </ListItemButton>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <Logout variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: "logout" })} />
      </ListItemButton>
    </List>
  );
}
