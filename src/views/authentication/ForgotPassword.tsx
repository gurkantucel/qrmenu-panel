// next
import Link from 'next/link';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import ForgotPasswordForm from 'sections/auth/auth-forms/AuthForgotPassword';

// ================================|| FORGOT PASSWORD ||================================ //

export default function ForgotPassword() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Şifremi Unuttum</Typography>
            <Typography component={Link} href="/auth/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Giriş Yap
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <ForgotPasswordForm />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
