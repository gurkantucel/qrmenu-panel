import React, { useEffect } from 'react'
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { Box, Button, Dialog, DialogActions, FormControlLabel, Grid, IconButton, InputLabel, Switch, Typography } from "@mui/material"
import { Add, CloseSquare } from "iconsax-react"
import { closeModal, ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import {  Form, Formik } from 'formik';
import CustomFormikSelect from 'components/third-party/formik/custom-formik-select';
import { enqueueSnackbar } from 'notistack';
import { PuffLoader } from 'react-spinners';
import AnimateButton from 'components/@extended/AnimateButton';
import { useLocalizedField } from 'hooks/useLocalizedField';
import { addSelectedFoodValidationSchema } from 'utils/schemas/food-validation-schema';
import { useCreateSelectedFoodMutation, useGetSelectedFoodDropdownQuery } from 'reduxt/features/selected-food/selected-food-api';
import { DropdownListData } from 'utils/models/dropdown-list-model';

const AddSelectedFoodModal = ({ branch }: { branch?: DropdownListData | null }) => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const t = useLocalizedField()

    const { isLoading: getSelectedFoodDropdownLoading, data: getSelectedFoodDropdownData } = useGetSelectedFoodDropdownQuery({ branchSlug: branch?.field }, { skip: !branch?.field || modalType != ModalEnum.addSelectedFood })

    const [createSelectedfood, { isLoading: createSelectedfoodIsLoading, data: createSelectedfoodResponse, error: createSelectedfoodError }] = useCreateSelectedFoodMutation();

    useEffect(() => {
        if (open && modalType == ModalEnum.addFood) {

        }
    }, [open, modalType, getSelectedFoodDropdownData])

    useEffect(() => {
        if (createSelectedfoodResponse) {
            enqueueSnackbar(createSelectedfoodResponse.message, {
                variant: createSelectedfoodResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createSelectedfoodResponse?.success == true) {
                handleClose();
            }
        }
        if (createSelectedfoodError) {
            const error = createSelectedfoodError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createSelectedfoodResponse, createSelectedfoodError])

    const handleClose = () => {
        dispatch(closeModal())
    };

    return (
        <>
            <Button variant="dashed" startIcon={<Add />}
                onClick={() => {
                    dispatch(setModal({
                        open: true,
                        modalType: ModalEnum.addSelectedFood
                    }))
                }}>{intl.formatMessage({ id: "add" })}</Button>
            <Dialog open={open && modalType == ModalEnum.addSelectedFood} onClose={handleClose} fullWidth maxWidth={"md"}>
                <Box sx={{ px: 3, py: 3 }}>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                    >
                        <Grid item>
                            <Typography variant="h4">{intl.formatMessage({ id: "add" })}</Typography>
                        </Grid>
                        <Grid item sx={{ mr: 1.5 }}>
                            <IconButton color="secondary" onClick={handleClose}>
                                <CloseSquare size={36} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Formik initialValues={{
                        branchFoods: [] as string[],
                        status: true
                    }}
                        enableReinitialize
                        validationSchema={addSelectedFoodValidationSchema}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            const newValue = {
                                branchSlug: branch?.field ?? "",
                                branchId: branch?.value ?? "",
                                ...values
                            }
                            createSelectedfood(newValue);
                        }}>
                        {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <Form>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12}>
                                        <InputLabel htmlFor="allergens">{intl.formatMessage({ id: "foods" })}</InputLabel>
                                        <CustomFormikSelect
                                            name='branchFoods'
                                            placeholder={intl.formatMessage({id: "makeYourChoice"})}
                                            menuPortalTarget={document.body}
                                            isMulti={true}
                                            isLoading={getSelectedFoodDropdownLoading}
                                            zIndex={989}
                                            value={getSelectedFoodDropdownData?.data?.filter((item) => values.branchFoods?.some((b) => b === item.value))
                                                .map((item2) => ({
                                                    value: item2.value,
                                                    label: t(item2.label),
                                                }))}
                                            options={getSelectedFoodDropdownData?.data?.map((item) => ({
                                                value: item.value,
                                                label: t(item.label)
                                            }))}
                                            //getOptionValue={(option: any) => option.value.id.toString()}
                                            //getOptionLabel={(option: any) => option.label}
                                            onChange={(val: any) => {
                                                console.log(val);
                                                setFieldValue("branchFoods", val.map((item: any) => (item.value)));
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputLabel htmlFor="status">{intl.formatMessage({ id: "status" })}</InputLabel>
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
                                        <Button disableElevation
                                            disabled={createSelectedfoodIsLoading}
                                            type="submit" variant="contained" color="primary">
                                            {(createSelectedfoodIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createSelectedfoodIsLoading == false) && intl.formatMessage({ id: "save" })}
                                        </Button>
                                    </AnimateButton>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Dialog>
        </>
    )
}

export default AddSelectedFoodModal
