// material-ui
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

// ==============================|| Loader ||============================== //

export default function Loader() {
  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, zIndex: 2001, width: '100%' }}>
      <LinearProgress sx={{
        height: 4,
        backgroundColor: 'white',
        '& .MuiLinearProgress-bar': {
          backgroundColor: '#60d99d'
        }
      }} />
    </Box>
  );
}
