"use client"

import { Box, Button, Dialog, DialogActions, FormControlLabel, FormHelperText, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Stack, Switch, TextField, Typography } from "@mui/material"
import { Add, Eye, EyeSlash } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum, setModal } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Form, Formik, useFormikContext } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { useCreatePersonMutation, useLazyReadPersonQuery, useUpdatePersonMutation } from "reduxt/features/person/person-api";
import { PuffLoader } from "react-spinners";
import { SyntheticEvent, useEffect, useState } from "react";
import { useLazyGetModuleDropdownQuery, useLazyGetPersonTypeDropdownQuery } from "reduxt/features/definition/definition-api";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import { DropdownListData } from "utils/models/dropdown-list-model";
import IconButton from "components/@extended/IconButton";
import { newPersonValidationSchema } from "utils/schemas/person-validation-schema";
import { enqueueSnackbar } from "notistack";
import { PersonCreateBodyModel } from "reduxt/features/person/models/person-list-model";
import CustomScaleLoader from "components/CustomScaleLoader";

const AddPersonModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<PersonCreateBodyModel>();

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: SyntheticEvent) => {
        event.preventDefault();
    };

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    //const [getPersonList] = useLazyGetPersonListQuery();

    const [getPersonType, { data: getPersonTypeData, isLoading: getPersonTypeLoading }] = useLazyGetPersonTypeDropdownQuery();

    const [createPerson, { isLoading: createPersonIsLoading, data: createPersonResponse, error: createPersonError }] = useCreatePersonMutation();

    const [updatePerson, { isLoading: updatePersonIsLoading, data: updatePersonResponse, error: updatePersonError }] = useUpdatePersonMutation();

    const [readPerson, {
        data: readPersonData,
        isLoading: readPersonLoading,
        isFetching: readPersonFetching
    }] = useLazyReadPersonQuery();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newPerson) {
            getPersonType();
            if (id != null) {
                readPerson({ person_id: id })
            }
        }
    }, [open, id])

    useEffect(() => {
        if (readPersonData?.data != null) {
            const model: PersonCreateBodyModel = {
                person_id: readPersonData.data.person_id,
                person_type_id: readPersonData.data.person_type_id,
                name: readPersonData.data.name,
                surname: readPersonData.data.surname,
                phone_code: readPersonData.data.phone_code,
                phone_number: readPersonData.data.phone_number,
                email: readPersonData.data.email,
                password: undefined,
                authorizations: readPersonData.data.person_authorizations?.map((item) => item.module_id) ?? [],
                accepting_appointment: readPersonData.data?.accepting_appointment,
                status: true
            }
            setInitialData(model);
        }
    }, [readPersonData])

    useEffect(() => {
        if (createPersonResponse) {
            enqueueSnackbar(createPersonResponse.message, {
                variant: createPersonResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createPersonResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (createPersonError) {
            var error = createPersonError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createPersonResponse, createPersonError])

    useEffect(() => {
        if (updatePersonResponse) {
            enqueueSnackbar(updatePersonResponse.message, {
                variant: updatePersonResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updatePersonResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (updatePersonError) {
            var error = updatePersonError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updatePersonResponse, updatePersonError])

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
                    modalType: ModalEnum.newPerson
                }))
            }}>{"Yeni Çalışan"}</Button>
            <Dialog open={open && modalType == ModalEnum.newPerson} onClose={handleClose}>
                {readPersonLoading || readPersonFetching ? <CustomScaleLoader /> : <Formik
                    initialValues={initialData ?? {
                        person_id: undefined,
                        person_type_id: 0,
                        name: '',
                        surname: '',
                        phone_code: '+90',
                        phone_number: '',
                        email: '',
                        password: '',
                        authorizations: [0],
                        accepting_appointment: true,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newPersonValidationSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (values.person_id != null) {
                            updatePerson(values);
                        } else {
                            createPerson(values);
                        }
                    }}
                >
                    {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <Form>
                            <Box sx={{ px: 3, py: 5 }}>
                                <Typography variant="h5" marginBottom={"1.4rem"}>{intl.formatMessage({ id: id != null ? "updatePerson" : "addPerson" })}</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "name" })}</InputLabel>
                                            <OutlinedInput
                                                id="name"
                                                type="firstname"
                                                value={values.name}
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "name" })}
                                                fullWidth
                                                error={Boolean(touched.name && errors.name)}
                                                inputProps={{ maxLength: 100 }}
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
                                            <InputLabel htmlFor="lastname-signup">{intl.formatMessage({ id: "surname" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.surname && errors.surname)}
                                                id="lastname-signup"
                                                type="lastname"
                                                value={values.surname}
                                                name="surname"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "surname" })}
                                                inputProps={{ maxLength: 100 }}
                                            />
                                        </Stack>
                                        {touched.surname && errors.surname && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.surname}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="personal-phone">{intl.formatMessage({ id: "phone" })}</InputLabel>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                                <Select
                                                    MenuProps={{
                                                        style: { zIndex: 9999 }
                                                    }}
                                                    value={values.phone_code} name="phone_code" onBlur={handleBlur} onChange={handleChange}>
                                                    <MenuItem value="+90">+90</MenuItem>
                                                    <MenuItem value="+91">+91</MenuItem>
                                                    <MenuItem value="1-671">1-671</MenuItem>
                                                    <MenuItem value="+36">+36</MenuItem>
                                                    <MenuItem value="(225)">(255)</MenuItem>
                                                    <MenuItem value="+39">+39</MenuItem>
                                                    <MenuItem value="1-876">1-876</MenuItem>
                                                    <MenuItem value="+7">+7</MenuItem>
                                                    <MenuItem value="(254)">(254)</MenuItem>
                                                    <MenuItem value="(373)">(373)</MenuItem>
                                                    <MenuItem value="1-664">1-664</MenuItem>
                                                    <MenuItem value="+95">+95</MenuItem>
                                                    <MenuItem value="(264)">(264)</MenuItem>
                                                </Select>
                                                <TextField
                                                    fullWidth
                                                    id="person_phone_number"
                                                    error={Boolean(touched.phone_number && errors.phone_number)}
                                                    value={values.phone_number}
                                                    name="phone_number"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={intl.formatMessage({ id: "phone" })}
                                                    inputProps={{
                                                        type: "tel",
                                                        maxLength: 10,
                                                        inputMode: "numeric",
                                                    }}
                                                />
                                            </Stack>
                                        </Stack>
                                        {touched.phone_number && errors.phone_number && (
                                            <FormHelperText error id="personal-contact-helper">
                                                {errors.phone_number}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="email-signup">{intl.formatMessage({ id: "email" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.email && errors.email)}
                                                id="person_email"
                                                type="email"
                                                value={values.email}
                                                name="email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "email" })}
                                                inputProps={{ maxLength: 200 }}
                                            />
                                        </Stack>
                                        {touched.email && errors.email && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.email}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    {id == null && <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="password-login">{intl.formatMessage({ id: "password" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.password && errors.password)}
                                                id="-password-login"
                                                type={showPassword ? 'text' : 'password'}
                                                value={values.password}
                                                name="password"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                            color="secondary"
                                                        >
                                                            {showPassword ? <Eye /> : <EyeSlash />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                inputProps={{ maxLength: 20 }}
                                                placeholder={intl.formatMessage({ id: "password" })}
                                            />
                                        </Stack>
                                        {touched.password && errors.password && (
                                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                                {errors.password}
                                            </FormHelperText>
                                        )}
                                    </Grid>}
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="company-signup">{intl.formatMessage({ id: "personType" })}</InputLabel>
                                            <CustomFormikSelect
                                                name='person_type_id'
                                                placeholder="Seçim yapınız..."
                                                isLoading={getPersonTypeLoading}
                                                zIndex={9999}
                                                options={getPersonTypeData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                                value={
                                                    values.person_type_id ? { label: getPersonTypeData?.data?.find((item) => item.value == values.person_type_id)?.label ?? "", value: getPersonTypeData?.data?.find((item) => item.value == values.person_type_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("person_type_id", val?.value ?? 0);
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <AuthorizationsInput />
                                    <Grid item xs={12}>
                                        <FormControlLabel control={<Switch
                                            checked={values.accepting_appointment}
                                            value={values.accepting_appointment} onChange={(e, checked) => {
                                                setFieldValue("accepting_appointment", checked);
                                            }} />} label={intl.formatMessage({ id: "acceptingAppointment" })} />
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting || createPersonIsLoading || updatePersonIsLoading} type="submit" variant="contained" color="primary">
                                            {(createPersonIsLoading || updatePersonIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createPersonIsLoading == false || updatePersonIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default AddPersonModal

const AuthorizationsInput = () => {
    const { data: { open, modalType, id } } = useAppSelector((state: RootState) => state.modal);
    const { values, setFieldValue } = useFormikContext<any>();

    const [getModule, { data: getModuleData, isLoading: getModuleLoading }] = useLazyGetModuleDropdownQuery();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newPerson) {
            getModule();
        }
    }, [open])

    useEffect(() => {
        if (getModuleData?.status && getModuleData.data != null && getModuleData.data.length > 0) {
            if (id == null) {
                setFieldValue("authorizations", getModuleData.data.map((item) => item.value));
            }
        }
    }, [getModuleData])
    return (
        <Grid item xs={12}>
            <Stack spacing={1}>
                <InputLabel htmlFor="company-signup">Yetkiler</InputLabel>
                <CustomFormikSelect
                    name='authorizations'
                    placeholder="Seçim yapınız..."
                    isMulti={true}
                    isLoading={getModuleLoading}
                    zIndex={9998}
                    value={getModuleData?.data.filter((item) => values.authorizations?.includes(item.value))}
                    options={getModuleData?.data?.map((item) => ({
                        value: item.value,
                        label: item.label
                    }))}
                    onChange={(val: DropdownListData[]) => {
                        //setSelectModules(val);
                        setFieldValue("authorizations", val.map((item) => item.value));
                    }}
                />
            </Stack>
        </Grid>
    )
}