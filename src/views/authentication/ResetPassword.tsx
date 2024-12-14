// next
import Link from 'next/link';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import ResetPasswordForm from 'sections/auth/auth-forms/AuthResetPassword';

// ================================|| FORGOT PASSWORD ||================================ //

export default function ForgotPassword() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Şifremi Unuttum</Typography>
            <Typography component={Link} href="/app/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Giriş Yap
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <ResetPasswordForm />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
