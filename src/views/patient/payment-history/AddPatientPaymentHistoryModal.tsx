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
import { useEffect, useState } from "react";
import { useLazyGetCurrencyDropdownQuery, useLazyGetPaymentKindDropdownQuery, useLazyGetPaymentMethodDropdownQuery } from "reduxt/features/definition/definition-api";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import { newPatientPaymentHistorySchema } from "utils/schemas/patient-validation-schema";
import { PatientPaymentHistoryCreateBodyModel } from "reduxt/features/patient/models/patient-payment-history-model";
import { useCreatePatientPaymentHistoryMutation, useUpdatePatientPaymentHistoryMutation } from "reduxt/features/patient/patient-payment-history-api";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";

const AddPatientPaymentHistoryModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<PatientPaymentHistoryCreateBodyModel>();

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    const [getPaymentKind, { data: getPaymentKindData, isLoading: isPatientProcessTypeDataLoading }] = useLazyGetPaymentKindDropdownQuery();

    const [getPaymentMethod, { data: getPaymentMethodData, isLoading: isPaymentMethodLoading }] = useLazyGetPaymentMethodDropdownQuery();

    const [getCurrency, { data: getCurrencyData, isLoading: isCurrencyLoading }] = useLazyGetCurrencyDropdownQuery();

    const [createPatientPaymentHistory, { isLoading: createPatientPaymentHistoryIsLoading, data: createPatientPaymentHistoryResponse, error: createPatientPaymentHistoryError }] = useCreatePatientPaymentHistoryMutation();

    const [updatePatientPaymentHistory, { isLoading: updatePatientPaymentHistoryIsLoading, data: updatePatientPaymentHistoryResponse, error: updatePatientPaymentHistoryError }] = useUpdatePatientPaymentHistoryMutation();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newPatientPaymentHistory) {
            getPaymentKind();
            getPaymentMethod();
            getCurrency();
        }
    }, [open, id])

    useEffect(() => {
        if (data != null && modalType == ModalEnum.newPatientPaymentHistory) {
            const model: PatientPaymentHistoryCreateBodyModel = {
                patient_payment_history_id: data.patient_payment_history_id,
                patient_id: data.patient_id,
                appointment_id: data.appointment_id,
                payment_kind_id: data.payment_kind_id,
                payment_method_id: data.payment_method_id,
                currency_id: data.currency_id,
                discount_percentage: data.discount_percentage,
                discount_amount: data.discount_amount,
                amount: data.amount,
                status: data.status
            }
            setInitialData(model);
        }
    }, [data])

    useEffect(() => {
        if (createPatientPaymentHistoryResponse) {
            enqueueSnackbar(createPatientPaymentHistoryResponse.message, {
                variant: createPatientPaymentHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createPatientPaymentHistoryResponse?.status == true) {
                handleClose();
            }
        }
        if (createPatientPaymentHistoryError) {
            var error = createPatientPaymentHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createPatientPaymentHistoryResponse, createPatientPaymentHistoryError])

    useEffect(() => {
        if (updatePatientPaymentHistoryResponse) {
            enqueueSnackbar(updatePatientPaymentHistoryResponse.message, {
                variant: updatePatientPaymentHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updatePatientPaymentHistoryResponse?.status == true) {
                handleClose();
            }
        }
        if (updatePatientPaymentHistoryError) {
            var error = updatePatientPaymentHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updatePatientPaymentHistoryResponse, updatePatientPaymentHistoryError])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.newPatientPaymentHistory} onClose={handleClose} fullWidth maxWidth="xl">
                {<Formik
                    initialValues={initialData ?? {
                        patient_payment_history_id: null,
                        patient_id: id,
                        appointment_id: null,
                        payment_kind_id: null,
                        payment_method_id: null,
                        currency_id: null,
                        discount_amount: 0,
                        discount_percentage: 0,
                        amount: null,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newPatientPaymentHistorySchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (values.patient_payment_history_id != null) {
                            updatePatientPaymentHistory(values);
                        } else {
                            createPatientPaymentHistory(values);
                        }
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
                                    sx={{ borderBottom: '1px solid {theme.palette.divider}' }}
                                >
                                    <Grid item>
                                        <Typography variant="h4" marginBottom={"1.4rem"}>{intl.formatMessage({ id: data?.patient_payment_history_id != null ? "updatePayment" : "newPayment" })}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={48} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Typography variant="body2" marginBottom={"1.4rem"}>{"Zorunlu alanlar * ile belirtilmiştir."}</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="payment_kind">{intl.formatMessage({ id: "paymentKind" })}{"*"}</InputLabel>
                                            <CustomFormikSelect
                                                name='payment_kind_id'
                                                placeholder="Ödeme Türü Seçin"
                                                isClearable={true}
                                                isLoading={isPatientProcessTypeDataLoading}
                                                zIndex={9998}
                                                value={
                                                    values.payment_kind_id ? { label: getPaymentKindData?.data?.find((item) => item.value == values.payment_kind_id)?.label ?? "", value: getPaymentKindData?.data?.find((item) => item.value == values.payment_kind_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("payment_kind_id", val?.value ?? 0);
                                                }}

                                                options={getPaymentKindData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="payment_method">{intl.formatMessage({ id: "paymentMethod" })}{"*"}</InputLabel>
                                            <CustomFormikSelect
                                                name='payment_method_id'
                                                placeholder="Ödeme Metodu Seçin"
                                                isClearable={true}
                                                isLoading={isPaymentMethodLoading}
                                                zIndex={9997}
                                                value={
                                                    values.payment_method_id ? { label: getPaymentMethodData?.data?.find((item) => item.value == values.payment_method_id)?.label ?? "", value: getPaymentMethodData?.data?.find((item) => item.value == values.payment_method_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("payment_method_id", val?.value ?? 0);
                                                }}

                                                options={getPaymentMethodData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="currency">{intl.formatMessage({ id: "currencyType" })}{"*"}</InputLabel>
                                            <CustomFormikSelect
                                                name='currency_id'
                                                placeholder="Döviz Türü Seçin"
                                                isClearable={true}
                                                isLoading={isCurrencyLoading}
                                                menuPosition="fixed"
                                                zIndex={9996}
                                                value={
                                                    values.currency_id ? { label: getCurrencyData?.data?.find((item) => item.value == values.currency_id)?.label ?? "", value: getCurrencyData?.data?.find((item) => item.value == values.currency_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("currency_id", val?.value ?? 0);
                                                }}

                                                options={getCurrencyData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={1}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="quantity">{intl.formatMessage({ id: "quantity" })}{"*"}</InputLabel>
                                            <OutlinedInput
                                                id="amount"
                                                type="number"
                                                value={values.amount}
                                                name="quantity"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "quantity" })}
                                                fullWidth
                                                error={Boolean(touched.amount && errors.amount)}
                                                inputProps={{ min: 0, step: "0.5" }}
                                            />
                                        </Stack>
                                        {touched.amount && errors.amount && (
                                            <FormHelperText error id="helper-text-amount">
                                                {errors.amount}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="amount">{intl.formatMessage({ id: "unitPrice" })}{"*"}</InputLabel>
                                            <OutlinedInput
                                                id="amount"
                                                type="number"
                                                value={values.amount}
                                                name="amount"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "amount" })}
                                                fullWidth
                                                error={Boolean(touched.amount && errors.amount)}
                                            />
                                        </Stack>
                                        {touched.amount && errors.amount && (
                                            <FormHelperText error id="helper-text-amount">
                                                {errors.amount}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="discount_percentage">
                                                {`${intl.formatMessage({ id: "discount" })}%*`}</InputLabel>
                                            <OutlinedInput
                                                id="discount_percentage"
                                                type="number"
                                                value={values.discount_percentage}
                                                name="discount_percentage"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "discount" })}
                                                fullWidth
                                                error={Boolean(touched.discount_percentage && errors.discount_percentage)}
                                            />
                                        </Stack>
                                        {touched.discount_percentage && errors.discount_percentage && (
                                            <FormHelperText error id="helper-text-amount">
                                                {errors.discount_percentage}
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
                                                value={values.discount_amount}
                                                name="discount_amount"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "discountAmount" })}
                                                fullWidth
                                                error={Boolean(touched.discount_amount && errors.discount_amount)}
                                            />
                                        </Stack>
                                        {touched.discount_amount && errors.discount_amount && (
                                            <FormHelperText error id="helper-text-amount">
                                                {errors.discount_amount}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting || createPatientPaymentHistoryIsLoading || updatePatientPaymentHistoryIsLoading} type="submit" variant="contained" color="primary">
                                            {(createPatientPaymentHistoryIsLoading || updatePatientPaymentHistoryIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createPatientPaymentHistoryIsLoading == false || updatePatientPaymentHistoryIsLoading == false) && intl.formatMessage({ id: "save" })}
                                        </Button>
                                    </AnimateButton>
                                </DialogActions>
                            </Box>
                        </Form>
                    )}
                </Formik >}
            </Dialog>
        </>
    )
}

export default AddPatientPaymentHistoryModal