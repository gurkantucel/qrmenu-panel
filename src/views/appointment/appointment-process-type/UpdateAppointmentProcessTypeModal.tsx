"use client"

import { Box, Button, Dialog, DialogActions, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material"
import { CloseSquare } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Form, Formik } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect } from "react";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import { updateAppointmentProcessTypeSchema } from "utils/schemas/appointment-validation-schema";
import { useUpdateAppointmentProcessTypeMutation } from "reduxt/features/appointment/appointment-process-type-api";

const UpdateAppointmentProcessTypeModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const handleClose = () => {
        dispatch(closeModal())
    };

    const [updateAppointmentProcessType, { isLoading: updateAppointmentProcessTypeIsLoading, data: updateAppointmentProcessTypeResponse, error: updateAppointmentProcessTypeError }] = useUpdateAppointmentProcessTypeMutation();

    useEffect(() => {
        if (updateAppointmentProcessTypeResponse) {
            enqueueSnackbar(updateAppointmentProcessTypeResponse.message, {
                variant: updateAppointmentProcessTypeResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateAppointmentProcessTypeResponse?.status == true) {
                handleClose();
            }
        }
        if (updateAppointmentProcessTypeError) {
            var error = updateAppointmentProcessTypeError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateAppointmentProcessTypeResponse, updateAppointmentProcessTypeError])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.updateAppointmentProcessType} onClose={handleClose} fullWidth maxWidth="md">
                <Formik
                    initialValues={{
                        appointment_process_history_id: data?.appointment_process_history_id,
                        appointment_id: data?.appointment_id,
                        amount: data?.amount,
                    }}
                    enableReinitialize
                    validationSchema={updateAppointmentProcessTypeSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        updateAppointmentProcessType(values);
                    }}
                >
                    {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <Form>
                            <Box sx={{ px: 3, py: 3 }}>
                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 4 }}
                                >
                                    <Grid item>
                                        <Typography variant="h4">{`${intl.formatMessage({ id: "newProcess" })}`}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={48} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="person_id">{`${intl.formatMessage({ id: "appointmentProcess" })}*`}</InputLabel>
                                            <CustomFormikSelect
                                                name={`appointmentProcess`}
                                                placeholder={intl.formatMessage({ id: "selectAppointmentProcess" })}
                                                zIndex={9999}
                                                isDisabled
                                                value={{ label: data?.name, value: data?.code }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="person_id">
                                                {`${intl.formatMessage({ id: "amount" })}*`}</InputLabel>
                                            <OutlinedInput
                                                id="name"
                                                type="number"
                                                value={values.amount}
                                                name={`amount`}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "amount" })}
                                                fullWidth
                                                startAdornment={<>{data?.currency_code ?? ""}</>}
                                                error={Boolean(touched.amount && errors.amount)}
                                            />
                                        </Stack>
                                        {touched.amount && errors.amount && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {`${errors.amount}`}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting || updateAppointmentProcessTypeIsLoading} type="submit" variant="contained" color="primary">
                                            {(updateAppointmentProcessTypeIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(updateAppointmentProcessTypeIsLoading == false) && intl.formatMessage({ id: "save" })}
                                        </Button>
                                    </AnimateButton>
                                </DialogActions>
                            </Box>
                        </Form>
                    )}
                </Formik >
            </Dialog>
        </>
    )
}

export default UpdateAppointmentProcessTypeModal