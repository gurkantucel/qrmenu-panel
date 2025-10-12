import { Box, Button, Dialog, DialogActions, DialogTitle, FormHelperText, Grid, IconButton, InputLabel, OutlinedInput, Stack } from "@mui/material"
import AnimateButton from "components/@extended/AnimateButton";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { CloseSquare } from "iconsax-react";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from 'react'
import { useIntl } from "react-intl"
import { PuffLoader } from "react-spinners";
import { useGetPaymentMethodDropdownQuery, useGetPaymentStatusDropdownQuery } from "reduxt/features/definition/definition-api";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { TenantPaymentUpdateStatusBodyModel } from "reduxt/features/patient/models/tenant-payment-model";
import { useUpdateTenantPaymentStatusMutation } from "reduxt/features/patient/tenant-payment-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { updatePaymentStatusSchema } from "utils/schemas/patient-validation-schema";

const PatientPaymentUpdateStatusModal = () => {
    const dispatch = useAppDispatch();

    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()


    const [initialData, setInitialData] = useState<TenantPaymentUpdateStatusBodyModel>();

    const [updatePaymentStatus, { isLoading: updateAppointmentStatusIsLoading, data: updateAppointmentStatusResponse, error: updateAppointmentStatusError }] = useUpdateTenantPaymentStatusMutation();

    const { data: getPaymentMethodListData, isLoading: getPaymentMethodListLoading } = useGetPaymentMethodDropdownQuery(undefined, { skip: open == false && modalType != ModalEnum.updateStatusPatientPayment });
    const { data: getPaymentStatusData, isLoading: getPaymentStatusDropdownLoading, isFetching: getPaymentStatusDropdownFetching } = useGetPaymentStatusDropdownQuery(undefined, { skip: modalType != ModalEnum.updateStatusPatientPayment })

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (open == true && modalType == ModalEnum.updateStatusPatientPayment && data != null) {
            setInitialData({
                payment_id: data.payment_id,
                patient_id: data.patient_id,
                payment_method_id: data.payment_method_id,
                payment_status_id: data.payment_status_id,
                payment_date: data.payment_date != null ? dayjs(data.payment_date).format('YYYY-MM-DD') : null,
                payment_note: data.payment_note,
                status: data.status
            })
        }
    }, [open, modalType, data])


    useEffect(() => {
        if (updateAppointmentStatusResponse) {
            enqueueSnackbar(updateAppointmentStatusResponse.message, {
                variant: updateAppointmentStatusResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateAppointmentStatusResponse?.status == true) {
                handleClose();
            }
        }
        if (updateAppointmentStatusError) {
            var error = updateAppointmentStatusError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateAppointmentStatusResponse, updateAppointmentStatusError])

    return (
        <Dialog open={open && modalType == ModalEnum.updateStatusPatientPayment} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <Box sx={{ p: 1, py: 1.5 }}>
                <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                >
                    <Grid item>
                        <DialogTitle id="alert-dialog-title">{intl.formatMessage({ id: "changeStatus" })}</DialogTitle>
                    </Grid>
                    <Grid item sx={{ mr: 1.5 }}>
                        <IconButton color="secondary" onClick={handleClose}>
                            <CloseSquare size={36} />
                        </IconButton>
                    </Grid>
                </Grid>
                <Formik
                    initialValues={initialData ?? {
                        payment_id: null,
                        patient_id: null,
                        payment_method_id: getPaymentMethodListData?.data?.find((item) => item.field == "00001")?.value ?? null,
                        payment_status_id: getPaymentStatusData?.data?.find((item) => item.field == "00003")?.value ?? null,
                        payment_note: null,
                        payment_date: null,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={updatePaymentStatusSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        updatePaymentStatus(values);
                    }}
                >
                    {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <Form>
                            <Box sx={{ px: 3, py: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="payment_method_id">{`Ödeme Yöntemi*`}</InputLabel>
                                            <CustomFormikSelect
                                                name='payment_method_id'
                                                placeholder="Ödeme Yöntemi Seçin"
                                                isClearable={true}
                                                isLoading={getPaymentMethodListLoading}
                                                zIndex={995}
                                                menuPortalTarget={document.body}
                                                value={
                                                    values.payment_method_id ? { label: getPaymentMethodListData?.data?.find((item) => item.value == values.payment_method_id)?.label ?? "", value: getPaymentMethodListData?.data?.find((item) => item.value == values.payment_method_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("payment_method_id", val?.value ?? 0);
                                                }}

                                                options={getPaymentMethodListData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="payment_method_id">{`Ödeme Durumu*`}</InputLabel>
                                            <CustomFormikSelect
                                                name='payment_status_id'
                                                placeholder="Ödeme Durumu Seçin"
                                                isClearable={true}
                                                isLoading={getPaymentStatusDropdownLoading || getPaymentStatusDropdownFetching}
                                                zIndex={994}
                                                menuPortalTarget={document.body}
                                                value={
                                                    values.payment_status_id ? { label: getPaymentStatusData?.data?.find((item) => item.value == values.payment_status_id)?.label ?? "", value: getPaymentStatusData?.data?.find((item) => item.value == values.payment_status_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("payment_status_id", val?.value ?? 0);
                                                }}

                                                options={getPaymentStatusData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="payment_note">{intl.formatMessage({ id: "note" })}</InputLabel>
                                            <OutlinedInput
                                                id="text-adornment-password"
                                                type="text"
                                                placeholder={intl.formatMessage({ id: "note" })}
                                                error={Boolean(touched.payment_note && errors.payment_note)}
                                                value={values.payment_note}
                                                name="payment_note"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                multiline
                                                rows={3}
                                            />
                                        </Stack>
                                        {touched.payment_note && errors.payment_note && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.payment_note}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="date">{intl.formatMessage({ id: "date" })}</InputLabel>
                                            <OutlinedInput
                                                id="payment_date"
                                                type="date"
                                                placeholder={intl.formatMessage({ id: "date" })}
                                                error={Boolean(touched.payment_date && errors.payment_date)}
                                                value={dayjs(values.payment_date).format('YYYY-MM-DD')}
                                                name="payment_date"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                        </Stack>
                                        {touched.payment_date && errors.payment_date && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.payment_date}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                            <DialogActions>
                                <Button color="info" onClick={handleClose}>
                                    {intl.formatMessage({ id: "close" })}
                                </Button>
                                <AnimateButton>
                                    <Button disableElevation
                                        disabled={isSubmitting || updateAppointmentStatusIsLoading} type="submit" variant="contained" color="primary">
                                        {(updateAppointmentStatusIsLoading) && <PuffLoader size={20} color='white' />}
                                        {(updateAppointmentStatusIsLoading == false) && intl.formatMessage({ id: "save" })}
                                    </Button>
                                </AnimateButton>
                            </DialogActions>
                        </Form>)}</Formik >
            </Box>
        </Dialog>
    )
}

export default PatientPaymentUpdateStatusModal