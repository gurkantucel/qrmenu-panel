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
import { Formik } from 'formik';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';

// types
import { useForgetPasswordMutation } from 'reduxt/features/auth/auth-api';
import { useCallback, useEffect } from 'react';
import { PuffLoader } from 'react-spinners';
import { useAppSnackbar } from 'hooks/useAppSnackbar';
import { useIntl } from 'react-intl';
import { forgotPasswordValidationSchema } from 'utils/schemas/auth-validation-schema';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

export default function AuthForgotPassword() {
  const router = useRouter();

  const intl = useIntl()

  const [forgetPassword, { isLoading: forgetPasswordIsLoading, data: forgetPasswordResponse, error: forgetPasswordError }] = useForgetPasswordMutation();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const { showMessage } = useAppSnackbar();

  const submitForgotPassword = useCallback(async (values: {
    email: string;
  }) => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }
    if (typeof window !== "undefined") {
      const token = await executeRecaptcha('yourAction');
      const model = { ...values, recaptcha: token };
      forgetPassword(model);
    }
    // Do whatever you want with the token
  }, [executeRecaptcha]);

  useEffect(() => {
    if (forgetPasswordResponse) {
      showMessage(forgetPasswordResponse.message, forgetPasswordResponse?.success);
      if (forgetPasswordResponse?.success == true) {
        setTimeout(() => {
          router.push("/auth/login")
        }, 1000)
      }
    }
    if (forgetPasswordError) {
      var error = forgetPasswordError as any;
      showMessage(error?.data?.message, false);
    }
  }, [forgetPasswordResponse, forgetPasswordError])

  return (
    <Formik
      initialValues={{
        email: '',
      }}
      validationSchema={forgotPasswordValidationSchema(intl)}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        submitForgotPassword(values);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-forgot">{intl.formatMessage({ id: "email" })}</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                  id="email-forgot"
                  type="email"
                  value={values.email}
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder={intl.formatMessage({ id: "email" })}
                  inputProps={{}}
                />
              </Stack>
              {touched.email && errors.email && (
                <FormHelperText error id="helper-text-email-forgot">
                  {errors.email}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting || forgetPasswordIsLoading} fullWidth size="large" type="submit" variant="contained" color="primary">
                  {forgetPasswordIsLoading && <PuffLoader size={20} color='white' />}
                  {forgetPasswordIsLoading == false && intl.formatMessage({ id: "sendPasswordResetLink" })}
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
