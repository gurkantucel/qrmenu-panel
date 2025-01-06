// next
import Link from 'next/link';
import Image from 'next/image'

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import LoginForm from 'sections/auth/auth-forms/AuthLogin';

// ================================|| LOGIN ||================================ //

export default function Login() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container xs={12} marginBottom={5} justifyContent={"center"}>
            <Image src={"/assets/images/klinik_ease_logo.png"} width={256} height={52} alt='Logo' quality={100} />
          </Grid>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Üye Girişi</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <LoginForm />
        </Grid>
        <Grid item xs={12} alignItems={'center'}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Typography component={Link} href={'/app/auth/register'} variant="body1" sx={{ textDecoration: 'none' }} color="primary" passHref>
              {"Hesabınız yok mu? Kayıt Olun"}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
