import React, { useEffect } from 'react'
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { Alert, AlertTitle, Box, Button, Dialog, DialogActions, FormHelperText, Grid, IconButton, InputLabel, OutlinedInput, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import { CloseSquare } from "iconsax-react"
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { Form, Formik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import { PuffLoader } from 'react-spinners';
import AnimateButton from 'components/@extended/AnimateButton';
import CustomFormikSelect from 'components/third-party/formik/custom-formik-select';
import { useGetCountryDropdownQuery } from 'reduxt/features/common/common-api';
import { useCreateBranchMutation } from 'reduxt/features/branch/branch-api';
import currency from 'utils/currency';
import CustomScaleLoader from 'components/CustomScaleLoader';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { addBranchValidationSchema } from 'utils/schemas/branch-validation-schema';
import { useGetCalculateBranchPackageQuery } from 'reduxt/features/package/package-api';
import { CalculateBranchPackage } from 'reduxt/features/package/model/package-model';

const CreateBranchModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType } } = useAppSelector((state: RootState) => state.modal);

    const router = useRouter();

    const intl = useIntl()

    const { isLoading: getCountryDropdownLoading, data: getCountryDropdownData } = useGetCountryDropdownQuery(undefined, { skip: modalType != ModalEnum.addBranch })

    const { isLoading: getCalculateBranchPackageLoading, isFetching: getCalculateBranchPackageFetching, data: getCalculateBranchPackageData } = useGetCalculateBranchPackageQuery(undefined, { skip: modalType != ModalEnum.addBranch })

    const [createBranch, { isLoading: createBranchIsLoading, data: createBranchResponse, error: createBranchError }] = useCreateBranchMutation();

    useEffect(() => {
        if (createBranchResponse) {
            enqueueSnackbar(createBranchResponse.message, {
                variant: createBranchResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createBranchResponse?.success == true && createBranchResponse.data?.orderId != null) {
                handleClose();
                router.push(`checkout/${createBranchResponse.data?.orderId}`)
            }
        }
        if (createBranchError) {
            const error = createBranchError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createBranchResponse, createBranchError])

    const handleClose = () => {
        dispatch(closeModal())
    };

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.addBranch} onClose={handleClose} fullWidth maxWidth={"sm"}>
                <Box sx={{ px: 3, py: 3 }}>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                    >
                        <Grid item>
                            <Typography variant="h4">{intl.formatMessage({ id: "addBranch" })}</Typography>
                        </Grid>
                        <Grid item sx={{ mr: 1.5 }}>
                            <IconButton color="secondary" onClick={handleClose}>
                                <CloseSquare size={36} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    {getCalculateBranchPackageLoading || getCalculateBranchPackageFetching ? <CustomScaleLoader /> : <>
                        <Formik initialValues={{
                            "branches": [{
                                "branchName": "",
                                "country": "",
                                "province": "",
                                "district": ""
                            }]
                        }}
                            enableReinitialize
                            validationSchema={addBranchValidationSchema(intl)}
                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                createBranch(values);
                            }}>
                            {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                <Form>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="title">{intl.formatMessage({ id: "name" })}</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(
                                                        touched.branches?.[0]?.branchName &&
                                                        (errors.branches?.[0] as any)?.branchName
                                                    )}
                                                    id={`branches[0].branchName`}
                                                    type="text"
                                                    value={values.branches[0].branchName}
                                                    name={`branches[0].branchName`}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={intl.formatMessage({ id: "name" })}
                                                />
                                            </Stack>
                                            {touched.branches?.[0]?.branchName && (errors.branches?.[0] as any)?.branchName && (
                                                <FormHelperText error id="helper-text-lastname-signup">
                                                    {(errors.branches?.[0] as any)?.branchName}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="title">{intl.formatMessage({ id: "country" })}</InputLabel>
                                                <CustomFormikSelect
                                                    name={`branches[0].country`}
                                                    placeholder={`${intl.formatMessage({id: "selectCountry"})}`}
                                                    isClearable={true}
                                                    isLoading={getCountryDropdownLoading}
                                                    zIndex={998}
                                                    value={getCountryDropdownData?.data?.filter((item) =>
                                                        values.branches[0].country == item.label
                                                    )
                                                        .map((item2) => ({
                                                            value: item2.value,
                                                            label: item2.label,
                                                        }))}
                                                    onChange={(val: any) => {
                                                        setFieldValue(`branches[0].country`, val?.label ?? "0");
                                                    }}

                                                    options={getCountryDropdownData?.data?.map((item) => ({
                                                        value: item.value,
                                                        label: item.label
                                                    }))}
                                                />
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="province">{intl.formatMessage({ id: "province" })}</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(
                                                        touched.branches?.[0]?.province &&
                                                        (errors.branches?.[0] as any)?.province
                                                    )}
                                                    id="province"
                                                    type="text"
                                                    value={values.branches[0].province}
                                                   name={`branches[0].province`}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={intl.formatMessage({ id: "province" })}
                                                />
                                            </Stack>
                                            {touched.branches?.[0]?.province && (errors.branches?.[0] as any)?.province && (
                                                <FormHelperText error id="helper-text-lastname-signup">
                                                    {(errors.branches?.[0] as any)?.province}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="district">{intl.formatMessage({ id: "district" })}</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(
                                                        touched.branches?.[0]?.district &&
                                                        (errors.branches?.[0] as any)?.district
                                                    )}
                                                    id="district"
                                                    type="text"
                                                    value={values.branches[0].district}
                                                    name={`branches[0].district`}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={intl.formatMessage({ id: "district" })}
                                                />
                                            </Stack>
                                            {touched.branches?.[0]?.district && (errors.branches?.[0] as any)?.district && (
                                                <FormHelperText error id="helper-text-lastname-signup">
                                                    {(errors.branches?.[0] as any)?.district}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                    </Grid>
                                    {(getCalculateBranchPackageData?.data?.packages?.length ?? 0) > 1 && <Alert severity="info" sx={{ marginTop: 2, marginBottom: 2 }}>
                                        <AlertTitle>{`${intl.formatMessage({id: "endDate"})}: ${dayjs(getCalculateBranchPackageData?.data?.endDate).format("DD.MM.YYYY")}`}</AlertTitle>
                                        {intl.formatMessage({id: "mainPackageAddedOrderText"})}
                                    </Alert>}
                                    {(getCalculateBranchPackageData?.data?.packages?.length ?? 0) == 1 && <Alert severity="warning" sx={{ marginTop: 2, marginBottom: 2 }}>
                                        <AlertTitle>{`${intl.formatMessage({id: "endDate"})}: ${dayjs(getCalculateBranchPackageData?.data?.endDate).format("DD.MM.YYYY")}`}</AlertTitle>
                                        {intl.formatMessage({id: "recalculatedMainPackageExpirationDateText"})}
                                    </Alert>}
                                    <TableContainer>
                                        <Table sx={{ minWidth: 'auto' }} size="small" aria-label="simple table">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography variant="subtitle1">{intl.formatMessage({id: "orderSummary"})}</Typography>
                                                    </TableCell>
                                                    <TableCell />
                                                </TableRow>
                                                {getCalculateBranchPackageData?.data?.packages?.map((item: CalculateBranchPackage, index: number) => (<TableRow key={`summary-${index}`}>
                                                    <TableCell sx={{ borderBottom: 'none' }}>{intl.formatMessage({id: item.type ?? "lang"})}</TableCell>
                                                    <TableCell align="right" sx={{ borderBottom: 'none' }}>
                                                        <Typography variant="subtitle1">{currency(item.calculatedPrice)}</Typography>
                                                    </TableCell>
                                                </TableRow>))}
                                                <TableRow>
                                                    <TableCell sx={{ borderBottom: 'none' }}>{`${intl.formatMessage({id: "vat"})} (%${getCalculateBranchPackageData?.data?.vat})`}</TableCell>
                                                    <TableCell align="right" sx={{ borderBottom: 'none' }}>
                                                        <Typography variant="subtitle1">{currency(getCalculateBranchPackageData?.data?.vatAmount ?? 0)}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell sx={{ borderBottom: 'none' }}>{intl.formatMessage({id: "total"})}</TableCell>
                                                    <TableCell align="right" sx={{ borderBottom: 'none' }}>
                                                        <Typography variant="subtitle1"> {currency(getCalculateBranchPackageData?.data?.paidPrice ?? 0)}</Typography>
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
                                                disabled={createBranchIsLoading}
                                                type="button" variant="contained" color="primary" onClick={() => { handleSubmit() }}>
                                                {(createBranchIsLoading) && <PuffLoader size={20} color='white' />}
                                                {(createBranchIsLoading == false) && intl.formatMessage({ id: "save" })}
                                            </Button>
                                        </AnimateButton>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </>}
                </Box>
            </Dialog >
        </>
    )
}

export default CreateBranchModal