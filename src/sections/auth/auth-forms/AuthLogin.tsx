'use client';

import { useState, SyntheticEvent, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';

// third-party
import { Formik } from 'formik';
import { setCookie } from "cookies-next"
import { PuffLoader } from "react-spinners"
// project-imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import { useLoginMutation } from 'reduxt/features/auth/auth-api';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { loginValidationSchema } from 'utils/schemas/auth-validation-schema';
import Link from 'next/link';
import Typography from '@mui/material/Typography';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ providers, csrfToken }: any) {

  const [login, { isLoading: loginIsLoading, data: loginResponse, error: loginError }] = useLoginMutation();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (loginResponse) {
      enqueueSnackbar(loginResponse.message, {
        variant: loginResponse?.status == true ? 'success' : 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
      if (loginResponse?.status == true) {
        setCookie("token", loginResponse.data.token)
        setCookie("refreshToken", loginResponse.data.refresh_token)
        setTimeout(() => {
          router.push("/app/home")
        }, 500)
      }
    }
    if (loginError) {
      var error = loginError as any;
      enqueueSnackbar(error.data?.message ?? "Hata", {
        variant: 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
    }
  }, [loginResponse, loginError])

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={loginValidationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          login(values);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">E-Posta</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="E-Posta"
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                  />
                </Stack>
                {touched.username && errors.username && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.username}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Şifre</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <Eye /> : <EyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Şifre"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
                  <Typography component={Link} href={'/app/auth/forgot-password'} variant="body1" sx={{ textDecoration: 'none' }} color="InfoText">
                    {"Şifremi unuttum?"}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting || loginIsLoading} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {loginIsLoading && <PuffLoader size={20} color='white' />}
                    {loginIsLoading == false && "Giriş Yap"}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
