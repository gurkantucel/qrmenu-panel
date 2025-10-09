"use client"

import { Box, Button, Dialog, DialogActions, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material"
import { CloseSquare } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Field, Form, Formik } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect } from "react";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import { updateAppointmentProcessTypeSchema } from "utils/schemas/appointment-validation-schema";
import { useUpdateAppointmentProcessTypeMutation } from "reduxt/features/appointment/appointment-process-type-api";
import CurrencyInput from "react-currency-input-field";

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
            <Dialog open={open && modalType == ModalEnum.updateAppointmentProcessType} onClose={handleClose} fullWidth maxWidth="xl">
                <Formik
                    initialValues={{
                        appointment_process_history_id: data?.appointment_process_history_id,
                        appointment_id: data?.appointment_id,
                        currency_code: data?.currency_code,
                        currency_name: data?.currency_name,
                        amount: data?.amount,
                        quantity: data?.quantity != null ? String(parseFloat(data.quantity)) : "1",
                        discount_percentage: data?.discount_percentage,
                        discount_amount: data?.discount_amount,
                        vat: data?.vat,
                        vat_included: data?.vat_included,
                        vat_amount: data?.vat_amount,
                        total: data?.total,
                        status: data?.status
                    }}
                    enableReinitialize
                    validateOnChange={false}
                    validationSchema={updateAppointmentProcessTypeSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        values.amount = values.amount.replace(",", ".");
                        values.quantity = String(values.quantity);
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
                                    <Grid item xs={12} md={2}>
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
                                    <Grid item xs={12} md={1}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="quantity">
                                                {`${intl.formatMessage({ id: "quantity" })}*`}</InputLabel>
                                            <OutlinedInput
                                                id="quantity"
                                                type="number"
                                                value={values.quantity}
                                                name={`quantity`}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "quantity" })}
                                                fullWidth
                                                error={Boolean(touched.quantity && errors.quantity)}
                                                inputProps={{ min: 1, step: "1" }}
                                            />
                                        </Stack>
                                        {touched.quantity && errors.quantity && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {`${errors.quantity}`}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="unitPrice">
                                                {`${intl.formatMessage({ id: "unitPrice" })}*`}</InputLabel>
                                            <Field name={"amount"}>
                                                {({ field, form, meta }: any) => (
                                                    <CurrencyInput
                                                        id="amount"
                                                        name={`amount`}
                                                        placeholder={intl.formatMessage({ id: "amount" })}
                                                        value={values.amount}
                                                        //decimalsLimit={2}
                                                        onValueChange={(value, name, values2) => {
                                                            setFieldValue(`amount`, values2?.value)
                                                        }}
                                                        style={{
                                                            padding: 14,
                                                            border: `1px solid ${(touched.quantity && (errors.quantity)) ? "#F04134" : "#BEC8D0"}`,
                                                            borderRadius: 8,
                                                            color: "#1D2630",
                                                            fontSize: "0.875rem",
                                                            boxSizing: "content-box",
                                                            height: "1.4375em",
                                                            font: "inherit"
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </Stack>
                                        {touched.amount && errors.amount && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {`${errors.amount}`}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={1}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="discount_percentage">
                                                {`${intl.formatMessage({ id: "discount" })}*`}</InputLabel>
                                            <OutlinedInput
                                                id="discount_percentage"
                                                type="number"
                                                value={values.discount_percentage}
                                                name={`discount_percentage`}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "discount" })}
                                                fullWidth
                                                error={Boolean(touched.discount_percentage && errors.discount_percentage)}
                                                inputProps={{ min: 0 }}
                                            />
                                        </Stack>
                                        {touched.quantity && errors.quantity && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {`${errors.quantity}`}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="discountAmount">
                                                {`${intl.formatMessage({ id: "discountAmount" })}*`}</InputLabel>
                                            <OutlinedInput
                                                id="discount_amount"
                                                type="number"
                                                value={((parseFloat(values.quantity ?? "0") * parseFloat(values.amount?.replace(',', '.') ?? "0") * values.discount_percentage) / 100).toFixed(2)}
                                                disabled
                                                name={`discount_amount`}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "discountAmount" })}
                                                fullWidth
                                                startAdornment={<>{data?.currency_code ?? ""}</>}
                                                error={Boolean(touched.discount_amount && errors.discount_amount)}
                                                inputProps={{ min: 0 }}
                                            />
                                        </Stack>
                                        {touched.discount_amount && errors.discount_amount && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {`${errors.discount_amount}`}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={1}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="vat">
                                                {`${intl.formatMessage({ id: "vat" })}*`}</InputLabel>
                                            <OutlinedInput
                                                id="vat"
                                                type="number"
                                                value={values.vat}
                                                name={`vat`}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "vat" })}
                                                fullWidth
                                                error={Boolean(touched.vat && errors.vat)}
                                                inputProps={{ min: 0 }}
                                            />
                                        </Stack>
                                        {touched.vat && errors.vat && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {`${errors.vat}`}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="vatAmount">
                                                {`${intl.formatMessage({ id: "vatAmount" })}*`}</InputLabel>
                                            <OutlinedInput
                                                id="vat_amount"
                                                type="number"
                                                value={
                                                    ((parseFloat(values.quantity ?? "0") * parseFloat(values.amount?.replace(',', '.') ?? "0") -
                                                        (parseFloat(values.quantity ?? "0") * parseFloat(values.amount?.replace(',', '.') ?? "0") * (values.discount_percentage ?? 0)) / 100) *
                                                        ((values.vat ?? 0) / 100)).toFixed(2)
                                                }
                                                disabled
                                                name={`vat_amount`}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "vatAmount" })}
                                                fullWidth
                                                startAdornment={<>{data?.currency_code ?? ""}</>}
                                                error={Boolean(touched.vat_amount && errors.vat_amount)}
                                                inputProps={{ min: 0 }}
                                            />
                                        </Stack>
                                        {touched.vat_amount && errors.vat_amount && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {`${errors.vat_amount}`}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="total">
                                                {`${intl.formatMessage({ id: "total" })}*`}</InputLabel>
                                            <OutlinedInput
                                                id="total"
                                                type="number"
                                                value={
                                                    (parseFloat(values.quantity ?? "0") * parseFloat(values.amount?.replace(',', '.') ?? "0") -
                                                        (parseFloat(values.quantity ?? "0") * parseFloat(values.amount?.replace(',', '.') ?? "0") * values.discount_percentage) / 100 +
                                                        (parseFloat(values.quantity ?? "0") * parseFloat(values.amount?.replace(',', '.') ?? "0") -
                                                            (parseFloat(values.quantity ?? "0") * parseFloat(values.amount?.replace(',', '.') ?? "0") * values.discount_percentage) / 100) *
                                                        ((values.vat ?? 0) / 100)).toFixed(2)
                                                }
                                                disabled
                                                name={`total`}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "total" })}
                                                fullWidth
                                                startAdornment={<>{data?.currency_code ?? ""}</>}
                                                error={Boolean(touched.total && errors.total)}
                                                inputProps={{ min: 0 }}
                                            />
                                        </Stack>
                                        {touched.vat_amount && errors.vat_amount && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {`${errors.vat_amount}`}
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