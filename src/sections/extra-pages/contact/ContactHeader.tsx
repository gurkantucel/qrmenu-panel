// material-ui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// assets
import AuthBackground from '../../../../public/assets/images/auth/AuthBackground';

// ==============================|| CONTACT US - HEADER ||============================== //

export default function ContactHeader() {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', pt: 9, pb: 2 }}>
      <AuthBackground />
      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
        <Box sx={{ width: { xs: '100%', sm: 252, md: 360, lg: 436 }, py: 6, mx: 'auto' }}>
          <Stack spacing={1}>
            <Typography align="center" variant="h2">
              {"Size Yardımcı Olmak İçin Buradayız 😊"}
            </Typography>
            <Typography align="center" color="text.secondary">
              {"Yaşadığınız problemleri ya da merak ettiğiniz soruları cevaplamaktan mutluluk duyarız."}
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
