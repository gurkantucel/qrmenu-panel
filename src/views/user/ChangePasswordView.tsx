'use client';

import { useEffect, useState, SyntheticEvent } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';

// third-party
import { Formik } from 'formik';

// project-imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { strengthColor, strengthIndicator } from 'utils/password-strength';

// types
import { StringColorProps } from 'types/password';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import { useIntl } from 'react-intl';
import { updatePasswordValidationSchema } from 'utils/schemas/auth-validation-schema';
import { APP_DEFAULT_PATH } from 'config';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';
import { enqueueSnackbar } from 'notistack';
import { setCookie } from 'cookies-next';
import { PuffLoader } from 'react-spinners';
import { useChangePasswordMutation } from 'reduxt/features/user/user-api';

// ============================|| FIREBASE - RESET PASSWORD ||============================ //

export default function ChangePasswordView() {
  const intl = useIntl()

  const breadcrumbLinks = [
    { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
    { title: `${intl.formatMessage({ id: "changePassword" })}` },
  ];

  const [changePassword, { isLoading: changePasswordIsLoading, data: changePasswordResponse, error: changePasswordError }] = useChangePasswordMutation();

  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePasswordHandle = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePasswordHandle('');
  }, []);

  useEffect(() => {
    if (changePasswordResponse) {
      enqueueSnackbar(changePasswordResponse.message, {
        variant: changePasswordResponse?.success == true ? 'success' : 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
      if (changePasswordResponse?.success == true) {
        setCookie("token", changePasswordResponse.data.token)
        setCookie("refreshToken", changePasswordResponse.data.refresh_token)
      }
    }
    if (changePasswordError) {
      var error = changePasswordError as any;
      enqueueSnackbar(error.data?.message ?? "Hata", {
        variant: 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
    }
  }, [changePasswordResponse, changePasswordError])

  return (
    <>
      <Breadcrumbs custom heading={`${intl.formatMessage({ id: "changePassword" })}`} links={breadcrumbLinks} />
      <MainCard content={true}>
        <Formik
          initialValues={{
            oldPassword: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={updatePasswordValidationSchema(intl)}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            const newModel = {oldPassword: values.oldPassword, password: values.password}
            changePassword(newModel);
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-reset">{intl.formatMessage({ id: "oldPassword" })}</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.oldPassword && errors.oldPassword)}
                      id="oldPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={values.oldPassword}
                      name="oldPassword"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                      }}
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
                      placeholder={intl.formatMessage({ id: "oldPassword" })}
                    />
                  </Stack>
                  {touched.oldPassword && errors.oldPassword && (
                    <FormHelperText error id="helper-text-password-reset">
                      {errors.oldPassword}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-reset">{intl.formatMessage({ id: "newPassword" })}</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="password-reset"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        changePasswordHandle(e.target.value);
                      }}
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
                      placeholder={intl.formatMessage({ id: "newPassword" })}
                    />
                  </Stack>
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-reset">
                      {errors.password}
                    </FormHelperText>
                  )}
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1" fontSize="0.75rem">
                          {intl.formatMessage({ id: level?.label ?? "poor" })}
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="confirm-password-reset">{intl.formatMessage({ id: "repeatNewPassword" })}</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                      id="confirm-password-reset"
                      type="password"
                      value={values.confirmPassword}
                      name="confirmPassword"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder={intl.formatMessage({ id: "repeatNewPassword" })}
                    />
                  </Stack>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <FormHelperText error id="helper-text-confirm-password-reset">
                      {errors.confirmPassword}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting || changePasswordIsLoading} fullWidth size="large" type="submit" variant="contained" color="primary">
                      {changePasswordIsLoading && <PuffLoader size={20} color='white' />}
                      {changePasswordIsLoading == false && `${intl.formatMessage({ id: "changePassword" })}`}
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </MainCard>
    </>
  );
}
