'use client';
// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { motion } from 'framer-motion';

// assets
import AnimateButton from 'components/@extended/AnimateButton';
import { useRouter } from 'next/navigation';


// ==============================|| LANDING - HERO PAGE ||============================== //

export default function HeroPage() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/tanitim-ve-ozellikler")
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', pb: 10.5, pt: 10, display: 'flex', alignItems: 'center',
      background: "url('assets/images/doctor-bg.png')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom right",
      backgroundSize: 'contain'
    }}>
      <Container>
        <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ pt: { md: 0, xs: 10 }, pb: { md: 0, xs: 22 } }}>
          <Grid item xs={12} md={9}>
            <Grid container spacing={3} sx={{ textAlign: 'center' }}>
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, translateY: 550 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 30 }}
                >
                  <Typography
                    variant="h1"
                    sx={{ fontSize: { xs: '1.825rem', sm: '2rem', md: '3.4375rem' }, fontWeight: 700, lineHeight: 1.2 }}
                  >
                    Doktorlar ve Klinikler İçin{' '}
                    <Typography
                      variant="h1"
                      component="span"
                      sx={{
                        fontSize: 'inherit',
                        /*background: 'linear-gradient(90deg, rgb(37, 161, 244), rgb(249, 31, 169), rgb(37, 161, 244)) 0 0 / 400% 100%',*/
                        background: 'linear-gradient(90deg, rgb(96 217 157), rgb(52 139 63), rgb(96 217 157)) 0 0 / 400% 100%',
                        color: 'transparent',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        animation: 'move-bg 24s infinite linear',
                        '@keyframes move-bg': { '100%': { backgroundPosition: '400% 0' } }
                      }}
                    >
                      KlinikEase’de
                    </Typography>{' '}
                    Yeni Dönem
                  </Typography>
                </motion.div>
              </Grid>
              <Grid container justifyContent="center" item xs={12}>
                <Grid item xs={8}>
                  <motion.div
                    initial={{ opacity: 0, translateY: 550 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 400, lineHeight: { xs: 1.4, md: 1.4 } }}
                    >
                      Yeni başlıyor olun, ya da köklü bir klinik. Klinik Ease, işinizi kolaylaştırmak için ihtiyacınız olan her şeye sahiptir.
                    </Typography>
                  </motion.div>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, translateY: 550 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.4 }}
                >
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                      <AnimateButton>
                        <Button
                          aria-haspopup="true"
                          onClick={handleClick}
                          size="large"
                          color="primary"
                          variant="contained"
                        >
                          Özellikleri İncele
                        </Button>
                      </AnimateButton>
                    </Grid>
                  </Grid>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
