"use client"

import { Box, Button, Dialog, DialogActions, FormControlLabel, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Switch, Tooltip, Typography } from "@mui/material"
import { Add, CloseSquare, InfoCircle } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum, setModal } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Field, Form, Formik } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { useLazyGetAppointmentProcessTypeDropdownQuery, useLazyGetCurrencyDropdownQuery } from "reduxt/features/definition/definition-api";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import { DropdownListData } from "utils/models/dropdown-list-model";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import { CreateAppointmentProcessBodyModel } from "reduxt/features/settings/models/appointment-process-model";
import { useCreateAppointmentProcessMutation, useLazyGetAppointmentProcessDropdownQuery, useUpdateAppointmentProcessMutation } from "reduxt/features/settings/appointment-process-api";
import { newAppointmentProcessSchema } from "utils/schemas/appointment-validation-schema";
import CurrencyInput from 'react-currency-input-field';

const AddAppointmentProcessModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<CreateAppointmentProcessBodyModel>();

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    //const [getPersonList] = useLazyGetPersonListQuery();

    const [getAppointmentProcessType, { data: getAppointmentProcessTypeData, isLoading: getAppointmentProcessTypeLoading }] = useLazyGetAppointmentProcessTypeDropdownQuery();

    const [getAppointmentProcessDropdown, { data: getAppointmentProcessDropdownData, isLoading: getAppointmentProcessDropdownLoading }] = useLazyGetAppointmentProcessDropdownQuery();

    const [getCurrency, { data: getCurrencyData, isLoading: isCurrencyLoading }] = useLazyGetCurrencyDropdownQuery();

    const [createAppointmentProcess, { isLoading: createAppointmentProcessIsLoading, data: createAppointmentProcessResponse, error: createAppointmentProcessError }] = useCreateAppointmentProcessMutation();

    const [updateAppointmentProcess, { isLoading: updateAppointmentProcessIsLoading, data: updateAppointmentProcessResponse, error: updateAppointmentProcessError }] = useUpdateAppointmentProcessMutation();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newAppointmentProcess) {
            getAppointmentProcessType();
            if (id == null) {
                //getAppointmentProcessDropdown({});
            }
            getCurrency();
        }
    }, [open, id])

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newAppointmentProcess && data != null) {
            if (data.appointment_process_type_id == 3) {
                getAppointmentProcessDropdown({
                    include_packages: data.appointment_process_type_id == 3 ? false : true,
                    excluded_appointment_process_id: data.appointment_process_id
                });
            }
            const model: CreateAppointmentProcessBodyModel = {
                appointment_process_id: data.appointment_process_id,
                currency_id: data.currency_id,
                appointment_process_type_id: data.appointment_process_type_id,
                code: data.code,
                name: data.name,
                description: data.description,
                amount: data.amount,
                vat: data.vat,
                vat_included: data.vat_included,
                sub_appointment_process: data.sub_appointment_process,
                status: data.status
            }
            setInitialData(model);
        }
    }, [open, data])

    useEffect(() => {
        if (createAppointmentProcessResponse) {
            enqueueSnackbar(createAppointmentProcessResponse.message, {
                variant: createAppointmentProcessResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createAppointmentProcessResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (createAppointmentProcessError) {
            var error = createAppointmentProcessError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createAppointmentProcessResponse, createAppointmentProcessError])

    useEffect(() => {
        if (updateAppointmentProcessResponse) {
            enqueueSnackbar(updateAppointmentProcessResponse.message, {
                variant: updateAppointmentProcessResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateAppointmentProcessResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (updateAppointmentProcessError) {
            var error = updateAppointmentProcessError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateAppointmentProcessResponse, updateAppointmentProcessError])

    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <>
            <Button variant="dashed" startIcon={<Add />} onClick={() => {
                dispatch(setModal({
                    open: true,
                    modalType: ModalEnum.newAppointmentProcess
                }))
            }}>{"Yeni İşlem"}</Button>
            <Dialog open={open && modalType == ModalEnum.newAppointmentProcess} onClose={handleClose}>
                <Formik
                    initialValues={initialData ?? {
                        appointment_process_id: undefined,
                        currency_id: "",
                        appointment_process_type_id: "",
                        code: '',
                        name: '',
                        description: null,
                        amount: undefined,
                        vat: 0,
                        sub_appointment_process: null,
                        vat_included: false,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newAppointmentProcessSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (values.amount && typeof values.amount == "number") {
                            values.amount = values.amount.toFixed(2);
                        }
                        if (values.appointment_process_id != null) {
                            updateAppointmentProcess(values);
                        } else {
                            createAppointmentProcess(values);
                        }
                    }}
                >
                    {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <Form>
                            <Box sx={{ px: 3, py: 5 }}>
                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 2 }}
                                >
                                    <Grid item>
                                        <Typography variant="h4">{intl.formatMessage({ id: id != null ? "updateProcess" : "newProcess" })}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={36} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="firstname-signup">{`${intl.formatMessage({ id: "name" })}*`}</InputLabel>
                                            <OutlinedInput
                                                id="name"
                                                type="text"
                                                value={values.name}
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "name" })}
                                                fullWidth
                                                error={Boolean(touched.name && errors.name)}
                                                inputProps={{ maxLength: 50 }}
                                            />
                                        </Stack>
                                        {touched.name && errors.name && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {errors.name}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="lastname-signup">{`${intl.formatMessage({ id: "code" })}*`}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.code && errors.code)}
                                                id="code"
                                                type="text"
                                                value={values.code}
                                                name="code"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "uniqueIdExample" })}
                                                inputProps={{ maxLength: 10 }}
                                            />
                                        </Stack>
                                        {touched.code && errors.code && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.code}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="appointment_process_type_id">{`${intl.formatMessage({ id: "processType" })}*`}</InputLabel>
                                            <CustomFormikSelect
                                                name='appointment_process_type_id'
                                                placeholder="Seçim yapınız..."
                                                isLoading={getAppointmentProcessTypeLoading}
                                                zIndex={9999}
                                                options={getAppointmentProcessTypeData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                                value={
                                                    values.appointment_process_type_id ? { label: getAppointmentProcessTypeData?.data?.find((item) => item.value == values.appointment_process_type_id)?.label ?? "", value: getAppointmentProcessTypeData?.data?.find((item) => item.value == values.appointment_process_type_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("appointment_process_type_id", val?.value ?? 0);
                                                    if (val?.value == 3) {
                                                        //paket ise getir.
                                                        getAppointmentProcessDropdown({
                                                            include_packages: val?.value == 3 ? false : true,
                                                            //excluded_appointment_process_id: values.appointment_process_id
                                                        });
                                                    } else {
                                                        setFieldValue("sub_appointment_process", null);
                                                    }
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="description">{intl.formatMessage({ id: "description" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.description && errors.description)}
                                                id="description"
                                                type="text"
                                                value={values.description}
                                                name="description"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "description" })}
                                                inputProps={{ maxLength: 500 }}
                                            />
                                        </Stack>
                                        {touched.description && errors.description && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.description}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="currency">{intl.formatMessage({ id: "currencyType" })}{"*"}</InputLabel>
                                            <CustomFormikSelect
                                                name='currency_id'
                                                placeholder="Döviz Türü Seçin"
                                                isClearable={true}
                                                isLoading={isCurrencyLoading}
                                                zIndex={9998}
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
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="person_id">
                                                {`${intl.formatMessage({ id: "amount" })}*`}</InputLabel>
                                            <Field name={"amount"}>
                                                {({ field, form, meta }: any) => (
                                                    <CurrencyInput
                                                        id="amount"
                                                        name={`amount`}
                                                        placeholder={intl.formatMessage({ id: "amount" })}
                                                        value={values.amount ?? undefined}
                                                        decimalsLimit={2}
                                                        onValueChange={(value, name, values) => {
                                                            setFieldValue("amount", values?.float)
                                                        }}
                                                        style={{
                                                            padding: 14,
                                                            border: `1px solid ${touched.amount && errors.amount ? "#F04134" : "#BEC8D0"}`,
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
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="vat">
                                                {`${intl.formatMessage({ id: "vat" })}`}</InputLabel>
                                            <OutlinedInput
                                                id="vat"
                                                type="number"
                                                value={values.vat}
                                                name={`vat`}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "vat" })}
                                                fullWidth
                                                inputProps={{ min: 0 }}
                                                error={Boolean(touched.vat && errors.vat)}
                                            />
                                        </Stack>
                                        {touched.vat && errors.vat && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {`${errors.vat}`}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel control={<Switch
                                            checked={values.vat_included}
                                            value={values.status} onChange={(e, checked) => {
                                                setFieldValue("vat_included", checked);
                                            }} />} label={intl.formatMessage({ id: "vatIncluded" })} />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="sub_appointment_process">
                                                {intl.formatMessage({ id: "subProcess" })}
                                                <Tooltip title="Paket kullanımı için alt işlemler seçin."><InfoCircle size={14} /></Tooltip>
                                            </InputLabel>
                                            <CustomFormikSelect
                                                name='sub_appointment_process'
                                                placeholder="Seçim yapınız..."
                                                isLoading={getAppointmentProcessDropdownLoading}
                                                zIndex={9997}
                                                isMulti={true}
                                                isDisabled={values.appointment_process_type_id != "305ee410-8284-408e-99c7-9c2ee07f7297"}
                                                options={getAppointmentProcessDropdownData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                                value={getAppointmentProcessDropdownData?.data?.filter((item) => values.sub_appointment_process?.includes(item.value))}
                                                onChange={(val: DropdownListData[], actionMeta) => {
                                                    setFieldValue("sub_appointment_process", val.map((item) => item.value));
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel control={<Switch
                                            checked={values.status}
                                            value={values.status} onChange={(e, checked) => {
                                                setFieldValue("status", checked);
                                            }} />} label={intl.formatMessage({ id: values.status ? "active" : "passive" })} />
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting || createAppointmentProcessIsLoading || updateAppointmentProcessIsLoading} type="submit" variant="contained" color="primary">
                                            {(createAppointmentProcessIsLoading || updateAppointmentProcessIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createAppointmentProcessIsLoading == false || updateAppointmentProcessIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default AddAppointmentProcessModal