"use client"

import { Box, Button, Dialog, DialogActions, Divider, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material"
import { CloseSquare } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Field, FieldArray, Form, Formik, FormikErrors } from 'formik';
import { useEffect, useState } from "react";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import AuthDivider from "sections/auth/AuthDivider";
import { useLazyAcceptingAppointmentDropDownQuery } from "reduxt/features/person/person-api";
import { useLazyGetAppointmentProcessDropdownQuery } from "reduxt/features/appointment/appointment-process-type-api";
import { MakeAnOfferCreateBodyModel, MakeAnOfferDetail } from "reduxt/features/make-an-offer/models/make-an-offer-model";
import { useLazyPrintMakeAnOfferQuery, useLazyReadMakeAnOfferQuery } from "reduxt/features/make-an-offer/make-an-offer-api";
import { newMakeAnOfferSchema } from "utils/schemas/make-an-offer-validation-schema";
import CustomScaleLoader from "components/CustomScaleLoader";
import dayjs from "dayjs";
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import CurrencyInput from "react-currency-input-field";

const ViewMakeAnOfferModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id, title } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<MakeAnOfferCreateBodyModel>();

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    const [getAppointmentProcessDropdown, { isLoading: getAppointmentProcessDropdownLoading, data: getAppointmentProcessDropdownData }] = useLazyGetAppointmentProcessDropdownQuery();


    const [getAcceptingAppointmentDropDownList, {
        data: getAcceptingAppointmentListData,
        isLoading: getAcceptingAppointmentListLoading
    }] = useLazyAcceptingAppointmentDropDownQuery();

    const [getReadMakeAnOffer, {
        data: getReadMakeAnOfferData,
        isLoading: getReadMakeAnOfferLoading,
        isFetching: getReadMakeAnOfferIsFetching
    }] = useLazyReadMakeAnOfferQuery();

    const [printMakeAnOffer, {
        isFetching: printMakeAnOfferFetching,
        isLoading: printMakeAnOfferLoading
    }] = useLazyPrintMakeAnOfferQuery();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.viewMakeAnOffer) {
            getAppointmentProcessDropdown();
            getAcceptingAppointmentDropDownList({});
            if (id != null) {
                getReadMakeAnOffer({ quote_id: id })
            }
        }
    }, [open, id])

    useEffect(() => {
        if (open == true && modalType == ModalEnum.viewMakeAnOffer && getReadMakeAnOfferData?.data != null) {
            const model: MakeAnOfferCreateBodyModel = {
                quote_id: getReadMakeAnOfferData.data.quote_id,
                patient_id: getReadMakeAnOfferData.data.patient_id,
                name: getReadMakeAnOfferData.data.patient_name,
                surname: getReadMakeAnOfferData.data.patient_surname,
                identity_number: getReadMakeAnOfferData.data.identity_number,
                phone_code: getReadMakeAnOfferData.data.phone_code,
                phone_number: getReadMakeAnOfferData.data.phone_number,
                person_id: getReadMakeAnOfferData.data.person_id,
                expiration: getReadMakeAnOfferData.data.expiration,
                quote_note: getReadMakeAnOfferData.data.quote_note,
                detail: getReadMakeAnOfferData.data.quote_detail.map((item) => ({
                    quote_id: item.quote_id,
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
                    status: item.status
                })),
                status: getReadMakeAnOfferData.data.status
            }
            setInitialData(model);
        }
    }, [getReadMakeAnOfferData])

    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.viewMakeAnOffer} onClose={handleClose} fullScreen>
                {getReadMakeAnOfferLoading || getReadMakeAnOfferIsFetching ? <CustomScaleLoader /> : <Formik
                    initialValues={initialData ?? {
                        quote_id: null,
                        patient_id: null,
                        name: null,
                        surname: null,
                        identity_number: null,
                        phone_code: "+90",
                        phone_number: null,
                        person_id: null,
                        expiration: null,
                        quote_note: null,
                        status: true,
                        detail: [{
                            quote_id: null,
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
                    validationSchema={newMakeAnOfferSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

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
                                        <Typography variant="h4">{title ?? "-"}</Typography>
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
                                            <InputLabel htmlFor="person_id">{`${intl.formatMessage({ id: "doctorPerson" })}*`}</InputLabel>
                                            <CustomFormikSelect
                                                name='person_id'
                                                placeholder="Doktor/Çalışan Seçin"
                                                isClearable={true}
                                                isDisabled
                                                isLoading={getAcceptingAppointmentListLoading}
                                                zIndex={9998}
                                                value={
                                                    values.person_id ? { label: getAcceptingAppointmentListData?.data?.find((item) => item.value == values.person_id)?.label ?? "", value: getAcceptingAppointmentListData?.data?.find((item) => item.value == values.person_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("person_id", val?.value);
                                                }}

                                                options={getAcceptingAppointmentListData?.data?.map((item) => ({
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
                                                        <Grid container justifyContent={"start"} alignContent={"center"} alignItems={"center"} spacing={1} marginBottom={2} padding={6} key={index}>
                                                            {/* Randevu İşlemi */}
                                                            <Grid item xs={12} md={2}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="appointment_process_code">{`${intl.formatMessage({ id: "appointmentProcess" })}*`}</InputLabel>
                                                                    <CustomFormikSelect
                                                                        name={`detail[${index}].appointment_process_code`}
                                                                        placeholder={intl.formatMessage({ id: "selectAppointmentProcess" })}
                                                                        isClearable={true}
                                                                        isLoading={getAppointmentProcessDropdownLoading}
                                                                        isDisabled
                                                                        zIndex={999 - index}
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
                                                                            setFieldValue(`detail[${index}].amount`, val?.value?.amount);
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
                                                            <Grid item xs={12} md={1}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="quantity">
                                                                        {`${intl.formatMessage({ id: "quantity" })}*`}</InputLabel>
                                                                    <OutlinedInput
                                                                        id="quantity"
                                                                        type="number"
                                                                        value={values.detail[index].quantity}
                                                                        disabled
                                                                        name={`detail[${index}].quantity`}
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        placeholder={intl.formatMessage({ id: "quantity" })}
                                                                        fullWidth
                                                                        error={Boolean((touched.detail && touched.detail[index]?.quantity) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.quantity))}
                                                                        inputProps={{ min: 0, step: "0.01" }}
                                                                    />
                                                                </Stack>
                                                                {(touched.detail && touched.detail[index]?.quantity) && (errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.quantity) && (
                                                                    <FormHelperText error id="helper-text-firstname-signup">
                                                                        {(errors.detail && (errors.detail as FormikErrors<MakeAnOfferDetail>[])[0]?.quantity)}
                                                                    </FormHelperText>
                                                                )}
                                                            </Grid>
                                                            {/* Birim Fiyat */}
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
                                                                                value={values.detail[index].amount}
                                                                                disabled
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
                                                            <Grid item xs={12} md={1}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="discount_percentage">
                                                                        {`${intl.formatMessage({ id: "discount" })}%*`}</InputLabel>
                                                                    <OutlinedInput
                                                                        id="name"
                                                                        type="number"
                                                                        disabled
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
                                                            <Grid item xs={12} md={1}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="discountAmount">
                                                                        {`${intl.formatMessage({ id: "discountAmount" })}*`}</InputLabel>
                                                                    <OutlinedInput
                                                                        id="name"
                                                                        type="number"
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
                                                            <Grid item xs={12} md={1}>
                                                                <Stack spacing={1}>
                                                                    <InputLabel htmlFor="vatRate">
                                                                        {`${intl.formatMessage({ id: "vat" })}%`}</InputLabel>
                                                                    <OutlinedInput
                                                                        id="name"
                                                                        type="number"
                                                                        value={values.detail[index].vat}
                                                                        name={`detail[${index}].vat`}
                                                                        disabled
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
                                                            <Grid item xs={12} md={2}>
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
                                        <InputLabel htmlFor="quote_note">{intl.formatMessage({ id: "quoteNote" })}</InputLabel>
                                        <OutlinedInput
                                            id="text-adornment-password"
                                            type="text"
                                            placeholder={intl.formatMessage({ id: "quoteNote" })}
                                            error={Boolean(touched.quote_note && errors.quote_note)}
                                            value={values.quote_note}
                                            name="quote_note"
                                            disabled
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            multiline
                                            rows={3}
                                        />
                                    </Stack>
                                    {touched.quote_note && errors.quote_note && (
                                        <FormHelperText error id="helper-text-email-signup">
                                            {errors.quote_note}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={6} sm={6} marginTop={2}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="expiration">{intl.formatMessage({ id: "expiration" })}</InputLabel>
                                        <OutlinedInput
                                            id="expiration"
                                            type="date"
                                            placeholder={intl.formatMessage({ id: "expiration" })}
                                            error={Boolean(touched.expiration && errors.expiration)}
                                            //value={values.expiration}
                                            name="expiration"
                                            value={dayjs(values.expiration).format('YYYY-MM-DD')}
                                            disabled
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </Stack>
                                    {touched.expiration && errors.expiration && (
                                        <FormHelperText error id="helper-text-email-signup">
                                            {errors.expiration}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            onClick={() => {
                                                printMakeAnOffer({ quote_id: getReadMakeAnOfferData?.data.quote_id })
                                            }}
                                            disabled={isSubmitting || printMakeAnOfferLoading || printMakeAnOfferFetching} type="button" variant="contained" color="secondary">
                                            {(printMakeAnOfferLoading) && <PuffLoader size={20} color='white' />}
                                            {(printMakeAnOfferLoading == false) && intl.formatMessage({ id: "print" })}
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

export default ViewMakeAnOfferModal