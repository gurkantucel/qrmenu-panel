"use client"

import { Box, Button, Dialog, DialogActions, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material"
import { Add, CloseSquare, Minus } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { FieldArray, Form, Formik, FormikErrors } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect } from "react";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import CustomScaleLoader from "components/CustomScaleLoader";
import { newAppointmentProcessTypeSchema } from "utils/schemas/appointment-validation-schema";
import { useCreateAppointmentProcessTypeMutation, useLazyGetAppointmentProcessDropdownQuery } from "reduxt/features/appointment/appointment-process-type-api";

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
            <Dialog open={open && modalType == ModalEnum.newAppointmentProcessType} onClose={handleClose} fullWidth maxWidth="md">
                {false || false ? <CustomScaleLoader /> : <Formik
                    initialValues={{
                        data: [{
                            appointment_id: data?.appointment_id,
                            patient_id: data?.patient_id,
                            appointment_process_id: null,
                            amount: null,
                            currency_code: null,
                            status: true,
                        }]
                    }}
                    enableReinitialize
                    validationSchema={newAppointmentProcessTypeSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        const model = {
                            data: values.data.map(item => ({
                                ...item,
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
                                                    <Grid container justifyContent={"center"} alignContent={"center"} alignItems={"center"} spacing={3} marginBottom={3} key={index}>
                                                        <Grid item xs={2}>
                                                            <Grid container justifyContent={"center"} paddingTop={4}>
                                                                <Grid marginRight={1}>
                                                                    <IconButton shape="rounded" variant="contained"
                                                                        color="secondary"
                                                                        size="small" onClick={() => {
                                                                            arrayHelpers.insert(index, {
                                                                                appointment_id: data.appointment_id,
                                                                                patient_id: data.patient_id,
                                                                                appointment_process_id: null,
                                                                                amount: null,
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
                                                        <Grid item xs={5}>
                                                            <Stack spacing={1}>
                                                                <InputLabel htmlFor="person_id">{`${intl.formatMessage({ id: "appointmentProcess" })}*`}</InputLabel>
                                                                <CustomFormikSelect
                                                                    name={`data[${index}].appointment_process_id`}
                                                                    placeholder={intl.formatMessage({ id: "selectAppointmentProcess" })}
                                                                    isClearable={true}
                                                                    isLoading={getAppointmentProcessDropdownLoading}
                                                                    zIndex={999 - index}
                                                                    value={
                                                                        values.data[index].appointment_process_id ? { label: getAppointmentProcessDropdownData?.data?.find((item) => item.value == values.data[index].appointment_process_id)?.label ?? "", value: getAppointmentProcessDropdownData?.data?.find((item) => item.value == values.data[index].appointment_process_id)?.value ?? 0 } : null}
                                                                    onChange={(val: any) => {
                                                                        setFieldValue(`data[${index}].appointment_process_id`, val?.value.value);
                                                                        setFieldValue(`data[${index}].amount`, val?.value?.amount);
                                                                        setFieldValue(`data[${index}].currency_code`, val?.value?.currency_code);
                                                                    }}

                                                                    options={getAppointmentProcessDropdownData?.data?.map((item) => ({
                                                                        value: item,
                                                                        label: item.label
                                                                    }))}
                                                                />
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item xs={5}>
                                                            <Stack spacing={1}>
                                                                <InputLabel htmlFor="person_id">
                                                                    {`${intl.formatMessage({ id: "amount" })}*`}</InputLabel>
                                                                <OutlinedInput
                                                                    id="name"
                                                                    type="text"
                                                                    value={values.data[index].amount}
                                                                    name={`data[${index}].amount`}
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    placeholder={intl.formatMessage({ id: "amount" })}
                                                                    fullWidth
                                                                    startAdornment={<>{values.data[index].currency_code ?? ""}</>}
                                                                    error={Boolean((touched.data && touched.data[index].amount) && (errors.data && (errors.data as FormikErrors<{
                                                                        appointment_id: number;
                                                                        patient_id: number;
                                                                        appointment_process_id: null;
                                                                        amount: null;
                                                                        status: boolean;
                                                                    }>[])[0]?.amount))}
                                                                />
                                                            </Stack>
                                                            {(touched.data && touched.data[index].amount) && (errors.data && (errors.data as FormikErrors<{
                                                                appointment_id: number;
                                                                patient_id: number;
                                                                appointment_process_id: null;
                                                                amount: null;
                                                                status: boolean;
                                                            }>[])[0]?.amount) && (
                                                                    <FormHelperText error id="helper-text-firstname-signup">
                                                                        {(errors.data && (errors.data as FormikErrors<{
                                                                            appointment_id: number;
                                                                            patient_id: number;
                                                                            appointment_process_id: null;
                                                                            amount: null;
                                                                            status: boolean;
                                                                        }>[])[0]?.amount)}
                                                                    </FormHelperText>
                                                                )}
                                                        </Grid>
                                                    </Grid>))}
                                            </>
                                        )}></FieldArray>
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