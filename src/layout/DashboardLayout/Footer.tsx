// next
import Link from 'next/link';

// material-ui
import Links from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useIntl } from 'react-intl';

// ==============================|| MAIN LAYOUT - FOOTER ||============================== //

export default function Footer() {
   const intl = useIntl()
   
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: '24px 16px 0px', mt: 'auto' }}>
      <Typography variant="caption">&copy; QRChefs ♥</Typography>
      <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center">
        <Links component={Link} href="#" target="_blank" variant="caption" color="text.primary">
          {intl.formatMessage({id: "home"})}
        </Links>
        <Links component={Link} href="#" target="_blank" variant="caption" color="text.primary">
        {intl.formatMessage({id: "helpfulVideos"})}
        </Links>
        <Links component={Link} href="#" target="_blank" variant="caption" color="text.primary">
        {intl.formatMessage({id: "contact"})}
        </Links>
      </Stack>
    </Stack>
  );
}
