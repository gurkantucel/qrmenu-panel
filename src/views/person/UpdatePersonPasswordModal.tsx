"use client"

import { Box, Button, Dialog, DialogActions, FormControlLabel, FormHelperText, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Stack, Switch, TextField, Typography } from "@mui/material"
import { Add, CloseSquare, Eye, EyeSlash } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum, setModal } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Form, Formik } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { useUpdatePersonPasswordMutation } from "reduxt/features/person/person-api";
import { PuffLoader } from "react-spinners";
import { SyntheticEvent, useEffect, useState } from "react";
import IconButton from "components/@extended/IconButton";
import { updatePersonPasswordSchema } from "utils/schemas/person-validation-schema";
import { enqueueSnackbar } from "notistack";
import { PersonCreateBodyModel } from "reduxt/features/person/models/person-list-model";

const UpdatePersonPasswordModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowPassword2 = () => {
        setShowPassword2(!showPassword);
    };

    const handleMouseDownPassword = (event: SyntheticEvent) => {
        event.preventDefault();
    };

    const handleMouseDownPassword2 = (event: SyntheticEvent) => {
        event.preventDefault();
    };

    const handleClose = () => {
        dispatch(closeModal())
    };

    const [updatePersonPassword, { isLoading: updatePersonPasswordIsLoading, data: updatePersonPasswordResponse, error: updatePersonPasswordError }] = useUpdatePersonPasswordMutation();

    useEffect(() => {
        if (updatePersonPasswordResponse) {
            enqueueSnackbar(updatePersonPasswordResponse.message, {
                variant: updatePersonPasswordResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updatePersonPasswordResponse?.status == true) {
                handleClose();
            }
        }
        if (updatePersonPasswordError) {
            var error = updatePersonPasswordError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updatePersonPasswordResponse, updatePersonPasswordError])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.updatePersonPassword} onClose={handleClose}>
                {<Formik
                    initialValues={{
                        person_id: id,
                        password: "",
                        confirm_password: "",
                    }}
                    validationSchema={updatePersonPasswordSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        const model = {person_id: values.person_id, password: values.password}
                        updatePersonPassword(model)
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
                                    sx={{ borderBottom: '1px solid {theme.palette.divider}' }}
                                >
                                    <Grid item>
                                        <Typography variant="h5">{intl.formatMessage({ id: "changePassword" })}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={48} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Typography variant="body2" marginBottom={"1.4rem"}>{"Zorunlu alanlar * ile belirtilmiştir."}</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="password-login">{`${intl.formatMessage({ id: "password" })}*`}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.password && errors.password)}
                                                id="password-login"
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
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="confirm_password">{`${intl.formatMessage({ id: "repeatPassword" })}*`}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.password && errors.password)}
                                                id="confirm_password"
                                                type={showPassword2 ? 'text' : 'password'}
                                                value={values.confirm_password}
                                                name="confirm_password"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword2}
                                                            onMouseDown={handleMouseDownPassword2}
                                                            edge="end"
                                                            color="secondary"
                                                        >
                                                            {showPassword2 ? <Eye /> : <EyeSlash />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                inputProps={{ maxLength: 20 }}
                                                placeholder={intl.formatMessage({ id: "repeatPassword" })}
                                            />
                                        </Stack>
                                        {touched.confirm_password && errors.confirm_password && (
                                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                                {errors.confirm_password}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting || updatePersonPasswordIsLoading} type="submit" variant="contained" color="primary">
                                            {(updatePersonPasswordIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(updatePersonPasswordIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default UpdatePersonPasswordModal