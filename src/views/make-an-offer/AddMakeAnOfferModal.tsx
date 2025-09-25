"use client"

import { Box, Button, Dialog, DialogActions, Divider, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, OutlinedInput, Radio, RadioGroup, Stack, Typography } from "@mui/material"
import { Add, CloseSquare, Minus } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum, setModal } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Field, FieldArray, Form, Formik, FormikErrors } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect, useState } from "react";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import CustomFormikPhone from "components/third-party/formik/custom-formik-phone";
import { useLazyGetPatientDropdownQuery } from "reduxt/features/patient/patient-api";
import CustomFormikAsyncSelect from "components/third-party/formik/custom-formik-asyncselect";
import AuthDivider from "sections/auth/AuthDivider";
import { useLazyAcceptingAppointmentDropDownQuery } from "reduxt/features/person/person-api";
import { useLazyGetAppointmentProcessDropdownQuery } from "reduxt/features/appointment/appointment-process-type-api";
import { MakeAnOfferDetail } from "reduxt/features/make-an-offer/models/make-an-offer-model";
import { useCreateMakeAnOfferMutation } from "reduxt/features/make-an-offer/make-an-offer-api";
import { newMakeAnOfferSchema } from "utils/schemas/make-an-offer-validation-schema";
import CurrencyInput from "react-currency-input-field";

type Props = {
    page?: string
    requestCalendar?: () => void
}

const AddMakeAnOfferModal = (props: Props) => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [patientType, setPatientType] = useState("oldPatient");

    const handleClose = () => {
        dispatch(closeModal())
    };

    const [getPatientDropdown, { isLoading: getPatientDropdownLoading }] = useLazyGetPatientDropdownQuery();

    const [getAppointmentProcessDropdown, { isLoading: getAppointmentProcessDropdownLoading, data: getAppointmentProcessDropdownData }] = useLazyGetAppointmentProcessDropdownQuery();

    const getPatientDropdownOptions = async (inputValue: string) => {

        if (inputValue.length >= 3) {
            const items = await getPatientDropdown({ label: inputValue })
            return items.data?.data ?? [];
        }
    }

    const [getAcceptingAppointmentDropDownList, {
        data: getAcceptingAppointmentListData,
        isLoading: getAcceptingAppointmentListLoading
    }] = useLazyAcceptingAppointmentDropDownQuery();

    const [createMakeAnOffer, { isLoading: createMakeAnOfferIsLoading, data: createMakeAnOfferResponse, error: createMakeAnOfferError }] = useCreateMakeAnOfferMutation();


    useEffect(() => {
        if (open == true && modalType == ModalEnum.newMakeAnOffer) {
            getAppointmentProcessDropdown();
            getAcceptingAppointmentDropDownList({});
        }
    }, [open, id])

    useEffect(() => {
        if (createMakeAnOfferResponse) {
            enqueueSnackbar(createMakeAnOfferResponse.message, {
                variant: createMakeAnOfferResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createMakeAnOfferResponse?.status == true) {
                handleClose();
                if (props.page == "home" && props.requestCalendar) {
                    props?.requestCalendar();
                }
            }
        }
        if (createMakeAnOfferError) {
            const error = createMakeAnOfferError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createMakeAnOfferResponse, createMakeAnOfferError])

    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <>
            {<Button variant="dashed" startIcon={<Add />} onClick={() => {
                dispatch(setModal({
                    open: true,
                    modalType: ModalEnum.newMakeAnOffer
                }))
            }}>{intl.formatMessage({ id: "new" })}</Button>}
            <Dialog open={open && modalType == ModalEnum.newMakeAnOffer} onClose={handleClose} fullScreen>
                <Formik
                    initialValues={{
                        quote_id: null,
                        patient_id: null,
                        name: null,
                        surname: null,
                        identity_number: null,
                        phone_code: patientType == "oldPatient" ? null : "+90",
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
                        if (values.quote_id != null) {
                            //updateAppointment(values);
                        } else {
                            const model = values.detail.map(item => ({
                                ...item,
                                amount: item.amount?.replace(",", "."),
                            }));
                            createMakeAnOffer({
                                ...values,
                                detail: model
                            });
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
                                        <Typography variant="h4">{intl.formatMessage({ id: "makeAnOffer" })}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={36} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FormControl component="fieldset">
                                            <RadioGroup aria-label="size" defaultValue="newPerson" name="radio-buttons-group" row value={patientType} onChange={(event, value) => {
                                                setPatientType(value)
                                            }}>
                                                <FormControlLabel value="oldPatient" control={<Radio color="info" />} label="Mevcut Danışan" />
                                                <FormControlLabel value="newPatient" control={<Radio color="success" />} label="Yeni Danışan" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    {patientType == "oldPatient" && <Grid item xs={6}>
                                        <CustomFormikAsyncSelect
                                            isMulti={false}
                                            name='patient_id'
                                            loadOptions={getPatientDropdownOptions}
                                            isClearable
                                            isLoading={getPatientDropdownLoading}
                                            placeholder={intl.formatMessage({ id: "searchTCPhoneOrName" })}
                                            onChange={(value) => {
                                                setFieldValue("patient_id", value?.value);
                                            }}
                                            noOptionsMessage={() => intl.formatMessage({ id: "searchLeastThreeCharacters" })}
                                            loadingMessage={() => intl.formatMessage({ id: "loadingDot" })}
                                        />
                                    </Grid>}
                                    {patientType == "newPatient" && <>
                                        <Grid item xs={12} md={4}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="name">{intl.formatMessage({ id: "name" })}{"*"}</InputLabel>
                                                <OutlinedInput
                                                    id="name"
                                                    type="firstname"
                                                    value={values.name}
                                                    name="name"
                                                    disabled={values.patient_id != null}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={intl.formatMessage({ id: "name" })}
                                                    fullWidth
                                                    error={Boolean(touched.name && errors.name)}
                                                />
                                            </Stack>
                                            {touched.name && errors.name && (
                                                <FormHelperText error id="helper-text-firstname-signup">
                                                    {errors.name}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="surname">{intl.formatMessage({ id: "surname" })}{"*"}</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.surname && errors.surname)}
                                                    id="lastname-signup"
                                                    type="lastname"
                                                    value={values.surname}
                                                    name="surname"
                                                    disabled={values.patient_id != null}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={intl.formatMessage({ id: "surname" })}
                                                    inputProps={{}}
                                                />
                                            </Stack>
                                            {touched.surname && errors.surname && (
                                                <FormHelperText error id="helper-text-lastname-signup">
                                                    {errors.surname}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <CustomFormikPhone
                                                label={`${intl.formatMessage({ id: "phone" })}*`}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                disabled={values.patient_id != null}
                                                namePhoneCode="phone_code"
                                                valuePhoneCode={values.phone_code}
                                                namePhoneNumber="phone_number"
                                                valuePhoneNumber={values.phone_number}
                                                touchedPhoneNumber={touched.phone_number}
                                                errorPhoneNumber={errors.phone_number}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="identity_number">{intl.formatMessage({ id: "identityNumber" })}</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.identity_number && errors.identity_number)}
                                                    id="identity_number"
                                                    type="lastname"
                                                    value={values.identity_number}
                                                    disabled={values.patient_id != null}
                                                    name="identity_number"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={intl.formatMessage({ id: "identityNumber" })}
                                                    inputProps={{ maxLength: 11 }}
                                                />
                                            </Stack>
                                            {touched.identity_number && errors.identity_number && (
                                                <FormHelperText error id="helper-text-lastname-signup">
                                                    {errors.identity_number}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                    </>}
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            {patientType == "newPatient" && <InputLabel htmlFor="person_id">{`${intl.formatMessage({ id: "doctorPerson" })}*`}</InputLabel>}
                                            <CustomFormikSelect
                                                name='person_id'
                                                placeholder="Doktor/Çalışan Seçin"
                                                isClearable={true}
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
                                                        <Grid container justifyContent={"start"} alignContent={"center"} alignItems={"center"} spacing={1} marginBottom={2} padding={2} key={index}>
                                                            <Grid item xs={12} md={1}>
                                                                <Grid container justifyContent={"center"} paddingTop={4}>
                                                                    <Grid marginRight={1}>
                                                                        <IconButton shape="rounded" variant="contained"
                                                                            color="secondary"
                                                                            size="small" onClick={() => {
                                                                                arrayHelpers.insert(index, {
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
                                                                        {`${intl.formatMessage({ id: "unitPrice" })}*`}
                                                                    </InputLabel>
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
                                        <InputLabel htmlFor="quote_note">{intl.formatMessage({ id: "quoteNote" })}</InputLabel>
                                        <OutlinedInput
                                            id="text-adornment-password"
                                            type="text"
                                            placeholder={intl.formatMessage({ id: "quoteNote" })}
                                            error={Boolean(touched.quote_note && errors.quote_note)}
                                            value={values.quote_note}
                                            name="quote_note"
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
                                            value={values.expiration}
                                            name="expiration"
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
                                        <Button disableElevation
                                            disabled={isSubmitting || createMakeAnOfferIsLoading || (patientType == "oldPatient" && values.patient_id == null)} type="submit" variant="contained" color="primary">
                                            {(createMakeAnOfferIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createMakeAnOfferIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default AddMakeAnOfferModal