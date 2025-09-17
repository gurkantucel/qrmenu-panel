"use client"

import { Box, Button, Dialog, DialogActions, FormControlLabel, Grid, InputLabel, OutlinedInput, Stack, Switch, Typography } from "@mui/material"
import { CloseSquare } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { useEffect } from "react";
import IconButton from "components/@extended/IconButton";
import { useGetMealTimeDropdownQuery } from "reduxt/features/definition/definition-api";
import { useLazyReadDieticianDietTemplateQuery } from "reduxt/features/settings/diet-template-api";
import MainCard from "components/MainCard";
import CustomScaleLoader from "components/CustomScaleLoader";
import Select from 'react-select'

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

const ViewDietTemplateListModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id, title } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const { data: getmealTimeData, isLoading: ismealTimeLoading } = useGetMealTimeDropdownQuery(undefined, { skip: modalType != ModalEnum.viewDietTemplate })

    const [readDieticianDietTemplate, {
        data: readDieticianDietTemplateData,
        isLoading: readDieticianDietTemplateLoading,
        isFetching: readDieticianDietTemplateFetching
    }] = useLazyReadDieticianDietTemplateQuery();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (open == true && modalType == ModalEnum.viewDietTemplate) {
            //getmealTime();
            if (id != null) {
                readDieticianDietTemplate({ diet_template_id: id })
            }
        }
    }, [open, id])

    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.viewDietTemplate} onClose={handleClose} fullScreen>
                {readDieticianDietTemplateLoading || readDieticianDietTemplateFetching ? <CustomScaleLoader /> : readDieticianDietTemplateData?.data != null ?
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
                                        value={readDieticianDietTemplateData?.data?.name}
                                        name="name"
                                        disabled
                                        placeholder={intl.formatMessage({ id: "name" })}
                                        fullWidth
                                        inputProps={{ maxLength: 50 }}
                                        sx={{
                                            '& .MuiOutlinedInput-input.Mui-disabled': {
                                                WebkitTextFillColor: '#333',
                                                color: '#333',
                                            }
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="lastname-signup">{`${intl.formatMessage({ id: "code" })}*`}</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        id="code"
                                        type="text"
                                        value={readDieticianDietTemplateData?.data?.code}
                                        name="code"
                                        disabled
                                        placeholder={intl.formatMessage({ id: "uniqueIdExample2" })}
                                        inputProps={{ maxLength: 10 }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="description">{intl.formatMessage({ id: "description" })}</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        id="description"
                                        type="text"
                                        value={readDieticianDietTemplateData?.data?.description}
                                        name="description"
                                        disabled
                                        placeholder={intl.formatMessage({ id: "description" })}
                                        inputProps={{ maxLength: 500 }}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                        <div>
                            {readDieticianDietTemplateData?.data?.detail.map((dayDetail, dayIndex) => (
                                <MainCard sx={{ marginBottom: "40px" }} content={false} key={dayIndex} title={dayName(dayDetail.day)} button={(dayDetail.detail == null || dayDetail.detail.length == 0) && <Button onClick={() => {
                                }}>{"Yeni Ekle"}</Button>}>
                                    <div key={dayIndex}>
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
                                                            <td><div className="mb-2">
                                                                <div className='mt-2 form-select-mobil'>
                                                                    <Select
                                                                        name={`detail.${dayIndex}.detail.${mealIndex}.meal_time_id`}
                                                                        placeholder="Öğün Seçin"
                                                                        isClearable={true}
                                                                        menuPosition={"fixed"}
                                                                        isLoading={ismealTimeLoading}
                                                                        menuPortalTarget={document.body}
                                                                        isDisabled
                                                                        //size='sm'
                                                                        styles={{
                                                                            menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                                            container: (baseStyles: any) => ({
                                                                                ...baseStyles,
                                                                                zIndex: 998
                                                                            }),
                                                                            control: (baseStyles, state) => ({
                                                                                ...baseStyles,
                                                                                borderColor: '#BEC8D0',
                                                                                borderRadius: '8px',
                                                                                boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(67, 142, 255, 0.25)' : 'var(--tb-border-color)',
                                                                                color: '#1d2630',
                                                                                minHeight: '48px',
                                                                                paddingLeft: '5px',
                                                                            }),
                                                                            placeholder: (baseStyles, state) => ({
                                                                                ...baseStyles,
                                                                                color: '#aeaeae',
                                                                            }),
                                                                        }}
                                                                        value={
                                                                            meal.meal_time_id ? { label: getmealTimeData?.data?.find((item) => item.value == meal.meal_time_id)?.label ?? "", value: getmealTimeData?.data?.find((item) => item.value == meal.meal_time_id)?.value ?? 0 } : null}
                                                                        onChange={(val: any, actionMeta) => {
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
                                                                    id={`detail.${dayIndex}.detail.${mealIndex}.name`}
                                                                    type="text"
                                                                    value={meal.name}
                                                                    name={`detail.${dayIndex}.detail.${mealIndex}.name`}
                                                                    disabled
                                                                    placeholder={intl.formatMessage({ id: "name" })}
                                                                    className="form-control-mobil"
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
                                                                    id={`detail.${dayIndex}.detail.${mealIndex}.calorie`}
                                                                    type="text"
                                                                    value={meal.calorie}
                                                                    name={`detail.${dayIndex}.detail.${mealIndex}.calorie`}
                                                                    disabled
                                                                    placeholder={intl.formatMessage({ id: "calorie" })}
                                                                    className="form-control-mobil"
                                                                />
                                                            </td>
                                                            <td>
                                                                <OutlinedInput
                                                                    fullWidth
                                                                    id={`detail.${dayIndex}.detail.${mealIndex}.note`}
                                                                    type="text"
                                                                    value={meal.note}
                                                                    name={`detail.${dayIndex}.detail.${mealIndex}.note`}
                                                                    disabled
                                                                    placeholder={intl.formatMessage({ id: "note" })}
                                                                    className="form-control-mobil"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </MainCard>
                            ))}
                        </div>
                        <Grid item xs={12}>
                            <FormControlLabel control={<Switch
                                checked={readDieticianDietTemplateData?.data?.status}
                                disabled
                                value={readDieticianDietTemplateData?.data?.status}
                                onChange={(e, checked) => {
                                }} />} label={intl.formatMessage({ id: readDieticianDietTemplateData?.data?.status ? "active" : "passive" })} />
                        </Grid>
                        <DialogActions sx={{ marginTop: 5 }}>
                            <Button color="info" onClick={handleClose}>
                                {intl.formatMessage({ id: "close" })}
                            </Button>
                        </DialogActions>
                    </Box> : <></>}
            </Dialog>
        </>
    )
}

export default ViewDietTemplateListModal