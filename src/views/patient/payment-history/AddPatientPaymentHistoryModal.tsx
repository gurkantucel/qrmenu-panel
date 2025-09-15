"use client"

import { Box, Button, Dialog, DialogActions, Divider, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material"
import { Add, CloseSquare, Minus } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Field, FieldArray, Form, Formik, FormikErrors } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect, useState } from "react";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import AuthDivider from "sections/auth/AuthDivider";
import { useLazyGetAppointmentProcessDropdownQuery } from "reduxt/features/appointment/appointment-process-type-api";
import { MakeAnOfferDetail } from "reduxt/features/make-an-offer/models/make-an-offer-model";
import { useCreateTenantPaymentMutation, useLazyReadTenantPaymentQuery, useUpdateTenantPaymentMutation } from "reduxt/features/patient/tenant-payment-api";
import { useLazyGetPaymentMethodDropdownQuery } from "reduxt/features/definition/definition-api";
import { newPatientPaymentHistorySchema } from "utils/schemas/patient-validation-schema";
import { TenantPaymentCreateBodyModel } from "reduxt/features/patient/models/tenant-payment-model";
import CustomScaleLoader from "components/CustomScaleLoader";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import CurrencyInput from "react-currency-input-field";

type Props = {
    page?: string
    requestCalendar?: () => void
}

const AddPatientPaymentHistoryModal = (props: Props) => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()
    const params = useParams<{ slug: string }>()

    const [initialData, setInitialData] = useState<TenantPaymentCreateBodyModel>();

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    const [getAppointmentProcessDropdown, { isLoading: getAppointmentProcessDropdownLoading, data: getAppointmentProcessDropdownData }] = useLazyGetAppointmentProcessDropdownQuery();

    const [getPaymentMethodDropDownList, {
        data: getPaymentMethodListData,
        isLoading: getPaymentMethodListLoading
    }] = useLazyGetPaymentMethodDropdownQuery();

    const [getTenantPayment, {
        data: getTenantPaymentData,
        isLoading: getTenantPaymentLoading,
        isFetching: getTenantPaymentIsFetching
    }] = useLazyReadTenantPaymentQuery();

    const [createTenantPayment, { isLoading: createTenantPaymentIsLoading, data: createTenantPaymentResponse, error: createTenantPaymentError }] = useCreateTenantPaymentMutation();

    const [updateTenantPayment, { isLoading: updateTenantPaymentIsLoading, data: updateTenantPaymentResponse, error: updateTenantPaymentError }] = useUpdateTenantPaymentMutation();


    useEffect(() => {
        if (open == true && modalType == ModalEnum.newPatientPaymentHistory) {
            getAppointmentProcessDropdown();
            getPaymentMethodDropDownList();
        }
    }, [open, id])

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newPatientPaymentHistory && id != null && data != null) {
            getTenantPayment({ payment_id: data.payment_id, patient_id: data.patient_id })
        }
    }, [open, id, data])

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newPatientPaymentHistory && getTenantPaymentData?.data != null) {
            const model: TenantPaymentCreateBodyModel = {
                payment_id: getTenantPaymentData.data.payment_id,
                appointment_id: getTenantPaymentData.data.appointment_id,
                patient_id: getTenantPaymentData.data.patient_id,
                payment_method_id: getTenantPaymentData.data.payment_method_id,
                payment_date: getTenantPaymentData.data.payment_date != null ? dayjs(getTenantPaymentData.data.payment_date).format('YYYY-MM-DD') : getTenantPaymentData.data.payment_date,
                payment_note: getTenantPaymentData.data.payment_note,
                detail: getTenantPaymentData.data.detail.map((item) => ({
                    payment_id: item.payment_id,
                    appointment_process_type_code: item.appointment_process_type_code,
                    appointment_process_type_name: item.appointment_process_type_name,
                    appointment_process_code: item.appointment_process_code,
                    appointment_process_name: item.appointment_process_name,
                    appointment_process_description: item.appointment_process_description,
                    currency_code: item.currency_code,
                    currency_name: item.currency_name,
                    amount: item.amount.toString(),
                    quantity: item.quantity,
                    discount_percentage: item.discount_percentage,
                    discount_amount: item.discount_amount,
                    vat: item.vat,
                    vat_included: item.vat_included,
                    vat_amount: item.vat_amount,
                    total: item.total,
                    status: true
                })),
                status: getTenantPaymentData.data.status
            }
            setInitialData(model);
        }
    }, [getTenantPaymentData])

    useEffect(() => {
        if (createTenantPaymentResponse) {
            enqueueSnackbar(createTenantPaymentResponse.message, {
                variant: createTenantPaymentResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createTenantPaymentResponse?.status == true) {
                handleClose();
                if (props.page == "home" && props.requestCalendar) {
                    props?.requestCalendar();
                }
            }
        }
        if (createTenantPaymentError) {
            const error = createTenantPaymentError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createTenantPaymentResponse, createTenantPaymentError])

    useEffect(() => {
        if (updateTenantPaymentResponse) {
            enqueueSnackbar(updateTenantPaymentResponse.message, {
                variant: updateTenantPaymentResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateTenantPaymentResponse?.status == true) {
                handleClose();
            }
        }
        if (updateTenantPaymentError) {
            const error = updateTenantPaymentError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateTenantPaymentResponse, updateTenantPaymentError])

    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.newPatientPaymentHistory} onClose={handleClose} fullScreen>
                {getTenantPaymentLoading || getTenantPaymentIsFetching ? <CustomScaleLoader /> : <Formik
                    initialValues={initialData ?? {
                        payment_id: null,
                        appointment_id: null,
                        patient_id: params.slug,
                        payment_method_id: null,
                        payment_date: dayjs().format('YYYY-MM-DD'),
                        payment_note: null,
                        status: true,
                        detail: [{
                            payment_id: null,
                            appointment_process_type_code: null,
                            appointment_process_type_name: null,
                            appointment_process_code: null,
                            appointment_process_name: null,
                            appointment_process_description: null,
                            currency_code: null,
                            currency_name: null,
                            amount: "0",
                            quantity: 1,
                            discount_percentage: 0,
                            discount_amount: 0,
                            vat: 0,
                            vat_included: false,
                            vat_amount: 0,
                            total: 0,
                            status: true
                        }]
                    }}
                    enableReinitialize
                    validationSchema={newPatientPaymentHistorySchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (values.payment_id != null) {
                            updateTenantPayment(values);
                        } else {
                            createTenantPayment(values);
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
                                    sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                                >
                                    <Grid item>
                                        <Typography variant="h4">{id != null ? `${data?.patient_full_name} - ${intl.formatMessage({ id: "updatePayment" })}` : intl.formatMessage({ id: "newPayment" })}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={36} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <CustomFormikSelect
                                                name='payment_method_id'
                                                placeholder="Ödeme Yöntemi Seçin"
                                                isClearable={true}
                                                isLoading={getPaymentMethodListLoading}
                                                zIndex={999}
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
                                    <Grid item xs={12}>
                                        <AuthDivider>
                                            <Typography variant="subtitle1">Teklifler</Typography>
                                        </AuthDivider>
                                    </Grid>
                                    <Grid container spacing={3} marginTop={1}>
                                        <FieldArray
                                            name="detail"
                                            render={arrayHelpers => (
                                                <>
                                                    {values.detail && values.detail.length > 0 && values.detail.map((item, index) => (
                                                        <Grid container justifyContent={"start"} alignContent={"center"} alignItems={"center"} spacing={1} marginBottom={2} padding={2} key={index}>
                                                            <Grid item xs={12} md={1}>
                                                                <Grid container justifyContent={"center"} paddingTop={4}>
                                                                    <Grid marginRight={1}>
                                                                        <IconButton shape="rounded" variant="contained"
                                                                            color="secondary"
                                                                            size="small" onClick={() => {
                                                                                arrayHelpers.insert(index, {
                                                                                    payment_id: null,
                                                                                    appointment_process_type_code: null,
                                                                                    appointment_process_type_name: null,
                                                                                    appointment_process_code: null,
                                                                                    appointment_process_name: null,
                                                                                    appointment_process_description: null,
                                                                                    currency_code: null,
                                                                                    currency_name: null,
                                                                                    amount: "0",
                                                                                    quantity: 1,
                                                                                    discount_percentage: 0,
                                                                                    discount_amount: 0,
                                                                                    vat: 0,
                                                                                    vat_included: false,
                                                                                    vat_amount: 0,
                                                                                    total: 0,
                                                                                    status: true
                                                                                })
                                                                            }}>
                                                                            <Add />
                                                                        </IconButton>
                                                                    </Grid>
                                                                    <IconButton shape="rounded" variant="contained"
                                                                        color="secondary"
                                                                        disabled={values.detail.length == 1}
                                                                        size="small" onClick={() => {
                                                                            arrayHelpers.remove(index)
                                                                        }}>
                                                                        <Minus />
                                                                    </IconButton>
                                                                </Grid>
                                                            </Grid>
                                                            {/* Randevu İşlemi */}
                                                            <Grid item xs={12} md={2}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="appointment_process_code">{`${intl.formatMessage({ id: "appointmentProcess" })}*`}</InputLabel>
                                                                    <CustomFormikSelect
                                                                        name={`detail[${index}].appointment_process_code`}
                                                                        placeholder={intl.formatMessage({ id: "selectAppointmentProcess" })}
                                                                        isClearable={true}
                                                                        isLoading={getAppointmentProcessDropdownLoading}
                                                                        zIndex={998 - index}
                                                                        value={
                                                                            values.detail[index].appointment_process_code ? { label: getAppointmentProcessDropdownData?.data?.find((item) => item.appointment_process_code == values.detail[index].appointment_process_code)?.label ?? "", value: getAppointmentProcessDropdownData?.data?.find((item) => item.appointment_process_code == values.detail[index].appointment_process_code)?.value ?? 0 } : null}
                                                                        onChange={(val: any) => {
                                                                            if (values.detail.length > 1 && !values.detail.some(item => item.currency_code == val?.value?.currency_code)) {
                                                                                enqueueSnackbar("Seçilen randevu işlemlerinde farklı para birimleri tanımlı. ", {
                                                                                    variant: 'error', anchorOrigin: {
                                                                                        vertical: 'bottom',
                                                                                        horizontal: 'right'
                                                                                    }
                                                                                },)
                                                                                return;
                                                                            }
                                                                            setFieldValue(`detail[${index}].appointment_process_type_code`, val?.value.appointment_process_type_code);
                                                                            setFieldValue(`detail[${index}].appointment_process_type_name`, val?.value.appointment_process_type_name);
                                                                            setFieldValue(`detail[${index}].appointment_process_code`, val?.value.appointment_process_code);
                                                                            setFieldValue(`detail[${index}].appointment_process_name`, val?.value.appointment_process_name);
                                                                            setFieldValue(`detail[${index}].appointment_process_description`, val?.value.appointment_process_description);

                                                                            if (val?.value?.vat_included == true) {
                                                                                const amount = parseFloat(val?.value?.amount);
                                                                                const vatRate = parseFloat(val?.value?.vat) / 100;
                                                                                const exclAmount = amount / (1 + vatRate);
                                                                                setFieldValue(`detail[${index}].amount`, exclAmount.toFixed(2));
                                                                                //setFieldValue(`detail[${index}].amount`, (val?.value?.amount));
                                                                            } else {
                                                                                setFieldValue(`detail[${index}].amount`, val?.value?.amount)
                                                                            }
                                                                            //setFieldValue(`detail[${index}].amount`, val?.value?.amount);
                                                                            setFieldValue(`detail[${index}].vat`, val?.value?.vat);
                                                                            setFieldValue(`detail[${index}].vat_included`, val?.value?.vat_included);
                                                                            setFieldValue(`detail[${index}].currency_code`, val?.value?.currency_code);
                                                                            setFieldValue(`detail[${index}].currency_name`, val?.value?.currency_name);
                                                                        }}
                                                                        options={getAppointmentProcessDropdownData?.data?.map((item) => ({
                                                                            value: item,
                                                                            label: item.label
                                                                        }))}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                            {/* Adet*/}
                                                            <Grid item xs={12} md={0.7}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="quantity">
                                                                        {`${intl.formatMessage({ id: "quantity" })}*`}</InputLabel>
                                                                    <OutlinedInput
                                                                        id="quantity"
                                                                        type="number"
                                                                        value={values.detail[index].quantity}
                                                                        name={`detail[${index}].quantity`}
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        placeholder={intl.formatMessage({ id: "quantity" })}
                                                                        fullWidth
                                                                        error={Boolean((touched.detail && touched.detail[index]?.quantity) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.quantity))}
                                                                        inputProps={{ min: 0, step: "0.5" }}
                                                                    />
                                                                </Stack>
                                                                {(touched.detail && touched.detail[index]?.quantity) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.quantity) && (
                                                                    <FormHelperText error id="helper-text-firstname-signup">
                                                                        {(errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.quantity)}
                                                                    </FormHelperText>
                                                                )}
                                                            </Grid>
                                                            {/* Birim Fiyat */}
                                                            <Grid item xs={12} md={1.5}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="unitPrice">
                                                                        {`${intl.formatMessage({ id: "unitPrice" })}*`}</InputLabel>
                                                                    <Field name={"amount"}>
                                                                        {({ field, form, meta }: any) => (
                                                                            <CurrencyInput
                                                                                id="amount"
                                                                                name={`amount`}
                                                                                placeholder={intl.formatMessage({ id: "amount" })}
                                                                                value={values.detail[index].amount}
                                                                                //decimalsLimit={2}
                                                                                onValueChange={(value, name, values2) => {
                                                                                    setFieldValue(`detail[${index}].amount`, values2?.value)
                                                                                }}
                                                                                style={{
                                                                                    padding: 14,
                                                                                    border: `1px solid ${(touched.detail && touched.detail[index]?.amount) && (errors.detail && (errors.detail as FormikErrors<any>[])[0]?.amount) ? "#F04134" : "#BEC8D0"}`,
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
                                                                {(touched.detail && touched.detail[index]?.amount) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.amount) && (
                                                                    <FormHelperText error id="helper-text-firstname-signup">
                                                                        {(errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.amount)}
                                                                    </FormHelperText>
                                                                )}
                                                            </Grid>
                                                            {/* İskonto */}
                                                            <Grid item xs={12} md={0.7}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="discount_percentage">
                                                                        {`${intl.formatMessage({ id: "discount" })}%*`}</InputLabel>
                                                                    <OutlinedInput
                                                                        id="name"
                                                                        type="number"
                                                                        value={values.detail[index].discount_percentage}
                                                                        name={`detail[${index}].discount_percentage`}
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        placeholder={intl.formatMessage({ id: "discount" })}
                                                                        fullWidth
                                                                        error={Boolean((touched.detail && touched.detail[index]?.discount_percentage) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.discount_percentage))}
                                                                        inputProps={{ min: 0 }}
                                                                    />
                                                                </Stack>
                                                                {(touched.detail && touched.detail[index]?.discount_percentage) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.discount_percentage) && (
                                                                    <FormHelperText error id="helper-text-firstname-signup">
                                                                        {(errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.discount_percentage)}
                                                                    </FormHelperText>
                                                                )}
                                                            </Grid>
                                                            {/* İskonto Tutarı */}
                                                            <Grid item xs={12} md={1.5}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="discountAmount">
                                                                        {`${intl.formatMessage({ id: "discountAmount" })}*`}</InputLabel>
                                                                    <OutlinedInput
                                                                        id="name"
                                                                        type="number"
                                                                        //value={(item.quantity * item.amount * item.discount_percentage) / 100}
                                                                        value={((item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") * item.discount_percentage) / 100).toFixed(2)}
                                                                        disabled
                                                                        name={`detail[${index}].discount_amount`}
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        placeholder={intl.formatMessage({ id: "discountAmount" })}
                                                                        fullWidth
                                                                        error={Boolean((touched.detail && touched.detail[index]?.discount_amount) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.discount_amount))}
                                                                    />
                                                                </Stack>
                                                                {(touched.detail && touched.detail[index]?.discount_amount) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.discount_amount) && (
                                                                    <FormHelperText error id="helper-text-firstname-signup">
                                                                        {(errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.discount_amount)}
                                                                    </FormHelperText>
                                                                )}
                                                            </Grid>
                                                            {/* KDV */}
                                                            <Grid item xs={12} md={0.7}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="vatRate">
                                                                        {`${intl.formatMessage({ id: "vat" })}%`}</InputLabel>
                                                                    <OutlinedInput
                                                                        id="name"
                                                                        type="number"
                                                                        value={values.detail[index].vat}
                                                                        name={`detail[${index}].vat`}
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        placeholder={intl.formatMessage({ id: "vat" })}
                                                                        fullWidth
                                                                        error={Boolean((touched.detail && touched.detail[index]?.vat) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.vat))}
                                                                        inputProps={{ min: 0 }}
                                                                    />
                                                                </Stack>
                                                                {(touched.detail && touched.detail[index]?.vat) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.vat) && (
                                                                    <FormHelperText error id="helper-text-firstname-signup">
                                                                        {(errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.vat)}
                                                                    </FormHelperText>
                                                                )}
                                                            </Grid>
                                                            {/* KDV Tutarı */}
                                                            <Grid item xs={12} md={1.5}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="vatRate">
                                                                        {`${intl.formatMessage({ id: "vatAmount" })}*`}</InputLabel>
                                                                    <OutlinedInput
                                                                        id="name"
                                                                        type="text"
                                                                        value={
                                                                            (((item.quantity ?? 0) * parseFloat(item.amount?.replace(',', '.') ?? "0") -
                                                                                (item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") * (item.discount_percentage ?? 0)) / 100) *
                                                                                ((item.vat ?? 0) / 100)).toFixed(2)
                                                                        }
                                                                        disabled
                                                                        name={`detail[${index}].vat_amount`}
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        placeholder={intl.formatMessage({ id: "amount" })}
                                                                        fullWidth
                                                                        error={Boolean((touched.detail && touched.detail[index]?.vat_amount) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.vat_amount))}
                                                                    />
                                                                </Stack>
                                                                {(touched.detail && touched.detail[index]?.vat_amount) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.vat_amount) && (
                                                                    <FormHelperText error id="helper-text-firstname-signup">
                                                                        {(errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.vat_amount)}
                                                                    </FormHelperText>
                                                                )}
                                                            </Grid>
                                                            {/* Toplam */}
                                                            <Grid item xs={12} md={2}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="total">
                                                                        {`${intl.formatMessage({ id: "total" })}*`}</InputLabel>
                                                                    <OutlinedInput
                                                                        id="name"
                                                                        type="text"
                                                                        value={
                                                                            ((item.quantity ?? 0) * parseFloat(item.amount?.replace(',', '.') ?? "0") -
                                                                                ((item.quantity ?? 0) * parseFloat(item.amount?.replace(',', '.') ?? "0") * item.discount_percentage) / 100 +
                                                                                ((item.quantity ?? 0) * parseFloat(item.amount?.replace(',', '.') ?? "0") -
                                                                                    ((item.quantity ?? 0) * parseFloat(item.amount?.replace(',', '.') ?? "0") * item.discount_percentage) / 100) *
                                                                                ((item.vat ?? 0) / 100)).toFixed(2)
                                                                        }
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        placeholder={intl.formatMessage({ id: "total" })}
                                                                        disabled
                                                                        fullWidth
                                                                        startAdornment={<>{values.detail[index].currency_code ?? ""}</>}
                                                                        error={Boolean((touched.detail && touched.detail[index]?.vat_amount) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.total))}
                                                                    />
                                                                </Stack>
                                                                {(touched.detail && touched.detail[index]?.total) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.total) && (
                                                                    <FormHelperText error id="helper-text-firstname-signup">
                                                                        {(errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.total)}
                                                                    </FormHelperText>
                                                                )}
                                                            </Grid>
                                                        </Grid>))}
                                                </>
                                            )}></FieldArray>
                                    </Grid>
                                </Grid>
                                <Divider />
                                <Grid container flexDirection={"column"} alignContent="flex-end" marginTop={2}>
                                    <Grid item xs={12}>
                                        <Stack spacing={2}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography color="grey.500">{`${intl.formatMessage({ id: "totalAmount" })}:`}</Typography>
                                                <Typography>{`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: values.detail[0].currency_code ?? 'TRY' }).format(
                                                    values.detail.reduce((sum, item) => {
                                                        const iskontoTutari = (item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") * item.discount_percentage) / 100;
                                                        return sum + item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") - iskontoTutari;
                                                    }, 0)
                                                )}`}</Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between" spacing={4}>
                                                <Typography color="grey.500">{`${intl.formatMessage({ id: "totalDiscount" })}:`}</Typography>
                                                <Typography variant="h6" color="success.main">
                                                    {`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: values.detail[0].currency_code ?? 'TRY' }).format(
                                                        values.detail.reduce((sum, item) => sum + (item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") * item.discount_percentage) / 100, 0)
                                                    )}`}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography color="grey.500">{`${intl.formatMessage({ id: "calculatedVAT" })}:`}</Typography>
                                                <Typography>
                                                    {`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: values.detail[0].currency_code ?? 'TRY' }).format(
                                                        values.detail.reduce((sum, item) => {
                                                            const iskontoTutari = (item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") * item.discount_percentage) / 100;
                                                            return sum + (item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") - iskontoTutari) * ((item.vat ?? 0) / 100);
                                                        }, 0)
                                                    )}`}</Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between" spacing={4}>
                                                <Typography variant="subtitle1">{`${intl.formatMessage({ id: "amountToBePaid" })}:`}</Typography>
                                                <Typography variant="subtitle1">
                                                    {`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: values.detail[0].currency_code ?? 'TRY' }).format(values.detail.reduce((sum, item) => {
                                                        const iskontoTutari = (item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") * item.discount_percentage) / 100;
                                                        const kdvTutari = (item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") - iskontoTutari) * ((item.vat ?? 0) / 100);
                                                        return sum + item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") - iskontoTutari + kdvTutari;
                                                    }, 0)
                                                    )}`}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid>
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
                                <Grid item xs={6} sm={6} marginTop={2}>
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
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation
                                            disabled={isSubmitting || createTenantPaymentIsLoading || updateTenantPaymentIsLoading} type="submit" variant="contained" color="primary">
                                            {(createTenantPaymentIsLoading || updateTenantPaymentIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createTenantPaymentIsLoading == false || updateTenantPaymentIsLoading == false) && intl.formatMessage({ id: "save" })}
                                        </Button>
                                    </AnimateButton>
                                </DialogActions>
                            </Box>
                        </Form>
                    )}
                </Formik>}
            </Dialog>
        </>
    )
}

export default AddPatientPaymentHistoryModal