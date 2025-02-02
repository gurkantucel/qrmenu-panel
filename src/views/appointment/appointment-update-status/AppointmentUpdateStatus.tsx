import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { Printer, TickSquare } from "iconsax-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect } from 'react'
import { useIntl } from "react-intl"
import { PuffLoader } from "react-spinners";
import { useAppointmentUpdateStatusMutation } from "reduxt/features/appointment/appointment-api";
import { useLazyPrintAppointmentQuery } from "reduxt/features/appointment/appointment-process-type-api";
import { AppointmentReadResultModel } from "reduxt/features/appointment/models/appointment-list-model";
import { closeModal, ModalEnum, setModal } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const AppointmentUpdateStatus = () => {
    const dispatch = useAppDispatch();
    const router = useRouter()

    const { data: { open, modalType } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const params = useParams<{ slug: string }>()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patient')

    const appointmentApi: AppointmentReadResultModel | undefined | any = useAppSelector((state) => state.appointmentApi.queries[`readAppointment({\"appointment_id\":\"${params.slug}\",\"patient_id\":\"${patientId}\"})`]?.data);

    const [updateAppointmentStatus, { isLoading: updateAppointmentStatusIsLoading, data: updateAppointmentStatusResponse, error: updateAppointmentStatusError }] = useAppointmentUpdateStatusMutation();

    const [printAppointment, {
        isFetching: printAppointmentFetching,
        isLoading: printAppointmentLoading
    }] = useLazyPrintAppointmentQuery();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (updateAppointmentStatusResponse) {
            enqueueSnackbar(updateAppointmentStatusResponse.message, {
                variant: updateAppointmentStatusResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateAppointmentStatusResponse?.status == true) {
                handleClose();
                router.push("/app/appointment")
            }
        }
        if (updateAppointmentStatusError) {
            var error = updateAppointmentStatusError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateAppointmentStatusResponse, updateAppointmentStatusError])

    return (
        <>
            <Grid container direction={"row"} justifyContent={"end"} marginBottom={2}>
                <Button variant="dashed"
                    disabled={printAppointmentLoading || printAppointmentFetching}
                    color='secondary' startIcon={<Printer />} sx={{ marginRight: 1 }} onClick={async () => {
                        await printAppointment({ appointment_id: params.slug })
                    }}>{printAppointmentLoading || printAppointmentFetching ? <PuffLoader size={20} color='white' /> : intl.formatMessage({ id: "print" })}</Button>
                {appointmentApi?.data?.appointment_status_id == 2 ? <Button variant="contained" color="secondary" startIcon={<TickSquare />}>{intl.formatMessage({ id: "appointmentCompleted" })}</Button>
                    : <Button variant="shadow" color="success" onClick={() => {
                        dispatch(setModal({
                            open: true,
                            modalType: ModalEnum.updateAppointmentStatus,
                        }))
                    }}>{intl.formatMessage({ id: "completeAppointment" })}</Button>}
            </Grid>
            <Dialog open={open && modalType == ModalEnum.updateAppointmentStatus} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ p: 1, py: 1.5 }}>
                    <DialogTitle id="alert-dialog-title">{intl.formatMessage({ id: "completeAppointment" })}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {intl.formatMessage({ id: "completeAppointmentText" })}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="info" onClick={handleClose}>
                            {intl.formatMessage({ id: "no" })}
                        </Button>
                        <CustomLoadingButton title={intl.formatMessage({ id: "yes" })}
                            disabled={updateAppointmentStatusIsLoading}
                            onClick={() => {
                                updateAppointmentStatus({
                                    appointment_id: params.slug,
                                    patient_id: patientId,
                                    appointment_status_id: 2,
                                    status: true
                                })
                            }} autoFocus={true} isLoading={updateAppointmentStatusIsLoading} />
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    )
}

export default AppointmentUpdateStatus