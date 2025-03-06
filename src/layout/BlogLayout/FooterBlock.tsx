// material-ui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// assets
import { Youtube, Instagram } from 'iconsax-react';
import FooterElement from './FooterElement';
import LogoBankIcons from 'sections/landing/LogoBankIcons';

type showProps = {
  isFull?: boolean;
};

// ==============================|| LANDING - FOOTER PAGE ||============================== //

export default function FooterBlock({ isFull }: showProps) {

  const linkSX = {
    color: '#8996A4',
    fontWeight: 400,
    opacity: '0.6',
    cursor: 'pointer',
    '&:hover': {
      opacity: '1'
    }
  };

  return (
    <>
      <Box sx={{ pt: isFull ? 5 : 10, pb: 10, bgcolor: '#F3F5F7', borderTop: `1px solid #F8F9FA` }}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FooterElement />
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={{ xs: 5, md: 2 }} sx={{
                fontFamily: 'var(--font-poppins)',
                fontSize: "0.875rem",
                'a': {
                  color: "#1D2630",
                },
                'a:hover' : {
                  color: "#60d99d"
                }
              }}>
                <Grid item xs={6} sm={4}>
                  <Stack spacing={3}>
                    <Typography variant="h5" sx={{
                      fontWeight: 600,
                      fontSize: "1rem"
                    }}>Sözleşmeler</Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <Link href="/teslimat-ve-iade-sartlari" underline="none">
                        {"Teslimat ve İade Şartları"}
                      </Link>
                      <Link href="/uyelik-sozlesmesi" underline="none">
                        {"Üyelik Sözleşmesi"}
                      </Link>
                      <Link href="/gizlilik-sozlesmesi" underline="none">
                        {"Gizlilik Sözleşmesi"}
                      </Link>
                      <Link href="/mesafeli-satis-sozlesmesi" underline="none">
                        {"Mesafeli Satış Sözleşmesi"}
                      </Link>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Stack spacing={3}>
                    <Typography variant="h5" sx={{
                      fontWeight: 600,
                      fontSize: "1rem"
                    }}>Klinik Ease</Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <Link href="/hakkimizda" underline="none">
                        {"Hakkımızda"}
                      </Link>
                      <Link href="/iletisim" underline="none">
                        {"İletişim"}
                      </Link>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Stack spacing={3}>
                    <Typography variant="h5" sx={{
                      fontWeight: 600,
                      fontSize: "1rem"
                    }}>{"Özellikler"}</Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <Link href="/tanitim-ve-ozellikler" underline="none">
                        {"Öne Çıkan Özellikler"}
                      </Link>
                      <Link href="/blog" underline="none">
                        {"Blog"}
                      </Link>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box
        sx={{
          py: 2.4,
          borderTop: `1px solid #F8F9FA`,
          bgcolor: '#F3F5F7'
        }}
      >
        <Container>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Typography>
                2025 - KlinikEase
              </Typography>
              <LogoBankIcons />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid container spacing={2} alignItems="center" sx={{ justifyContent: 'flex-end' }}>
                <Grid item>
                  <Tooltip title="Instagram">
                    <Link href="#" underline="none" target="_blank" sx={linkSX}>
                      <Instagram variant='Bold' size={20} />
                    </Link>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Youtube">
                    <Link href="#" underline="none" target="_blank" sx={linkSX}>
                      <Youtube variant="Bold" size={20} />
                    </Link>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
