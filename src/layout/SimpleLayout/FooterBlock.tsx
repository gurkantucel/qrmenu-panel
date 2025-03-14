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
import { Youtube, Instagram } from 'iconsax-react';
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
                      <FooterLink href="/teslimat-ve-iade-sartlari" underline="none">
                        {"Teslimat ve İade Şartları"}
                      </FooterLink>
                      <FooterLink href="/uyelik-sozlesmesi" underline="none">
                        {"Üyelik Sözleşmesi"}
                      </FooterLink>
                      <FooterLink href="/gizlilik-sozlesmesi" underline="none">
                        {"Gizlilik Sözleşmesi"}
                      </FooterLink>
                      <FooterLink href="/mesafeli-satis-sozlesmesi" underline="none">
                        {"Mesafeli Satış Sözleşmesi"}
                      </FooterLink>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Stack spacing={3}>
                    <Typography variant="h5">Klinik Ease</Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <FooterLink href="/hakkimizda" underline="none">
                        {"Hakkımızda"}
                      </FooterLink>
                      <FooterLink href="/iletisim" underline="none">
                        {"İletişim"}
                      </FooterLink>
                      <FooterLink href="https://play.google.com/store/apps/details?id=com.tuceldev.klinik_ease" underline="none" target='_blank' title={"Klinik Ease Play Store"}>
                        {"Play Store"}
                      </FooterLink>
                      <FooterLink href="https://apps.apple.com/app/klinik-ease/id6743171410" underline="none" target='_blank' title={"Klinik Ease App Store"}>
                        {"App Store"}
                      </FooterLink>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Stack spacing={3}>
                    <Typography variant="h5">{"Özellikler"}</Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <FooterLink href="/tanitim-ve-ozellikler" underline="none">
                        {"Öne Çıkan Özellikler"}
                      </FooterLink>
                      <FooterLink href="/blog" underline="none">
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
                  <Tooltip title="Instagram">
                    <Link href="#" underline="none" target="_blank" sx={linkSX}>
                      <Instagram variant='Bold' size={20} />
                    </Link>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Youtube">
                    <Link href="https://www.youtube.com/@KlinikEase" rel="nofollow" underline="none" target="_blank" sx={linkSX}>
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
