"use client"

import { Box, Button, Dialog, DialogActions, FormControlLabel, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Switch, Typography } from "@mui/material"
import { Add, CloseSquare } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum, setModal } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Form, Formik } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect } from "react";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import { useLazyGetPatientDropdownQuery } from "reduxt/features/patient/patient-api";
import CustomFormikAsyncSelect from "components/third-party/formik/custom-formik-asyncselect";
import { createSendSmsSchema } from "utils/schemas/appointment-validation-schema";
import { useCreateSendSmsMutation } from "reduxt/features/sms-integration/sms-integration-api";

const AddSendSmsModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const handleClose = () => {
        dispatch(closeModal())
    };

    const [getPatientDropdown, { isLoading: getPatientDropdownLoading }] = useLazyGetPatientDropdownQuery();


    const getPatientDropdownOptions = async (inputValue: string) => {

        if (inputValue.length >= 3) {
            const items = await getPatientDropdown({ label: inputValue })
            return items.data?.data ?? [];
        }
    }

    const [createSendSms, { isLoading: createSendSmsIsLoading, data: createSendSmsResponse, error: createSendSmsError }] = useCreateSendSmsMutation();

    useEffect(() => {
        if (createSendSmsResponse) {
            enqueueSnackbar(createSendSmsResponse.message, {
                variant: createSendSmsResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createSendSmsResponse?.status == true) {
                handleClose();
            }
        }
        if (createSendSmsError) {
            const error = createSendSmsError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createSendSmsResponse, createSendSmsError])

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
                    modalType: ModalEnum.newSendSms
                }))
            }}>{intl.formatMessage({ id: "sendSMS" })}</Button>
            <Dialog open={open && modalType == ModalEnum.newSendSms} onClose={handleClose}>
                <Formik
                    initialValues={{
                        receivers: null,
                        all_patients: false,
                        content: null,
                    }}
                    enableReinitialize
                    validationSchema={createSendSmsSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        createSendSms(values);
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
                                        <Typography variant="h4">{intl.formatMessage({ id: "sendSMS" })}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={36} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <CustomFormikAsyncSelect
                                            isMulti={true}
                                            name='receivers'
                                            loadOptions={getPatientDropdownOptions}
                                            isClearable
                                            isDisabled={values.all_patients == true}
                                            isLoading={getPatientDropdownLoading}
                                            placeholder={intl.formatMessage({ id: "searchTCPhoneOrName" })}
                                            onChange={(value) => {
                                                setFieldValue("receivers", value.map((item: any) => item.value));
                                            }}
                                            noOptionsMessage={() => intl.formatMessage({ id: "searchLeastThreeCharacters" })}
                                            loadingMessage={() => intl.formatMessage({ id: "loadingDot" })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel control={<Switch
                                            checked={values.all_patients}
                                            value={values.all_patients} onChange={(e, checked) => {
                                                console.log(checked);
                                                setFieldValue("all_patients", checked);
                                            }} />} label={intl.formatMessage({ id: "sendAllPatient" })} />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="message">{intl.formatMessage({ id: "message" })}</InputLabel>
                                            <OutlinedInput
                                                id="content"
                                                type="text"
                                                placeholder={intl.formatMessage({ id: "message" })}
                                                error={Boolean(touched.content && errors.content)}
                                                value={values.content}
                                                name="content"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                multiline
                                                rows={3}
                                            />
                                        </Stack>
                                        {touched.content && errors.content && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.content}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation
                                            disabled={isSubmitting || createSendSmsIsLoading} type="submit" variant="contained" color="primary">
                                            {(createSendSmsIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createSendSmsIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default AddSendSmsModal