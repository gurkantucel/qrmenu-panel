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
import { useEffect, useState } from "react";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import { PersonTypeCreateBodyModel } from "reduxt/features/settings/models/person-type-model";
import { useCreatePersonTypeMutation, useUpdatePersonTypeMutation } from "reduxt/features/settings/person-type-api";
import { newPersonTypeValidationSchema } from "utils/schemas/person-type-validation-schema";

const AddPersonTypeModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<PersonTypeCreateBodyModel>();

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    const [createPersonType, { isLoading: createPersonTypeIsLoading, data: createPersonTypeResponse, error: createPersonTypeError }] = useCreatePersonTypeMutation();

    const [updatePersonType, { isLoading: updatePersonTypeIsLoading, data: updatePersonTypeResponse, error: updatePersonTypeError }] = useUpdatePersonTypeMutation();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newPersonType && data != null) {
            const model: PersonTypeCreateBodyModel = {
                person_type_id: data.person_type_id,
                code: data.code,
                name: data.name,
                description: data.description,
                status: data.status,
            }
            setInitialData(model);
        }
    }, [open, data])

    useEffect(() => {
        if (createPersonTypeResponse) {
            enqueueSnackbar(createPersonTypeResponse.message, {
                variant: createPersonTypeResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createPersonTypeResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (createPersonTypeError) {
            var error = createPersonTypeError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createPersonTypeResponse, createPersonTypeError])

    useEffect(() => {
        if (updatePersonTypeResponse) {
            enqueueSnackbar(updatePersonTypeResponse.message, {
                variant: updatePersonTypeResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updatePersonTypeResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (updatePersonTypeError) {
            var error = updatePersonTypeError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updatePersonTypeResponse, updatePersonTypeError])

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
                    modalType: ModalEnum.newPersonType
                }))
            }}>{intl.formatMessage({id: "new"})}</Button>
            <Dialog open={open && modalType == ModalEnum.newPersonType} onClose={handleClose}>
                <Formik
                    initialValues={initialData ?? {
                        person_type_id: undefined,
                        code: '',
                        name: '',
                        description: null,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newPersonTypeValidationSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (values.person_type_id != null) {
                            updatePersonType(values);
                        } else {
                            createPersonType(values);
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
                                        <Typography variant="h4">{intl.formatMessage({ id: id != null ? "updatePersonType" : "newPersonType" })}</Typography>
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
                                                placeholder={intl.formatMessage({ id: "uniqueIdExample2" })}
                                                inputProps={{ maxLength: 10 }}
                                            />
                                        </Stack>
                                        {touched.code && errors.code && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.code}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={12}>
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
                                        <Button disableElevation disabled={isSubmitting || createPersonTypeIsLoading || updatePersonTypeIsLoading} type="submit" variant="contained" color="primary">
                                            {(createPersonTypeIsLoading || updatePersonTypeIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createPersonTypeIsLoading == false || updatePersonTypeIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default AddPersonTypeModal