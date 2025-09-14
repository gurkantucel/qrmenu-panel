"use client"

import { Box, Button, Dialog, DialogActions, FormControlLabel, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Switch, Typography } from "@mui/material"
import { Add, CloseSquare } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum, setModal } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { FieldArray, Form, Formik } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect, useState } from "react";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import { useLazyGetMealTimeDropdownQuery } from "reduxt/features/definition/definition-api";
import { useCreateDieticianDietTemplateMutation, useLazyReadDieticianDietTemplateQuery, useUpdateDieticianDietTemplateMutation } from "reduxt/features/settings/diet-template-api";
import { CreateDieticianDietTemplateBodyModel } from "reduxt/features/settings/models/diet-template-list-model";
import { newDietTemplateValidationSchema } from "utils/schemas/diet-template-validation-schema";
import MainCard from "components/MainCard";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import useUser from "hooks/useUser";

export const dayName = (day: number) => {
    switch (day) {
        case 1:
            return "Pazartesi";
        case 2:
            return "Salı";
        case 3:
            return "Çarşamba";
        case 4:
            return "Perşembe";
        case 5:
            return "Cuma";
        case 6:
            return "Cumartesi";
        case 7:
            return "Pazar";
    }
}

const AddDietTemplateListModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const user = useUser();

    const [getmealTime, { data: getmealTimeData, isLoading: ismealTimeLoading }] = useLazyGetMealTimeDropdownQuery();

    const [createDieticianDietTemplate, { isLoading: createDieticianDietTemplateIsLoading, data: createDieticianDietTemplateResponse, error: createDieticianDietTemplateError }] = useCreateDieticianDietTemplateMutation();

    const [updateDieticianDietTemplate, { isLoading: updateDieticianDietTemplateIsLoading, data: updateDieticianDietTemplateResponse, error: updateDieticianDietTemplateError }] = useUpdateDieticianDietTemplateMutation();

    const [readDieticianDietTemplate, {
        data: readDieticianDietTemplateData,
        isLoading: readDieticianDietTemplateLoading,
        isFetching: readDieticianDietTemplateFetching
    }] = useLazyReadDieticianDietTemplateQuery();

    const [initialValues, setInitialValues] = useState<CreateDieticianDietTemplateBodyModel | null>(null);

    const handleSubmit = (values: CreateDieticianDietTemplateBodyModel) => {
        if (values.diet_template_id != null) {
            updateDieticianDietTemplate(values);
        } else {
            createDieticianDietTemplate(values);
        }
    };

    const handleClose = () => {
        dispatch(closeModal())
        setInitialValues(null);
    };

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newDietTemplate) {
            getmealTime();
            if (id != null) {
                readDieticianDietTemplate({ diet_template_id: id, dietitian_id: "user?.id" })
            }
        }
    }, [open, id])

    useEffect(() => {
        if (readDieticianDietTemplateData?.data != null) {
            const model: CreateDieticianDietTemplateBodyModel = {
                person_id: user ? user?.id : undefined,
                diet_template_id: readDieticianDietTemplateData?.data?.diet_template_id,
                code: readDieticianDietTemplateData?.data?.code,
                name: readDieticianDietTemplateData?.data?.name,
                description: readDieticianDietTemplateData?.data?.description,
                detail: readDieticianDietTemplateData.data?.detail,
                status: readDieticianDietTemplateData.data?.status
            }
            setInitialValues(model);
        }
    }, [readDieticianDietTemplateData])


    useEffect(() => {
        if (createDieticianDietTemplateResponse) {
            enqueueSnackbar(createDieticianDietTemplateResponse.message, {
                variant: createDieticianDietTemplateResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createDieticianDietTemplateResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (createDieticianDietTemplateError) {
            var error = createDieticianDietTemplateError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createDieticianDietTemplateResponse, createDieticianDietTemplateError])

    useEffect(() => {
        if (updateDieticianDietTemplateResponse) {
            enqueueSnackbar(updateDieticianDietTemplateResponse.message, {
                variant: updateDieticianDietTemplateResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateDieticianDietTemplateResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (updateDieticianDietTemplateError) {
            var error = updateDieticianDietTemplateError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateDieticianDietTemplateResponse, updateDieticianDietTemplateError])

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
                    modalType: ModalEnum.newDietTemplate
                }))
            }}>{intl.formatMessage({ id: "new" })}</Button>
            <Dialog open={open && modalType == ModalEnum.newDietTemplate} onClose={handleClose} fullScreen>
                {readDieticianDietTemplateLoading || readDieticianDietTemplateFetching ? <PuffLoader /> : <Formik
                    initialValues={initialValues ?? {
                        diet_template_id: undefined,
                        person_id: user ? user?.id : undefined,
                        code: '',
                        name: '',
                        description: '',
                        detail: [
                            {
                                day: 1,
                                detail: [
                                    {
                                        meal_time_id: '',
                                        name: '',
                                        calorie: '',
                                        note: '',
                                        status: true,
                                    },
                                ],
                            },
                            {
                                day: 2,
                                detail: [
                                    {
                                        meal_time_id: '',
                                        name: '',
                                        calorie: '',
                                        note: '',
                                        status: true,
                                    },
                                ],
                            },
                            {
                                day: 3,
                                detail: [
                                    {
                                        meal_time_id: '',
                                        name: '',
                                        calorie: '',
                                        note: '',
                                        status: true,
                                    },
                                ],
                            },
                            {
                                day: 4,
                                detail: [
                                    {
                                        meal_time_id: '',
                                        name: '',
                                        calorie: '',
                                        note: '',
                                        status: true,
                                    },
                                ],
                            },
                            {
                                day: 5,
                                detail: [
                                    {
                                        meal_time_id: '',
                                        name: '',
                                        calorie: '',
                                        note: '',
                                        status: true,
                                    },
                                ],
                            },
                            {
                                day: 6,
                                detail: [
                                    {
                                        meal_time_id: '',
                                        name: '',
                                        calorie: '',
                                        note: '',
                                        status: true,
                                    },
                                ],
                            },
                            {
                                day: 7,
                                detail: [
                                    {
                                        meal_time_id: '',
                                        name: '',
                                        calorie: '',
                                        note: '',
                                        status: true,
                                    },
                                ],
                            },
                        ],
                        status: true,
                    }}
                    validationSchema={newDietTemplateValidationSchema}
                    enableReinitialize
                    validateOnChange={false}
                    validateOnMount={false}
                    validateOnBlur={false}
                    onSubmit={handleSubmit}>
                    {({ values, errors, touched, handleBlur, handleChange, setFieldValue }) => (
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
                                        <Typography variant="h4">{intl.formatMessage({ id: id != null ? "updateDietTemplate" : "newDietTemplate" })}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={36} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} sx={{ marginBottom: 3 }}>
                                    <Grid item xs={12} md={4}>
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
                                    <Grid item xs={12} md={4}>
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
                                    <Grid item xs={12} md={4}>
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
                                </Grid>
                                <FieldArray name="detail">
                                    {({ push, remove, form }) => (
                                        <div>
                                            {values.detail.map((dayDetail, dayIndex) => (
                                                <MainCard sx={{ marginBottom: "40px" }} content={false} key={dayIndex} title={dayName(dayDetail.day)} button={(dayDetail.detail == null || dayDetail.detail.length == 0) && <Button onClick={() => {
                                                    setFieldValue(`detail.${dayIndex}.detail`, [{ meal_time_id: '', name: '', calorie: '', note: '', status: true }]);
                                                }}>{"Yeni Ekle"}</Button>}>
                                                    <div key={dayIndex}>
                                                        <FieldArray name={`detail.${dayIndex}.detail`}>
                                                            {({ push: pushMeal, remove: removeMeal }) => (
                                                                <div className="table-responsive">
                                                                    <table className="table table-bordered mb-0 table-centered">
                                                                        <thead>
                                                                            <tr>
                                                                                <th></th>
                                                                                <th>Öğün</th>
                                                                                <th>Adı</th>
                                                                                <th>Kalori</th>
                                                                                <th>Açıklama</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {dayDetail.detail?.map((meal, mealIndex) => (
                                                                                <tr key={mealIndex} style={{ marginBottom: 2 }}>
                                                                                    <td className="table-mobil">
                                                                                        <Stack direction="row" justifyContent={"center"} spacing={1}>
                                                                                        <Button sx={{ minWidth: 40 }} type='button' variant="outlined" onClick={() => pushMeal({ meal_time_id: '', name: '', calorie: '', note: '', status: true })}>{"+"}</Button>
                                                                                        <Button sx={{ minWidth: 40 }} type='button' variant="outlined" color="error" onClick={() => removeMeal(mealIndex)}>{"-"}</Button>
                                                                                        </Stack>
                                                                                    </td>
                                                                                    <td><div className="mb-2">
                                                                                        <div className='mt-2 form-select-mobil'>
                                                                                            <CustomFormikSelect
                                                                                                name={`detail.${dayIndex}.detail.${mealIndex}.meal_time_id`}
                                                                                                placeholder="Öğün Seçin"
                                                                                                isClearable={true}
                                                                                                menuPosition={"fixed"}
                                                                                                isLoading={ismealTimeLoading}
                                                                                                zIndex={9999 - mealIndex}
                                                                                                //size='sm'
                                                                                                value={
                                                                                                    meal.meal_time_id ? { label: getmealTimeData?.data?.find((item) => item.value == meal.meal_time_id)?.label ?? "", value: getmealTimeData?.data?.find((item) => item.value == meal.meal_time_id)?.value ?? 0 } : null}
                                                                                                onChange={(val: any, actionMeta) => {
                                                                                                    setFieldValue(`detail.${dayIndex}.detail.${mealIndex}.meal_time_id`, val?.value ?? "");
                                                                                                }}

                                                                                                options={getmealTimeData?.data?.map((item) => ({
                                                                                                    value: item.value,
                                                                                                    label: item.label
                                                                                                }))}
                                                                                            />
                                                                                        </div>
                                                                                    </div></td>
                                                                                    <td>
                                                                                        <OutlinedInput
                                                                                            fullWidth
                                                                                            error={touched.detail?.[dayIndex]?.detail?.[mealIndex]?.name && (errors.detail as any)?.[dayIndex]?.detail?.[mealIndex]?.name}
                                                                                            id={`detail.${dayIndex}.detail.${mealIndex}.name`}
                                                                                            type="text"
                                                                                            value={meal.name}
                                                                                            name={`detail.${dayIndex}.detail.${mealIndex}.name`}
                                                                                            onBlur={handleBlur}
                                                                                            onChange={handleChange}
                                                                                            placeholder={intl.formatMessage({ id: "name" })}
                                                                                            className="form-control-mobil"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <OutlinedInput
                                                                                            fullWidth
                                                                                            error={touched.detail?.[dayIndex]?.detail?.[mealIndex]?.calorie && (errors.detail as any)?.[dayIndex]?.detail?.[mealIndex]?.calorie}
                                                                                            id={`detail.${dayIndex}.detail.${mealIndex}.calorie`}
                                                                                            type="text"
                                                                                            value={meal.calorie}
                                                                                            name={`detail.${dayIndex}.detail.${mealIndex}.calorie`}
                                                                                            onBlur={handleBlur}
                                                                                            onChange={handleChange}
                                                                                            placeholder={intl.formatMessage({ id: "calorie" })}
                                                                                            className="form-control-mobil"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <OutlinedInput
                                                                                            fullWidth
                                                                                            error={touched.detail?.[dayIndex]?.detail?.[mealIndex]?.note && (errors.detail as any)?.[dayIndex]?.detail?.[mealIndex]?.note}
                                                                                            id={`detail.${dayIndex}.detail.${mealIndex}.note`}
                                                                                            type="text"
                                                                                            value={meal.note}
                                                                                            name={`detail.${dayIndex}.detail.${mealIndex}.note`}
                                                                                            onBlur={handleBlur}
                                                                                            onChange={handleChange}
                                                                                            placeholder={intl.formatMessage({ id: "note" })}
                                                                                            className="form-control-mobil"
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                        </FieldArray>
                                                    </div>
                                                </MainCard>
                                            ))}
                                        </div>
                                    )}
                                </FieldArray>
                                <Grid item xs={12}>
                                    <FormControlLabel control={<Switch
                                        checked={values.status}
                                        value={values.status} onChange={(e, checked) => {
                                            setFieldValue("status", checked);
                                        }} />} label={intl.formatMessage({ id: values.status ? "active" : "passive" })} />
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation disabled={createDieticianDietTemplateIsLoading || updateDieticianDietTemplateIsLoading} type="submit" variant="contained" color="primary">
                                            {(createDieticianDietTemplateIsLoading || updateDieticianDietTemplateIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createDieticianDietTemplateIsLoading == false || updateDieticianDietTemplateIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default AddDietTemplateListModal