"use client"
import MainCard from 'components/MainCard'
import { Box, Button, FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Switch, Typography } from '@mui/material';
import { useCreateSmsIntegrationMutation, useReadSmsIntegrationQuery, useUpdateSmsIntegrationMutation } from 'reduxt/features/sms-integration/sms-integration-api';
import CustomScaleLoader from 'components/CustomScaleLoader';
import { Form, Formik } from 'formik';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { UpdateSmsInfoBodyModel } from 'reduxt/features/sms-integration/models/sms-integration-model';
import AnimateButton from 'components/@extended/AnimateButton';
import { PuffLoader } from 'react-spinners';
import { enqueueSnackbar } from 'notistack';
import { Eye, EyeSlash } from 'iconsax-react';

const SmsIntegrationView = () => {

  const intl = useIntl()
  const { data: getSmsIntegrationData, isLoading: isSmsIntegrationLoading, isFetching: isSmsIntegrationFetching } = useReadSmsIntegrationQuery()

  const [createSmsIntegration, { isLoading: createSmsIntegrationIsLoading, data: createSmsIntegrationResponse, error: createSmsIntegrationError }] = useCreateSmsIntegrationMutation();
  const [updateSmsIntegration, { isLoading: updateSmsIntegrationIsLoading, data: updateSmsIntegrationResponse, error: updateSmsIntegrationError }] = useUpdateSmsIntegrationMutation();

  const [initialData, setInitialData] = useState<UpdateSmsInfoBodyModel>();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (getSmsIntegrationData?.data != null) {
      const model: UpdateSmsInfoBodyModel = {
        header: getSmsIntegrationData.data?.header,
        username: getSmsIntegrationData.data?.username,
        password: getSmsIntegrationData.data?.password,
        status: getSmsIntegrationData.data?.status,
      }
      setInitialData(model);
    }
  }, [getSmsIntegrationData?.data])

  useEffect(() => {
    if (updateSmsIntegrationResponse) {
      enqueueSnackbar(updateSmsIntegrationResponse.message, {
        variant: updateSmsIntegrationResponse?.status == true ? 'success' : 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
    }
    if (updateSmsIntegrationError) {
      var error = updateSmsIntegrationError as any;
      enqueueSnackbar(error.data?.message ?? "Hata", {
        variant: 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
    }
  }, [updateSmsIntegrationResponse, updateSmsIntegrationError])

  useEffect(() => {
    if (createSmsIntegrationResponse) {
      enqueueSnackbar(createSmsIntegrationResponse.message, {
        variant: createSmsIntegrationResponse?.status == true ? 'success' : 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
    }
    if (createSmsIntegrationError) {
      var error = createSmsIntegrationError as any;
      enqueueSnackbar(error.data?.message ?? "Hata", {
        variant: 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
    }
  }, [createSmsIntegrationResponse, createSmsIntegrationError])

  return (
    <MainCard content={false}>
      <Box padding={2}>
        <Typography variant='h4' margin={1}>{intl.formatMessage({ id: "smsIntegration" })}</Typography>
        <Typography margin={1}>{intl.formatMessage({ id: "smsHeaderText" })}</Typography>
        {isSmsIntegrationLoading || isSmsIntegrationFetching ? <CustomScaleLoader /> : <Formik
          enableReinitialize
          initialValues={initialData ?? {
            "header": "",
            "username": "",
            "password": "",
            "status": true
          }}
          onSubmit={(values) => {
            if (getSmsIntegrationData?.data != null && getSmsIntegrationData.data.current_account_sms_info_id != null) {
              updateSmsIntegration(values);
            } else {
              createSmsIntegration(values);
            }
          }}
        >
          {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <Form>
              <Box sx={{ px: 1, py: 1 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "smsHeader" })}{"*"}</InputLabel>
                      <OutlinedInput
                        id="header"
                        type="text"
                        value={values.header}
                        name="header"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={intl.formatMessage({ id: "name" })}
                        fullWidth
                        error={Boolean(touched.header && errors.header)}
                      />
                    </Stack>
                    {touched.header && errors.header && (
                      <FormHelperText error id="helper-text-firstname-signup">
                        {errors.header}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={3} marginTop={0.1}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "name" })}{"*"}</InputLabel>
                      <OutlinedInput
                        id="username"
                        type="text"
                        value={values.username}
                        name="username"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={intl.formatMessage({ id: "name" })}
                        fullWidth
                        error={Boolean(touched.username && errors.username)}
                      />
                    </Stack>
                    {touched.username && errors.username && (
                      <FormHelperText error id="helper-text-firstname-signup">
                        {errors.username}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "password" })}{"*"}</InputLabel>
                      <OutlinedInput
                        id="username"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={intl.formatMessage({ id: "password" })}
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showPassword ? 'hide the password' : 'display the password'
                              }
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              onMouseUp={handleMouseUpPassword}
                              edge="end"
                            >
                              {showPassword ? <EyeSlash /> : <Eye />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </Stack>
                    {touched.password && errors.password && (
                      <FormHelperText error id="helper-text-firstname-signup">
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ marginTop: 3 }}>
                  <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "status" })}</InputLabel>
                  <FormControlLabel control={<Switch
                    checked={values.status}
                    value={values.status} onChange={(e, checked) => {
                      setFieldValue("status", checked);
                    }} />} label={intl.formatMessage({ id: values.status ? "active" : "passive" })} />
                </Grid>
                <Grid container marginTop={2} justifyContent={"end"}>
                  <AnimateButton>
                    <Button disableElevation disabled={isSubmitting || updateSmsIntegrationIsLoading || createSmsIntegrationIsLoading} type="submit" variant="contained" color="primary">
                      {(updateSmsIntegrationIsLoading || createSmsIntegrationIsLoading) && <PuffLoader size={20} color='white' />}
                      {(updateSmsIntegrationIsLoading == false || createSmsIntegrationIsLoading == false) && intl.formatMessage({ id: "save" })}
                    </Button>
                  </AnimateButton>
                </Grid>
              </Box>
            </Form>
          )}
        </Formik>}
      </Box>
    </MainCard>
  )
}

export default SmsIntegrationView