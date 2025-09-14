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
import { useEffect } from "react";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import CustomScaleLoader from "components/CustomScaleLoader";
import { newAppointmentProcessTypeSchema } from "utils/schemas/appointment-validation-schema";
import { useCreateAppointmentProcessTypeMutation, useLazyGetAppointmentProcessDropdownQuery } from "reduxt/features/appointment/appointment-process-type-api";
import CurrencyInput from "react-currency-input-field";

type ProcessType = {
    appointment_id: number;
    patient_id: number;
    appointment_process_id: null;
    amount: null;
    quantity: number;
    discount_percentage: number
    discount_amount: number
    vat: number
    vat_amount: number
    total: number
    status: boolean;
}

const AddAppointmentProcessTypeModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const handleClose = () => {
        dispatch(closeModal())
    };

    const [getAppointmentProcessDropdown, { isLoading: getAppointmentProcessDropdownLoading, data: getAppointmentProcessDropdownData }] = useLazyGetAppointmentProcessDropdownQuery();

    const [createAppointmentProcessType, { isLoading: createAppointmentProcessTypeIsLoading, data: createAppointmentProcessTypeResponse, error: createAppointmentProcessTypeError }] = useCreateAppointmentProcessTypeMutation();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newAppointmentProcessType) {
            if (data != null) {
                getAppointmentProcessDropdown();
            }
        }
    }, [open, data])

    useEffect(() => {
        if (createAppointmentProcessTypeResponse) {
            enqueueSnackbar(createAppointmentProcessTypeResponse.message, {
                variant: createAppointmentProcessTypeResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createAppointmentProcessTypeResponse?.status == true) {
                handleClose();
            }
        }
        if (createAppointmentProcessTypeError) {
            var error = createAppointmentProcessTypeError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createAppointmentProcessTypeResponse, createAppointmentProcessTypeError])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.newAppointmentProcessType} onClose={handleClose} fullWidth fullScreen>
                {false || false ? <CustomScaleLoader /> : <Formik
                    initialValues={{
                        data: [{
                            appointment_id: data?.appointment_id,
                            patient_id: data?.patient_id,
                            appointment_process_id: null,
                            quantity: 1,
                            amount: "0",
                            discount_percentage: 0,
                            discount_amount: 0,
                            vat: 0,
                            vat_included: false,
                            vat_amount: 0,
                            total: 0,
                            currency_code: null,
                            status: true,
                        }]
                    }}
                    enableReinitialize
                    validateOnChange={false}
                    validationSchema={newAppointmentProcessTypeSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        const model = {
                            data: values.data.map(item => ({
                                ...item,
                                quantity: item.quantity.toFixed(2),
                                currency_code: undefined
                            }))
                        };
                        createAppointmentProcessType(model);
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
                                    <FieldArray
                                        name="data"
                                        render={arrayHelpers => (
                                            <>
                                                {values.data && values.data.length > 0 && values.data.map((item, index) => (
                                                    <Grid container justifyContent={"start"} alignContent={"center"} alignItems={"center"} spacing={1} marginBottom={2} padding={2} key={index}>
                                                        <Grid item xs={12} md={1}>
                                                            <Grid container justifyContent={"center"} paddingTop={4}>
                                                                <Grid marginRight={1}>
                                                                    <IconButton shape="rounded" variant="contained"
                                                                        color="secondary"
                                                                        size="small" onClick={() => {
                                                                            arrayHelpers.push({
                                                                                appointment_id: data.appointment_id,
                                                                                patient_id: data.patient_id,
                                                                                appointment_process_id: null,
                                                                                quantity: 1,
                                                                                amount: "0",
                                                                                discount_percentage: 0,
                                                                                discount_amount: 0,
                                                                                vat: 0,
                                                                                vat_included: false,
                                                                                vat_amount: 0,
                                                                                total: 0,
                                                                                currency_code: null,
                                                                                status: true,
                                                                            })
                                                                        }}>
                                                                        <Add />
                                                                    </IconButton>
                                                                </Grid>
                                                                <IconButton shape="rounded" variant="contained"
                                                                    color="secondary"
                                                                    disabled={values.data.length == 1}
                                                                    size="small" onClick={() => {
                                                                        arrayHelpers.remove(index)
                                                                    }}>
                                                                    <Minus />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                        {/* Randevu İşlemi */}
                                                        <Grid item xs={12} md={2.5}>
                                                            <Stack spacing={1}>
                                                                <InputLabel htmlFor="appointment_process_id">{`${intl.formatMessage({ id: "appointmentProcess" })}*`}</InputLabel>
                                                                <CustomFormikSelect
                                                                    name={`data[${index}].appointment_process_id`}
                                                                    placeholder={intl.formatMessage({ id: "selectAppointmentProcess" })}
                                                                    isClearable={true}
                                                                    isLoading={getAppointmentProcessDropdownLoading}
                                                                    zIndex={999 - index}
                                                                    value={
                                                                        values.data[index].appointment_process_id ? { label: getAppointmentProcessDropdownData?.data?.find((item) => item.value == values.data[index].appointment_process_id)?.label ?? "", value: getAppointmentProcessDropdownData?.data?.find((item) => item.value == values.data[index].appointment_process_id)?.value ?? 0 } : null}
                                                                    onChange={(val: any) => {
                                                                        if (values.data.length > 1 && !values.data.some(item => item.currency_code == val?.value?.currency_code)) {
                                                                            enqueueSnackbar("Seçilen randevu işlemlerinde farklı para birimleri tanımlı. ", {
                                                                                variant: 'error', anchorOrigin: {
                                                                                    vertical: 'bottom',
                                                                                    horizontal: 'right'
                                                                                }
                                                                            },)
                                                                            return;
                                                                        }
                                                                        setFieldValue(`data[${index}].appointment_process_id`, val?.value.value);

                                                                        if (val?.value?.vat_included == true) {
                                                                            const amount = parseFloat(val?.value?.amount);
                                                                            const vatRate = parseFloat(val?.value?.vat) / 100;
                                                                            const exclAmount = amount / (1 + vatRate);
                                                                            setFieldValue(`data[${index}].amount`, exclAmount.toFixed(2));
                                                                            //setFieldValue(`detail[${index}].amount`, (val?.value?.amount));
                                                                        } else {
                                                                            setFieldValue(`data[${index}].amount`, val?.value?.amount)
                                                                        }

                                                                        //setFieldValue(`data[${index}].amount`, val?.value?.amount);
                                                                        setFieldValue(`data[${index}].vat`, val?.value?.vat);
                                                                        setFieldValue(`data[${index}].vat_included`, val?.value?.vat_included);
                                                                        setFieldValue(`data[${index}].currency_code`, val?.value?.currency_code);
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
                                                                    value={values.data[index].quantity}
                                                                    name={`data[${index}].quantity`}
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    placeholder={intl.formatMessage({ id: "quantity" })}
                                                                    fullWidth
                                                                    error={Boolean((touched.data && touched.data[index]?.quantity) && (errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.quantity))}
                                                                    inputProps={{ min: 0, step: "0.5" }}
                                                                />
                                                            </Stack>
                                                            {(touched.data && touched.data[index]?.quantity) && (errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.quantity) && (
                                                                <FormHelperText error id="helper-text-firstname-signup">
                                                                    {(errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.quantity)}
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
                                                                            value={values.data[index].amount}
                                                                            //decimalsLimit={2}
                                                                            onValueChange={(value, name, values2) => {
                                                                                setFieldValue(`data[${index}].amount`, values2?.value)
                                                                            }}
                                                                            style={{
                                                                                padding: 14,
                                                                                border: `1px solid ${(touched.data && touched.data[index]?.amount) && (errors.data && (errors.data as FormikErrors<any>[])[0]?.amount) ? "#F04134" : "#BEC8D0"}`,
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
                                                            {(touched.data && touched.data[index]?.amount) && (errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.amount) && (
                                                                <FormHelperText error id="helper-text-firstname-signup">
                                                                    {(errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.amount)}
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
                                                                    value={values.data[index].discount_percentage}
                                                                    name={`data[${index}].discount_percentage`}
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    placeholder={intl.formatMessage({ id: "discount" })}
                                                                    fullWidth
                                                                    error={Boolean((touched.data && touched.data[index]?.discount_percentage) && (errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.discount_percentage))}
                                                                    inputProps={{ min: 0 }}
                                                                />
                                                            </Stack>
                                                            {(touched.data && touched.data[index]?.discount_percentage) && (errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.discount_percentage) && (
                                                                <FormHelperText error id="helper-text-firstname-signup">
                                                                    {(errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.discount_percentage)}
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
                                                                    name={`data[${index}].discount_amount`}
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    placeholder={intl.formatMessage({ id: "discountAmount" })}
                                                                    fullWidth
                                                                    error={Boolean((touched.data && touched.data[index]?.discount_amount) && (errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.discount_amount))}
                                                                />
                                                            </Stack>
                                                            {(touched.data && touched.data[index]?.discount_amount) && (errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.discount_amount) && (
                                                                <FormHelperText error id="helper-text-firstname-signup">
                                                                    {(errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.discount_amount)}
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
                                                                    value={values.data[index].vat}
                                                                    name={`data[${index}].vat`}
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    placeholder={intl.formatMessage({ id: "vat" })}
                                                                    fullWidth
                                                                    error={Boolean((touched.data && touched.data[index]?.vat) && (errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.vat))}
                                                                    inputProps={{ min: 0 }}
                                                                />
                                                            </Stack>
                                                            {(touched.data && touched.data[index]?.vat) && (errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.vat) && (
                                                                <FormHelperText error id="helper-text-firstname-signup">
                                                                    {(errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.vat)}
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
                                                                    name={`data[${index}].vat_amount`}
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    placeholder={intl.formatMessage({ id: "amount" })}
                                                                    fullWidth
                                                                    error={Boolean((touched.data && touched.data[index]?.vat_amount) && (errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.vat_amount))}
                                                                />
                                                            </Stack>
                                                            {(touched.data && touched.data[index]?.vat_amount) && (errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.vat_amount) && (
                                                                <FormHelperText error id="helper-text-firstname-signup">
                                                                    {(errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.vat_amount)}
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
                                                                    startAdornment={<>{values.data[index].currency_code ?? ""}</>}
                                                                    error={Boolean((touched.data && touched.data[index]?.total) && (errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.total))}
                                                                />
                                                            </Stack>
                                                            {(touched.data && touched.data[index]?.total) && (errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.total) && (
                                                                <FormHelperText error id="helper-text-firstname-signup">
                                                                    {(errors.data && (errors.data as FormikErrors<ProcessType>[])[0]?.total)}
                                                                </FormHelperText>
                                                            )}
                                                        </Grid>
                                                    </Grid>))}
                                            </>
                                        )}></FieldArray>
                                </Grid>
                                <Divider />
                                <Grid container flexDirection={"column"} alignContent="flex-end" marginTop={2}>
                                    <Grid item xs={12}>
                                        <Stack spacing={2}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography color="grey.500">{`${intl.formatMessage({ id: "totalAmount" })}:`}</Typography>
                                                <Typography>{`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: values.data[0].currency_code ?? 'TRY' }).format(
                                                    values.data.reduce((sum, item) => {
                                                        const iskontoTutari = (item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") * item.discount_percentage) / 100;
                                                        return sum + item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") - iskontoTutari;
                                                    }, 0)
                                                )}`}</Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between" spacing={4}>
                                                <Typography color="grey.500">{`${intl.formatMessage({ id: "totalDiscount" })}:`}</Typography>
                                                <Typography variant="h6" color="success.main">
                                                    {`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: values.data[0].currency_code ?? 'TRY' }).format(
                                                        values.data.reduce((sum, item) => sum + (item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") * item.discount_percentage) / 100, 0)
                                                    )}`}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography color="grey.500">{`${intl.formatMessage({ id: "calculatedVAT" })}:`}</Typography>
                                                <Typography>
                                                    {`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: values.data[0].currency_code ?? 'TRY' }).format(
                                                        values.data.reduce((sum, item) => {
                                                            const iskontoTutari = (item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") * item.discount_percentage) / 100;
                                                            return sum + (item.quantity * parseFloat(item.amount?.replace(',', '.') ?? "0") - iskontoTutari) * ((item.vat ?? 0) / 100);
                                                        }, 0)
                                                    )}`}</Typography>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between" spacing={4}>
                                                <Typography variant="subtitle1">{`${intl.formatMessage({ id: "amountToBePaid" })}:`}</Typography>
                                                <Typography variant="subtitle1">
                                                    {`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: values.data[0].currency_code ?? 'TRY' }).format(values.data.reduce((sum, item) => {
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
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting || createAppointmentProcessTypeIsLoading} type="submit" variant="contained" color="primary">
                                            {(createAppointmentProcessTypeIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createAppointmentProcessTypeIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default AddAppointmentProcessTypeModal