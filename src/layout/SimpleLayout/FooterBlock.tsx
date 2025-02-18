// material-ui
import { styled, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { motion } from 'framer-motion';

// project-imports
import Logo from 'components/logo';

// assets
import { Dribbble, Facebook, Link2, Youtube, Xrp } from 'iconsax-react';
import LogoBankIcons from 'sections/landing/LogoBankIcons';

// link - custom style
const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover, &:active': {
    color: theme.palette.primary.main
  }
}));

type showProps = {
  isFull?: boolean;
};

// ==============================|| LANDING - FOOTER PAGE ||============================== //

export default function FooterBlock({ isFull }: showProps) {
  const theme = useTheme();

  const linkSX = {
    color: theme.palette.text.secondary,
    fontWeight: 400,
    opacity: '0.6',
    cursor: 'pointer',
    '&:hover': {
      opacity: '1'
    }
  };

  return (
    <>
      <Box sx={{ pt: isFull ? 5 : 10, pb: 10, bgcolor: 'secondary.200', borderTop: `1px solid ${theme.palette.divider}` }}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Logo to="/" />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 400, maxWidth: 320 }}>
                      {"Klinik Ease, sadece bir yazılım değil, aynı zamanda işinizi büyütmenize yardımcı olacak bir iş ortağıdır. İhtiyaçlarınıza özel çözümlerimizle kliniğinizin potansiyelini en üst düzeye çıkarın. Hemen Klinik Ease'i keşfedin ve kliniğiniz için en iyi çözümü bulun."}
                    </Typography>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={{ xs: 5, md: 2 }}>
                <Grid item xs={6} sm={4}>
                  <Stack spacing={3}>
                    <Typography variant="h5">Sözleşmeler</Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <FooterLink href="/article/uyelik-sozlesmesi" target="_blank" underline="none">
                        {"Üyelik Sözleşmesi"}
                      </FooterLink>
                      <FooterLink href="/article/aydinlatma-metni" target="_blank" underline="none">
                        {"Aydınlatma Metni"}
                      </FooterLink>
                      <FooterLink href="/article/kisisel-verilerin-islenmesine-iliskin-acik-riza" target="_blank" underline="none">
                        {"Kişisel Verilerin İşlenmesine ilişkin Açık Rıza"}
                      </FooterLink>
                      <FooterLink href="/article/teslim-iade-sartlari" target="_blank" underline="none">
                        {"Teslimat ve İade Şartları"}
                      </FooterLink>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Stack spacing={3}>
                    <Typography variant="h5">Klinik Ease</Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <FooterLink href="article/hakkimizda" target="_blank" underline="none">
                        {"Hakkımızda"}
                      </FooterLink>
                      <FooterLink href="/iletisim" target="_blank" underline="none">
                        {"İletişim"}
                      </FooterLink>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Stack spacing={3}>
                    <Typography variant="h5">{"Özellikler"}</Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <FooterLink href="#" target="_blank" underline="none">
                        {"Öne Çıkan Özellikler"}
                      </FooterLink>
                      <FooterLink href="#" target="_blank" underline="none">
                        {"Blog"}
                      </FooterLink>
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
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: 'secondary.200'
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
                  <Tooltip title="Linkedin">
                    <Link href="https://in.linkedin.com/company/phoenixcoded" underline="none" target="_blank" sx={linkSX}>
                      <Link2 variant="Bold" size={24} />
                    </Link>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Twitter">
                    <Link href="https://twitter.com/phoenixcoded?lang=en" underline="none" target="_blank" sx={linkSX}>
                      <Xrp variant="Bold" size={16} />
                    </Link>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Facebook">
                    <Link href="https://www.facebook.com/Phoenixcoded/" underline="none" target="_blank" sx={linkSX}>
                      <Facebook variant="Bold" size={20} />
                    </Link>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Dribbble">
                    <Link href="https://dribbble.com/Phoenixcoded" underline="none" target="_blank" sx={linkSX}>
                      <Dribbble variant="Bold" size={20} />
                    </Link>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Youtube">
                    <Link href="https://www.youtube.com/@Phoenixcodedwebsolution?app=desktop" underline="none" target="_blank" sx={linkSX}>
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
