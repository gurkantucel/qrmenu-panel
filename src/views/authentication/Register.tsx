// next
import Link from 'next/link';
import Image from 'next/image'
// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import RegisterForm from 'sections/auth/auth-forms/AuthRegister';

// ================================|| REGISTER ||================================ //

export default function Register() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container xs={12} marginBottom={5} justifyContent={"center"}>
           <Image src={"/assets/images/logo_new_27.png"} width={350} height={70} alt='Klinik Ease' quality={100} className='mobil-logo' />
          </Grid>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Kayıt Ol</Typography>
            <Typography component={Link} href={'/app/auth/login'} variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              {"Zaten üye misiniz? Giriş Yap"}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <RegisterForm />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
