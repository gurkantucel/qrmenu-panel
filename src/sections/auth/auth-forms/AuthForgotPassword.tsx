'use client';

// next
import { useRouter } from 'next/navigation';

// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';

// types
import { useForgetPasswordMutation } from 'reduxt/features/auth/auth-api';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { PuffLoader } from 'react-spinners';

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

export default function AuthForgotPassword() {
  const router = useRouter();

  const [forgetPassword, { isLoading: forgetPasswordIsLoading, data: forgetPasswordResponse, error: forgetPasswordError }] = useForgetPasswordMutation();

  useEffect(() => {
    if (forgetPasswordResponse) {
      enqueueSnackbar(forgetPasswordResponse.message, {
        variant: forgetPasswordResponse?.status == true ? 'success' : 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
      if (forgetPasswordResponse?.status == true) {
        setTimeout(() => {
          router.push("/app/auth/login")
        }, 1000)
      }
    }
    if (forgetPasswordError) {
      var error = forgetPasswordError as any;
      enqueueSnackbar(error.data?.message ?? "Hata", {
        variant: 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
    }
  }, [forgetPasswordResponse, forgetPasswordError])

  return (
    <Formik
      initialValues={{
        username: '',
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().email('E-Posta girin.').max(255).required('E-Posta girin.')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        forgetPassword(values);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-forgot">E-Posta</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.username && errors.username)}
                  id="email-forgot"
                  type="email"
                  value={values.username}
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="E-Posta"
                  inputProps={{}}
                />
              </Stack>
              {touched.username && errors.username && (
                <FormHelperText error id="helper-text-email-forgot">
                  {errors.username}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting || forgetPasswordIsLoading} fullWidth size="large" type="submit" variant="contained" color="primary">
                {forgetPasswordIsLoading && <PuffLoader size={20} color='white' />}
                {forgetPasswordIsLoading == false && "Şifre Sıfırlama Bağlantısı Gönder"}
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
