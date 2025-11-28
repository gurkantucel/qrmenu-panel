'use client';

import { useState, SyntheticEvent, useEffect, useCallback } from 'react';

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
import { useRouter } from 'next/navigation';
import { loginValidationSchema } from 'utils/schemas/auth-validation-schema';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAppSnackbar } from 'hooks/useAppSnackbar';
import { useIntl } from 'react-intl';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ providers }: any) {

  const [login, { isLoading: loginIsLoading, data: loginResponse, error: loginError }] = useLoginMutation();

  const intl = useIntl()

  const router = useRouter();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const { showMessage } = useAppSnackbar();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const submitLogin = useCallback(async (values: {
    email: string;
    password: string;
  }) => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }
    if (typeof window !== "undefined") {
      const token = await executeRecaptcha('yourAction');
      const model = { ...values, recaptcha: token };
      console.log(`token recapthca ${token}`)
      login(model);
    }
    // Do whatever you want with the token
  }, [executeRecaptcha]);

  useEffect(() => {
    if (loginResponse) {
      showMessage(loginResponse.message, loginResponse.success);
      if (loginResponse?.success == true) {
        setCookie("token", loginResponse.data.idToken)
        setCookie("refreshToken", loginResponse.data.refreshToken)
        setCookie("displayName", loginResponse.data.displayName)
        setTimeout(() => {
          router.push("/home")
        }, 200)
      }
    }
    if (loginError) {
      var error = loginError as any;
      if (error.data?.message == "LOGIN_REQUIRED_PAYMENT") {
        showMessage(error?.data?.message, false);
        if (error.data.data) {
          setTimeout(() => {
            router.push(`/auth/pay-form/${error.data.data[0]}`)
          }, 200)
        }
        return;
      }
      showMessage(error?.data?.message, false);
    }
  }, [loginResponse, loginError])

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={loginValidationSchema(intl)}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          submitLogin(values);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">{intl.formatMessage({id: "email"})}</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={intl.formatMessage({id: "email"})}
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">{intl.formatMessage({id: "password"})}</InputLabel>
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
                    placeholder={intl.formatMessage({id: "password"})}
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
                  <Typography component={Link} href={'/auth/forgot-password'} variant="body1" sx={{ textDecoration: 'none' }} color="InfoText">
                    {intl.formatMessage({id: "forgotMyPassword"})}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='caption' sx={{ fontSize: 10, color: "#999" }}>Bu site reCAPTCHA tarafından korunmaktadır ve <a rel="nofollow" target='_blank' href="https://policies.google.com/privacy" style={{ color: "#999" }}>Google Gizlilik Politikası</a> ile <a rel="nofollow" target='_blank' href="https://policies.google.com/terms" style={{ color: "#999" }}>Hizmet Şartları</a> geçerlidir.</Typography>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting || loginIsLoading} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {loginIsLoading && <PuffLoader size={20} color='white' />}
                    {loginIsLoading == false && intl.formatMessage({id: "signIn"})}
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
