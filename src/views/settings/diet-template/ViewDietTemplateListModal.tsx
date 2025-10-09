"use client"

import { Box, Button, Dialog, DialogActions, FormControlLabel, Grid, Stack, Switch, Typography } from "@mui/material"
import { CloseSquare } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { useEffect } from "react";
import IconButton from "components/@extended/IconButton";
import { useGetMealTimeDropdownQuery } from "reduxt/features/definition/definition-api";
import { useLazyReadDieticianDietTemplateQuery } from "reduxt/features/settings/diet-template-api";
import CustomScaleLoader from "components/CustomScaleLoader";

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

    const { data: getmealTimeData } = useGetMealTimeDropdownQuery(undefined, { skip: modalType != ModalEnum.viewDietTemplate })

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
            <Dialog open={open && modalType == ModalEnum.viewDietTemplate} onClose={handleClose} maxWidth="xl">
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
                        <Grid container sx={{ marginLeft: 0.5, marginBottom: 3 }}>
                            <Typography>{`Açıklama: ${readDieticianDietTemplateData?.data?.description}`}</Typography>
                        </Grid>
                        <div>
                            {readDieticianDietTemplateData?.data?.detail.map((dayDetail, dayIndex) => (
                                <Stack key={dayIndex} sx={{ marginBottom: "40px" }}>
                                    <div key={dayIndex}>
                                        <div className="table-responsive">
                                            <Typography variant="subtitle1" sx={{marginBottom: 2}}>{dayName(dayDetail.day)}</Typography>
                                            <table className="table table-bordered mb-0">
                                                <colgroup>
                                                    <col style={{ width: "20%" }} />
                                                    <col style={{ width: "40%" }} />
                                                    <col style={{ width: "10%" }} />
                                                    <col style={{ width: "30%" }} />
                                                </colgroup>
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
                                                                    <Typography>{getmealTimeData?.data?.find((item) => item.value == meal.meal_time_id)?.label ?? ""}</Typography>
                                                                </div>
                                                            </div></td>
                                                            <td>
                                                                <Typography>{meal.name ?? ""}</Typography>
                                                            </td>
                                                            <td>
                                                                <Typography>{meal.calorie ?? ""}</Typography>
                                                            </td>
                                                            <td>
                                                                <Typography>{meal.note ?? ""}</Typography>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Stack>
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