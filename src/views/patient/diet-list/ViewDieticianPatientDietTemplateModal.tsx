"use client"

import { Box, Button, Dialog, DialogActions, FormControlLabel, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Switch, Typography } from "@mui/material"
import { CloseSquare } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { FieldArray, Form, Formik } from 'formik';
import { useCallback, useEffect, useState } from "react";
import IconButton from "components/@extended/IconButton";
import { useGetMealTimeDropdownQuery } from "reduxt/features/definition/definition-api";
import { newDieticianPatientDietTemplateValidationSchema } from "utils/schemas/diet-template-validation-schema";
import MainCard from "components/MainCard";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import useUser from "hooks/useUser";
import CustomScaleLoader from "components/CustomScaleLoader";
import { CreateDieticianPatientDietTemplateBodyModel, DieticianPatientDietTemplateDetail, DieticianPatientDietTemplateDetail2, DieticianPatientDietTemplateReadDetail } from "reduxt/features/patient/models/dietician-patient-diet-template-list-model";
import { useLazyReadDieticianPatientDietTemplateQuery } from "reduxt/features/patient/dietician-patient-diet-template-api";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { dayCalculator } from "utils/day-calculator";

function transformDietData(readData: DieticianPatientDietTemplateReadDetail[]): DieticianPatientDietTemplateDetail[] {
    const transformedData: DieticianPatientDietTemplateDetail[] = [];
    const groupedByDay: { [day: number]: DieticianPatientDietTemplateDetail2[] } = {};

    // Read servisinden gelen veriyi günlere göre gruplandır
    readData?.forEach(item => {
        if (!groupedByDay[item.day]) {
            groupedByDay[item.day] = [];
        }
        groupedByDay[item.day].push({
            patient_diet_template_detail_id: item.patient_diet_template_detail_id,
            meal_time_id: item.meal_time_id,
            name: item.name,
            calorie: item.calorie,
            note: item.note,
            status: true
        });
    });

    // Gruplandırılmış veriyi istenen formata dönüştür
    for (const day in groupedByDay) {
        transformedData.push({
            day: parseInt(day, 10),
            detail: groupedByDay[parseInt(day, 10)]
        });
    }

    return transformedData;
}

const ViewDieticianPatientDietTemplateModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id, data, title } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()
    const user = useUser();

    const params = useParams<{ slug: string }>()

    const [initialValues, setInitialValues] = useState<CreateDieticianPatientDietTemplateBodyModel>();

    const { data: getmealTimeData, isLoading: ismealTimeLoading } = useGetMealTimeDropdownQuery(undefined, { skip: modalType != ModalEnum.viewDieticianPatientDietTemplate })

    const [readDieticianPatientDietTemplate, {
        data: readDieticianPatientDietTemplateData,
        isLoading: readDieticianPatientDietTemplateLoading,
        isFetching: readDieticianPatientDietTemplateFetching
    }] = useLazyReadDieticianPatientDietTemplateQuery();


    useEffect(() => {
        if (open == true && modalType == ModalEnum.viewDieticianPatientDietTemplate && data != null) {
            readDieticianPatientDietTemplate({ patient_diet_template_id: data?.patient_diet_template_id, patient_id: data?.patient_id});
        }
    }, [open, id, data])

    useEffect(() => {
        if (open == true && modalType == ModalEnum.viewDieticianPatientDietTemplate && data != null && readDieticianPatientDietTemplateData?.data != null) {
            const model: CreateDieticianPatientDietTemplateBodyModel = {
                patient_diet_template_id: data?.patient_diet_template_id,
                diet_template_id: data?.diet_template_id,
                patient_id: data?.patient_id,
                start_date: data?.start_date,
                end_date: data?.end_date,
                detail: transformDietData(readDieticianPatientDietTemplateData.data?.detail),
                status: data?.status
            }
            setInitialValues(model)
        }
    }, [open, data, readDieticianPatientDietTemplateData])

    const toggle = useCallback(() => {
        dispatch(closeModal())
        setInitialValues(undefined);
    }, [open])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.viewDieticianPatientDietTemplate} onClose={toggle} fullScreen>
                {readDieticianPatientDietTemplateLoading || readDieticianPatientDietTemplateFetching ? <CustomScaleLoader /> : <Formik
                    initialValues={initialValues ?? {
                        diet_template_id: "",
                        person_id: user ? user?.id : "",
                        patient_id: params.slug,
                        start_date: null,
                        end_date: null,
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
                        status: true
                    }}
                    validationSchema={newDieticianPatientDietTemplateValidationSchema}
                    enableReinitialize
                    onSubmit={(values) => {
                    }}>
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
                                        <Typography variant="h4">{title}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={toggle}>
                                            <CloseSquare size={36} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} sx={{ marginBottom: 3 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="start_date">{intl.formatMessage({ id: "startDate" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.start_date && errors.start_date)}
                                                id="start_date"
                                                type="date"
                                                value={dayjs(values.start_date).format('YYYY-MM-DD')}
                                                name="start_date"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled
                                                placeholder={intl.formatMessage({ id: "startDate" })}
                                            //inputProps={{ max: dayjs().format('YYYY-MM-DD') }}
                                            />
                                        </Stack>
                                        {touched.start_date && errors.start_date && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.start_date}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="end_date">{intl.formatMessage({ id: "endDate" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.end_date && errors.end_date)}
                                                id="end_date"
                                                type="date"
                                                value={dayjs(values.end_date).format('YYYY-MM-DD')}
                                                name="end_date"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled
                                                placeholder={intl.formatMessage({ id: "endDate" })}
                                            //inputProps={{ max: dayjs().format('YYYY-MM-DD') }}
                                            />
                                        </Stack>
                                        {touched.end_date && errors.end_date && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.end_date}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                </Grid>
                                {<FieldArray name="detail">
                                    {({ push, remove, form }) => (
                                        <div>
                                            {values.detail.map((dayDetail, dayIndex) => (
                                                <MainCard sx={{ marginBottom: "40px" }} content={false} key={dayIndex} title={dayCalculator(dayDetail.day)} button={(dayDetail.detail == null || dayDetail.detail.length == 0) && <Button onClick={() => {
                                                    setFieldValue(`detail.${dayIndex}.detail`, [{ meal_time_id: '', name: '', calorie: '', note: '', status: true }]);
                                                }}>{"Yeni Ekle"}</Button>}>
                                                    <div key={dayIndex}>
                                                        <FieldArray name={`detail.${dayIndex}.detail`}>
                                                            {({ push: pushMeal, remove: removeMeal }) => (
                                                                <div className="table-responsive">
                                                                    <table className="table table-bordered mb-0 table-centered">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Öğün</th>
                                                                                <th>Adı</th>
                                                                                <th>Kalori</th>
                                                                                <th>Açıklama</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {dayDetail.detail?.map((meal, mealIndex) => (
                                                                                <tr key={mealIndex} style={{ marginBottom: 2 }}>
                                                                                    <td style={{ width: "250px" }}>
                                                                                        <div className="mb-2">
                                                                                            <div className='mt-2 form-select-mobil'>
                                                                                                <CustomFormikSelect
                                                                                                    name={`detail.${dayIndex}.detail.${mealIndex}.meal_time_id`}
                                                                                                    placeholder="Öğün Seçin"
                                                                                                    isClearable={true}
                                                                                                    menuPosition={"fixed"}
                                                                                                    isLoading={ismealTimeLoading}
                                                                                                    zIndex={9999 - mealIndex}
                                                                                                    menuPortalTarget={document.body}
                                                                                                    //size='sm'
                                                                                                    isDisabled
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
                                                                                            error={(touched.detail as any)?.[dayIndex]?.detail?.[mealIndex]?.name && (errors.detail as any)?.[dayIndex]?.detail?.[mealIndex]?.name}
                                                                                            id={`detail.${dayIndex}.detail.${mealIndex}.name`}
                                                                                            type="text"
                                                                                            value={meal.name}
                                                                                            name={`detail.${dayIndex}.detail.${mealIndex}.name`}
                                                                                            onBlur={handleBlur}
                                                                                            onChange={handleChange}
                                                                                            placeholder={intl.formatMessage({ id: "name" })}
                                                                                            className="form-control-mobil"
                                                                                            disabled
                                                                                            sx={{
                                                                                                '& .MuiOutlinedInput-input.Mui-disabled': {
                                                                                                    WebkitTextFillColor: '#333',
                                                                                                    color: '#333',
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <OutlinedInput
                                                                                            fullWidth
                                                                                            error={(touched.detail as any)?.[dayIndex]?.detail?.[mealIndex]?.calorie && (errors.detail as any)?.[dayIndex]?.detail?.[mealIndex]?.calorie}
                                                                                            id={`detail.${dayIndex}.detail.${mealIndex}.calorie`}
                                                                                            type="text"
                                                                                            value={meal.calorie}
                                                                                            name={`detail.${dayIndex}.detail.${mealIndex}.calorie`}
                                                                                            onBlur={handleBlur}
                                                                                            onChange={handleChange}
                                                                                            placeholder={intl.formatMessage({ id: "calorie" })}
                                                                                            className="form-control-mobil"
                                                                                            disabled
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <OutlinedInput
                                                                                            fullWidth
                                                                                            error={(touched.detail as any)?.[dayIndex]?.detail?.[mealIndex]?.note && (errors.detail as any)?.[dayIndex]?.detail?.[mealIndex]?.note}
                                                                                            id={`detail.${dayIndex}.detail.${mealIndex}.note`}
                                                                                            type="text"
                                                                                            value={meal.note}
                                                                                            name={`detail.${dayIndex}.detail.${mealIndex}.note`}
                                                                                            onBlur={handleBlur}
                                                                                            onChange={handleChange}
                                                                                            placeholder={intl.formatMessage({ id: "note" })}
                                                                                            className="form-control-mobil"
                                                                                            disabled
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
                                </FieldArray>}
                                <Grid item xs={12}>
                                    <FormControlLabel control={<Switch
                                        checked={values.status}
                                        disabled
                                        value={values.status} onChange={(e, checked) => {
                                            setFieldValue("status", checked);
                                        }} />} label={intl.formatMessage({ id: values.status ? "active" : "passive" })} />
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={toggle}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                </DialogActions>
                            </Box>
                        </Form>
                    )}
                </Formik>}
            </Dialog>
        </>
    )
}

export default ViewDieticianPatientDietTemplateModal