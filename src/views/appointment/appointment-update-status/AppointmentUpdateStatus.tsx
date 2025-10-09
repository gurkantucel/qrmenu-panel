import { Box, Button, Dialog, DialogActions, DialogTitle, FormHelperText, Grid, IconButton, InputLabel, OutlinedInput, Stack } from "@mui/material"
import AnimateButton from "components/@extended/AnimateButton";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import { Form, Formik } from "formik";
import { CloseSquare, Printer, TickSquare } from "iconsax-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect } from 'react'
import { useIntl } from "react-intl"
import { PuffLoader } from "react-spinners";
import { useAppointmentUpdateStatusMutation } from "reduxt/features/appointment/appointment-api";
import { useLazyPrintAppointmentQuery } from "reduxt/features/appointment/appointment-process-type-api";
import { AppointmentReadResultModel } from "reduxt/features/appointment/models/appointment-list-model";
import { useGetAppointmentStatusDropdownQuery, useGetPaymentMethodDropdownQuery, useGetPaymentStatusDropdownQuery } from "reduxt/features/definition/definition-api";
import { closeModal, ModalEnum, setModal } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const AppointmentUpdateStatus = () => {
    const dispatch = useAppDispatch();
    const router = useRouter()

    const { data: { open, modalType } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const params = useParams<{ slug: string }>()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patient')

    //const [initialData, setInitialData] = useState<AppointmentUpdateStatusBodyModel>();

    const appointmentApi: AppointmentReadResultModel | undefined | any = useAppSelector((state) => state.appointmentApi.queries[`readAppointment({\"appointment_id\":\"${params.slug}\",\"patient_id\":\"${patientId}\"})`]?.data);

    const [updateAppointmentStatus, { isLoading: updateAppointmentStatusIsLoading, data: updateAppointmentStatusResponse, error: updateAppointmentStatusError }] = useAppointmentUpdateStatusMutation();

    const { data: getPaymentMethodListData, isLoading: getPaymentMethodListLoading } = useGetPaymentMethodDropdownQuery(undefined, { skip: open == false && modalType != ModalEnum.updateAppointmentStatus });
    const { data: getAppointmentStatusData, isLoading: getAppointmentStatusDropdownLoading, isFetching: getAppointmentStatusDropdownFetching } = useGetAppointmentStatusDropdownQuery(undefined, { skip: modalType != ModalEnum.updateAppointmentStatus && !params.slug })
    const { data: getPaymentStatusData, isLoading: getPaymentStatusDropdownLoading, isFetching: getPaymentStatusDropdownFetching } = useGetPaymentStatusDropdownQuery(undefined, { skip: modalType != ModalEnum.updateAppointmentStatus && !params.slug })

    const [printAppointment, {
        isFetching: printAppointmentFetching,
        isLoading: printAppointmentLoading
    }] = useLazyPrintAppointmentQuery();

    const handleClose = () => {
        dispatch(closeModal())
    };


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
                router.push("/app/appointment")
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
        <>
            <Grid container direction={"row"} justifyContent={"end"} marginBottom={2}>
                <Button variant="dashed"
                    disabled={printAppointmentLoading || printAppointmentFetching}
                    color='secondary' startIcon={<Printer />} sx={{ marginRight: 1 }} onClick={async () => {
                        await printAppointment({ appointment_id: params.slug })
                    }}>{printAppointmentLoading || printAppointmentFetching ? <PuffLoader size={20} color='white' /> : intl.formatMessage({ id: "print" })}</Button>
                {appointmentApi?.data?.appointment_status_code == "00002" ? <Button variant="contained" color="secondary" startIcon={<TickSquare />}>{intl.formatMessage({ id: "appointmentCompleted" })}</Button>
                    : <Button variant="shadow" color="success"
                        disabled={appointmentApi == undefined}
                        onClick={() => {
                            dispatch(setModal({
                                open: true,
                                modalType: ModalEnum.updateAppointmentStatus,
                            }))
                        }}>{intl.formatMessage({ id: "completeAppointment" })}</Button>}
            </Grid>
            <Dialog open={open && modalType == ModalEnum.updateAppointmentStatus} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ p: 1, py: 1.5 }}>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                    >
                        <Grid item>
                            <DialogTitle id="alert-dialog-title">{intl.formatMessage({ id: "completeAppointment" })}</DialogTitle>
                        </Grid>
                        <Grid item sx={{ mr: 1.5 }}>
                            <IconButton color="secondary" onClick={handleClose}>
                                <CloseSquare size={36} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Formik
                        initialValues={{
                            appointment_id: null,
                            patient_id: null,
                            appointment_status_id: getAppointmentStatusData?.data?.find((item) => item.field == "00002")?.value ?? null,
                            payment_method_id: null,
                            payment_status_id: null,
                            payment_note: null,
                            status: true
                        }}
                        enableReinitialize
                        //validationSchema={newAppointmentSchema}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            if (values.appointment_id != null) {
                                //updateAppointment(values);
                            } else {
                                updateAppointmentStatus(values);
                            }
                        }}
                    >
                        {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <Form>
                                <Box sx={{ px: 3, py: 3 }}>
                                    <Grid container spacing={3} marginBottom={3}>
                                        <Grid item xs={12} sm={6} sx={{ paddingTop: "10px !important" }}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="appointment_status_id">{`${intl.formatMessage({ id: "appointmentStatus" })}*`}</InputLabel>
                                                <CustomFormikSelect
                                                    name='appointment_status_id'
                                                    placeholder="Randevu Durumu Seçin"
                                                    isClearable={true}
                                                    isLoading={getAppointmentStatusDropdownLoading || getAppointmentStatusDropdownFetching}
                                                    zIndex={996}
                                                    menuPortalTarget={document.body}
                                                    value={
                                                        values.appointment_status_id ? { label: getAppointmentStatusData?.data?.find((item) => item.value == values.appointment_status_id)?.label ?? "", value: getAppointmentStatusData?.data?.find((item) => item.value == values.appointment_status_id)?.value ?? 0 } : null}
                                                    onChange={(val: any) => {
                                                        setFieldValue("appointment_status_id", val?.value ?? null);
                                                    }}

                                                    options={getAppointmentStatusData?.data?.map((item) => ({
                                                        value: item.value,
                                                        label: item.label
                                                    }))}
                                                />
                                            </Stack>
                                        </Grid>
                                    </Grid>
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
        </>
    )
}

export default AppointmentUpdateStatus