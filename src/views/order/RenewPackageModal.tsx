import React, { useEffect } from 'react'
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import { CloseSquare } from "iconsax-react"
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { enqueueSnackbar } from 'notistack';
import { PuffLoader } from 'react-spinners';
import AnimateButton from 'components/@extended/AnimateButton';
import { useLocalizedField } from 'hooks/useLocalizedField';
import currency from 'utils/currency';
import CustomScaleLoader from 'components/CustomScaleLoader';
import { useRouter } from 'next/navigation';
import { useCalculatePackageMutation } from 'reduxt/features/package/package-api';
import dayjs from 'dayjs';
import { useCreateOrderMutation } from 'reduxt/features/order/order-api';

const RenewPackageModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);

    const router = useRouter();

    const intl = useIntl()

    const t = useLocalizedField()

    const [calculatePackage, { isLoading: calculatePackageIsLoading, data: calculatePackageResponse, error: calculatePackageError }] = useCalculatePackageMutation();

    const [creatOrder, { isLoading: creatOrderIsLoading, data: creatOrderPackageResponse, error: creatOrderPackageError }] = useCreateOrderMutation();

    useEffect(() => {
        if (open && data && modalType == ModalEnum.renewPackage) {
            calculatePackage({ branchIds: data?.branchIds })
        }
    }, [open, data, modalType])

    useEffect(() => {
        if (creatOrderPackageResponse) {
            enqueueSnackbar(creatOrderPackageResponse.message, {
                variant: creatOrderPackageResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (creatOrderPackageResponse?.success == true && creatOrderPackageResponse.data?.orderId != null) {
                handleClose();
                router.push(`checkout/${creatOrderPackageResponse.data?.orderId}`)
            }
        }
        if (creatOrderPackageError) {
            const error = creatOrderPackageError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [creatOrderPackageResponse, creatOrderPackageError])

    useEffect(() => {
        if (calculatePackageError) {
            dispatch(closeModal())
            const error = calculatePackageError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [calculatePackageError])

    const handleClose = () => {
        dispatch(closeModal())
    };

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.renewPackage} onClose={handleClose} fullWidth maxWidth={"sm"}>
                <Box sx={{ px: 3, py: 3 }}>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                    >
                        <Grid item>
                            <Typography variant="h4">{intl.formatMessage({ id: "renewPackage" })}</Typography>
                        </Grid>
                        <Grid item sx={{ mr: 1.5 }}>
                            <IconButton color="secondary" onClick={handleClose}>
                                <CloseSquare size={36} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    {calculatePackageIsLoading ? <CustomScaleLoader /> : <>
                        {(calculatePackageResponse?.data?.packages?.length ?? 0) > 1 && <Alert severity="info" sx={{ marginTop: 2, marginBottom: 2 }}>
                            <AlertTitle>{`${intl.formatMessage({ id: "endDate" })}: ${dayjs(calculatePackageResponse?.data?.endDate).format("DD.MM.YYYY")}`}</AlertTitle>
                        </Alert>}
                        {(calculatePackageResponse?.data?.packages?.length ?? 0) == 1 && <Alert severity="warning" sx={{ marginTop: 2, marginBottom: 2 }}>
                            <AlertTitle>{`${intl.formatMessage({ id: "endDate" })}: ${dayjs(calculatePackageResponse?.data?.endDate).format("DD.MM.YYYY")}`}</AlertTitle>
                            {intl.formatMessage({ id: "recalculatedMainPackageExpirationDateText" })}
                        </Alert>}
                        <TableContainer>
                            <Table sx={{ minWidth: 'auto' }} size="small" aria-label="simple table">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="subtitle1">{intl.formatMessage({ id: "orderSummary" })}</Typography>
                                        </TableCell>
                                        <TableCell />
                                    </TableRow>
                                    {calculatePackageResponse?.data?.packages?.map((item, index: number) => (<TableRow key={`summary-${index}`}>
                                        <TableCell sx={{ borderBottom: 'none' }}>{`${intl.formatMessage({ id: item.packageType ?? "lang" })} (${item.branchName})`}</TableCell>
                                        <TableCell align="right" sx={{ borderBottom: 'none' }}>
                                            <Typography variant="subtitle1">{currency(item.calculatedPrice)}</Typography>
                                        </TableCell>
                                    </TableRow>))}
                                    <TableRow>
                                        <TableCell sx={{ borderBottom: 'none' }}>{`${intl.formatMessage({ id: "vat" })} (%${calculatePackageResponse?.data?.vat})`}</TableCell>
                                        <TableCell align="right" sx={{ borderBottom: 'none' }}>
                                            <Typography variant="subtitle1">{currency(calculatePackageResponse?.data?.vatAmount ?? 0)}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ borderBottom: 'none' }}>{intl.formatMessage({ id: "total" })}</TableCell>
                                        <TableCell align="right" sx={{ borderBottom: 'none' }}>
                                            <Typography variant="subtitle1"> {currency(calculatePackageResponse?.data?.paidPrice ?? 0)}</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <DialogActions sx={{ marginTop: 5 }}>
                            <Button color="info" onClick={handleClose}>
                                {intl.formatMessage({ id: "close" })}
                            </Button>
                            <AnimateButton>
                                <Button disableElevation
                                    disabled={creatOrderIsLoading}
                                    type="button" variant="contained" color="primary" onClick={() => {
                                        creatOrder({ branchIds: data?.branchIds })
                                    }}>
                                    {(creatOrderIsLoading) && <PuffLoader size={20} color='white' />}
                                    {(creatOrderIsLoading == false) && intl.formatMessage({ id: "makePayment" })}
                                </Button>
                            </AnimateButton>
                        </DialogActions>
                    </>}
                </Box>
            </Dialog >
        </>
    )
}

export default RenewPackageModal