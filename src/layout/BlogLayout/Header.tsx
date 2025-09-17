// next
import Link from 'next/link';

// material-ui
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Links from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import Logo from 'components/logo';

// assets
import { ExportSquare } from 'iconsax-react';

// ==============================|| COMPONENTS - APP BAR ||============================== //

export default function Header() {
  return (
      <AppBar
        sx={{
          bgcolor: '#F8F9FA',
          backdropFilter: 'blur(8px)',
          color: '#1D2630',
          boxShadow: 'none'
        }}
      >
        <Container maxWidth="xl" disableGutters={true}>
          <Toolbar sx={{ px: { xs: 1.5, sm: 4, md: 0, lg: 0 }, py: 1 }}>
            <Stack direction="row" sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} alignItems="center">
              <Box sx={{ display: 'inline-block' }}>
                <Logo reverse to="/" />
              </Box>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                '& .header-link': { 
                  fontFamily: 'var(--font-poppins)',
                  color: "#5B6B79",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  lineHeight: "1.57",
                  '&:hover': { color: '#60d99d !important' },
                  '&:visited': { color: '#5B6B79' } 
                },
                '& .header-link-active': {
                  fontWeight: 500,
                  color: '#60d99d'
                },
                display: { xs: 'none', md: 'flex' }
              }}
              spacing={3}
            >
              <Links
                className={"header-link"}
                sx={{ ml: 3 }}
                color="secondary.main"
                component={Link}
                href="/"
                underline="none"
              >
                Ana Sayfa
              </Links>
              <Links 
                className={"header-link"}
                color="secondary.main" 
                component={Link} 
                href="/hakkimizda" 
                underline="none">
                Hakkımızda
              </Links>
              <Links
                className={"header-link"}
                color="secondary.main"
                href="/fiyatlar"
                underline="none"
              >
                Fiyatlar
              </Links>
              <Links
                className={"header-link"}
                color="secondary.main"
                href="/tanitim-ve-ozellikler"
                underline="none"
              >
                Tanıtım ve Özellikler
              </Links>
              <Links
                className={"header-link"}
                color="secondary.main"
                href="/iletisim"
                underline="none"
              >
                Bize Ulaşın
              </Links>
              <Box sx={{ display: 'inline-block' }}>
                <AnimateButton>
                  <Button
                    component={Links}
                    href={"/auth/login"}
                    target="_blank"
                    disableElevation
                    startIcon={<ExportSquare />}
                    color="success"
                    size="large"
                    variant="contained"
                    sx={{
                      fontFamily: 'var(--font-poppins)',
                      fontWeight: "300",
                      backgroundColor: "#60d99d",
                      borderRadius: "8px",
                      textTransform: "capitalize"
                    }}
                  >
                    {"Giriş Yap"}
                  </Button>
                </AnimateButton>
              </Box>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
  );
}
