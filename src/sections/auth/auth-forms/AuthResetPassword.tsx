'use client';

// next
import { useRouter, useSearchParams } from 'next/navigation';

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
import { useResetPasswordMutation } from 'reduxt/features/auth/auth-api';
import { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { PuffLoader } from 'react-spinners';

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

export default function AuthResetPassword() {
  const router = useRouter();

  const searchParams = useSearchParams()
  const resetToken = searchParams.get('reset_token')

  const [resetPassword, { isLoading: forgetPasswordIsLoading, data: resetPasswordResponse, error: resetPasswordError }] = useResetPasswordMutation();

  useEffect(() => {
    if (resetPasswordResponse) {
      enqueueSnackbar(resetPasswordResponse.message, {
        variant: resetPasswordResponse?.success == true ? 'success' : 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
      if (resetPasswordResponse?.success == true) {
        setTimeout(() => {
          router.push("/auth/login")
        }, 1000)
      }
    }
    if (resetPasswordError) {
      var error = resetPasswordError as any;
      enqueueSnackbar(error.data?.message ?? "Hata", {
        variant: 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
    }
  }, [resetPasswordResponse, resetPasswordError])

  return (
    <Formik
      initialValues={{
        reset_token: "",
        new_password: "",
        confirm_password: "",
      }}
      validationSchema={Yup.object({
        new_password: Yup.string()
          .matches(/^\S+(?: \S+)*$/, { message: "Boşluklar içermemelidir." })
          .min(6, "Çok Kısa")
          .max(20, "Çok Uzun")
          .required("Bu alan zorunlu"),
        confirm_password: Yup.string()
          .oneOf([Yup.ref('new_password'), undefined], 'Şifreler eşleşmedi.')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        values.reset_token = resetToken ?? "";
        resetPassword(values);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-forgot">Yeni Şifre</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.new_password && errors.new_password)}
                  id="email-forgot"
                  type="password"
                  value={values.new_password}
                  name="new_password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Yeni Şifre"
                  inputProps={{}}
                />
              </Stack>
              {touched.new_password && errors.new_password && (
                <FormHelperText error id="helper-text-email-forgot">
                  {errors.new_password}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-forgot">Yeni Şifre</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.confirm_password && errors.confirm_password)}
                  id="email-forgot"
                  type="password"
                  value={values.confirm_password}
                  name="confirm_password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Yeni Şifre"
                  inputProps={{}}
                />
              </Stack>
              {touched.confirm_password && errors.confirm_password && (
                <FormHelperText error id="helper-text-email-forgot">
                  {errors.confirm_password}
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
