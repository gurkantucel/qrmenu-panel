"use client"

import { Box, Button, Dialog, DialogActions, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material"
import { Add, CloseSquare, Minus } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum, setModal } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Form, Formik } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { useCreateStockMutation } from "reduxt/features/stock/stock-api";
import { PuffLoader } from "react-spinners";
import { useEffect, useState } from "react";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import IconButton from "components/@extended/IconButton";
import { newStockValidationSchema } from "utils/schemas/stock-validation-schema";
import { enqueueSnackbar } from "notistack";
import { StockCreateBodyModel } from "reduxt/features/stock/models/stock-list-model";
import dayjs from "dayjs";
import { useGetAppointmentProcessDropdownQuery } from "reduxt/features/settings/appointment-process-api";

const AddStockModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<StockCreateBodyModel>();

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    //const [getStockList] = useLazyGetStockListQuery();

    const { data: getAppointmentProcessDropdownData, isLoading: getAppointmentProcessDropdownLoading } = useGetAppointmentProcessDropdownQuery({}, { skip: open == false && modalType != ModalEnum.newStock });

    const [createStock, { isLoading: createStockIsLoading, data: createStockResponse, error: createStockError }] = useCreateStockMutation();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newStock) {
            if (data != null) {
                const model: StockCreateBodyModel = {
                    appointment_process_id: "",
                    quantity: "1",
                    process_date: dayjs(new Date()).format("YYYY-MM-DD"),
                    movement_type: data.movement_type,
                    description: null,
                    status: true,
                }
                setInitialData(model);
            }
        }
    }, [open, data])

    useEffect(() => {
        if (createStockResponse) {
            enqueueSnackbar(createStockResponse.message, {
                variant: createStockResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createStockResponse?.status == true) {
                handleClose();
                //getStockList({});
            }
        }
        if (createStockError) {
            var error = createStockError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createStockResponse, createStockError])

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
                    modalType: ModalEnum.newStock,
                    data: { movement_type: true }
                }))
            }}>{"Stok Artır"}</Button>
            <Button variant="dashed" color="error" startIcon={<Minus />} onClick={() => {
                dispatch(setModal({
                    open: true,
                    modalType: ModalEnum.newStock,
                    data: { movement_type: false }
                }))
            }}>{"Stok Azalt"}</Button>
            <Dialog open={open && modalType == ModalEnum.newStock} onClose={handleClose}>
                <Formik
                    initialValues={initialData ?? {
                        appointment_process_id: "",
                        quantity: "1",
                        process_date: dayjs(new Date()).format("YYYY-MM-DD"),
                        movement_type: false,
                        description: null,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newStockValidationSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        values.quantity = values.quantity?.toString()?.replace(",", ".") ?? null;
                        values.process_date = dayjs(values.process_date).format("YYYY-MM-DD HH:mm:ss");
                        createStock(values);
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
                                    marginBottom={"1.4rem"}
                                    sx={{ borderBottom: '1px solid {theme.palette.divider}' }}
                                >
                                    <Grid item>
                                        <Typography variant="h4">{data?.movement_type == true ? intl.formatMessage({ id: "increaseStock" }) : intl.formatMessage({ id: "decreaseStock" })}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={48} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="company-signup">{`${intl.formatMessage({ id: "appointmentProcess" })}*`}</InputLabel>
                                            <CustomFormikSelect
                                                name='appointment_process_id'
                                                placeholder="Seçim yapınız..."
                                                isLoading={getAppointmentProcessDropdownLoading}
                                                zIndex={9999}
                                                options={getAppointmentProcessDropdownData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                                value={
                                                    values.appointment_process_id ? { label: getAppointmentProcessDropdownData?.data?.find((item) => item.value == values.appointment_process_id)?.label ?? "", value: getAppointmentProcessDropdownData?.data?.find((item) => item.value == values.appointment_process_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("appointment_process_id", val?.value ?? 0);
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="quantity">
                                                {`${intl.formatMessage({ id: "quantity" })}*`}</InputLabel>
                                            <OutlinedInput
                                                id="quantity"
                                                type="number"
                                                value={values.quantity}
                                                name={`quantity`}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "quantity" })}
                                                fullWidth
                                                error={Boolean(touched.quantity && errors.quantity)}
                                                inputProps={{ min: 0, step: "1" }}
                                            />
                                        </Stack>
                                        {touched.quantity && errors.quantity && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {`${errors.quantity}`}
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
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="date">{`${intl.formatMessage({ id: "date" })}*`}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.process_date && errors.process_date)}
                                                id="process_date"
                                                type="date"
                                                value={values.process_date}
                                                name="process_date"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "date" })}
                                            />
                                        </Stack>
                                        {touched.process_date && errors.process_date && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.process_date}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting || createStockIsLoading} type="submit" variant="contained" color="primary">
                                            {(createStockIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createStockIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default AddStockModal