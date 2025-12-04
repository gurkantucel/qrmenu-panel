import React, { Fragment, useEffect, useState } from 'react'
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { Box, Button, Dialog, DialogActions, Grid, IconButton, InputLabel, Stack, Typography } from "@mui/material"
import { CloseSquare } from "iconsax-react"
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { Field, FieldArray, Form, Formik } from 'formik';
import CustomFormikSelect from 'components/third-party/formik/custom-formik-select';
import { useGetBranchDropdownQuery } from 'reduxt/features/branch/branch-api';
import { useGetCategoryDropdownQuery } from 'reduxt/features/category/category-api';
import { enqueueSnackbar } from 'notistack';
import { PuffLoader } from 'react-spinners';
import AnimateButton from 'components/@extended/AnimateButton';
import CurrencyInput from 'react-currency-input-field';
import { useLocalizedField } from 'hooks/useLocalizedField';
import { useGetCurrencyDropdownQuery } from 'reduxt/features/common/common-api';
import { FoodPriceBranch, UpdateBranchFoodBodyModel } from 'reduxt/features/menu/models/menu-model';
import { useGetBranchFoodListQuery, useUpdateBranchFoodMutation } from 'reduxt/features/menu/menu-api';
import { addFoodValidationSchema } from 'utils/schemas/food-validation-schema';
import CustomScaleLoader from 'components/CustomScaleLoader';

const UpdateFoodPriceModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const t = useLocalizedField()

    const [portions] = useState([
        { "value": "MAIN_PRICE", "label": intl.formatMessage({ id: "mainPrice" }) },
        { "value": "1/2_PRICE", "label": intl.formatMessage({ id: "halfPortion" }) },
        { "value": "1_5_PRICE", "label": intl.formatMessage({ id: "1.5Servings" }) },
        { "value": "DOUBLE_PRICE", "label": intl.formatMessage({ id: "double" }) },
        { "value": "2PERSONS_PRICE", "label": intl.formatMessage({ id: "twoPersons" }) },
        { "value": "3PERSONS_PRICE", "label": intl.formatMessage({ id: "threePersons" }) },
        { "value": "OVERSIZED_PRICE", "label": intl.formatMessage({ id: "oversized" }) },
        { "value": "SMALLSIZE_PRICE", "label": intl.formatMessage({ id: "smallSize" }) },
        { "value": "20CL_PRICE", "label": "20CL" },
        { "value": "35CL_PRICE", "label": "35CL" },
        { "value": "37_5CL_PRICE", "label": "37,5CL" },
        { "value": "50CL_PRICE", "label": "50CL" },
        { "value": "70CL_PRICE", "label": "70CL" },
        { "value": "75CL_PRICE", "label": "75CL" },
        { "value": "100CL_PRICE", "label": "100CL" },
    ])

    const [initialValues, setInitialValues] = useState<UpdateBranchFoodBodyModel>({
        foodId: "",
        branches: [{
            branchFoodId: null,
            branchId: "",
            branchSlug: "",
            categoryId: "",
            prices: [{
                type: "",
                currencyCode: "",
                price: "",
            }]
        }] as FoodPriceBranch[],
    })

    const { isLoading: getBranchDropdownLoading, data: getBranchDropdownData } = useGetBranchDropdownQuery()

    const { isLoading: getBranchFoodListLoading, isFetching: getBranchFoodListFetching, data: getBranchFoodListData } = useGetBranchFoodListQuery({ foodId: `${id}` }, { skip: modalType != ModalEnum.updateFoodPrice || !id })

    const allBranches = getBranchDropdownData?.data ?? [];

    const { isLoading: getCurrencyDropdownLoading, data: getCurrencyDropdownData } = useGetCurrencyDropdownQuery(undefined, { skip: modalType != ModalEnum.updateFoodPrice })

    const [updateBranchFood, { isLoading: updateBranchFoodIsLoading, data: updateBranchFoodResponse, error: updateBranchFoodError }] = useUpdateBranchFoodMutation();

    useEffect(() => {
        if (open && data != null && modalType == ModalEnum.updateFoodPrice) {

            if (getBranchFoodListData?.data != null && getBranchDropdownData?.data != null && getCurrencyDropdownData?.data != null) {
                const newModel: FoodPriceBranch[] = getBranchFoodListData?.data?.map((item) => ({
                    branchFoodId: item.id,
                    branchId: item.branchId,
                    branchSlug: item.branchSlug,
                    categoryId: item.categoryId,
                    prices: item.prices
                }))
                setInitialValues({ foodId: data?.foodId, branches: newModel });
            }
        }
    }, [open, data, modalType, getBranchFoodListData, getBranchDropdownData, getCurrencyDropdownData])

    useEffect(() => {
        if (updateBranchFoodResponse) {
            enqueueSnackbar(updateBranchFoodResponse.message, {
                variant: updateBranchFoodResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateBranchFoodResponse?.success == true) {
                handleClose();
            }
        }
        if (updateBranchFoodError) {
            const error = updateBranchFoodError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateBranchFoodResponse, updateBranchFoodError])

    const handleClose = () => {
        dispatch(closeModal())
    };

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.updateFoodPrice} onClose={handleClose} fullWidth={true} maxWidth={"lg"}>
                <Box sx={{ px: 3, py: 3 }}>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ marginBottom: 3 }}
                    >
                        <Grid item xs>
                            <Typography variant="h4">{`${intl.formatMessage({ id: "updatePrice" })} -  ${t(data?.title)}`}</Typography>
                        </Grid>
                        <Grid item>
                            <IconButton color="secondary" onClick={handleClose}>
                                <CloseSquare size={36} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    {getBranchFoodListLoading || getBranchFoodListFetching ? <CustomScaleLoader /> :
                        <Formik initialValues={initialValues ?? {
                            foodId: "",
                            branches: [{
                                branchFoodId: null,
                                branchId: "",
                                branchSlug: "",
                                categoryId: "",
                                prices: [{
                                    type: "",
                                    currencyCode: "",
                                    price: "",
                                }]
                            }] as FoodPriceBranch[],
                        }}
                            enableReinitialize
                            validationSchema={addFoodValidationSchema(intl)}
                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                updateBranchFood(values);
                            }}>
                            {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                <Form>
                                    <FieldArray name="branches">
                                        {({ push, remove, form }) => (
                                            <>
                                                {values.branches.map((branch, branchIndex) => {
                                                    // ✅ zaten seçilmiş branchId'leri bul
                                                    const selectedIds = values.branches
                                                        .map((b) => b.branchId)
                                                        .filter(Boolean);
                                                    // ✅ select için kullanılabilir seçenekleri filtrele
                                                    const availableOptions = allBranches.filter(
                                                        (item) => !selectedIds.includes(item.value) || item.value === branch.branchId
                                                    );
                                                    const canAdd = values.branches.length < allBranches.length;

                                                    return (<Box key={`branches-${branchIndex}`} sx={{ px: 1, py: 2, backgroundColor: "grey.50", border: `1px dashed ${branchIndex % 2 == 0 ? '#F1EDEE' : '#efc3ce'}`, borderRadius: 0.5, mb: 2 }}><Grid container spacing={3} key={branchIndex}>
                                                        <Grid item xs={12} md={12}>
                                                            <Stack direction={"row"} justifyContent={"space-between"}>
                                                                <InputLabel htmlFor={`branches-${branchIndex}-branch`} sx={{ fontWeight: 500, marginBottom: 1 }}>{intl.formatMessage({ id: "branch" })}</InputLabel>
                                                                <Stack direction={"row"} spacing={2} sx={{ marginBottom: 1 }}>
                                                                    <Button variant="text" size='small' sx={{ padding: 0 }} disabled={!canAdd} onClick={() => push({ id: '', slug: '', currencyCode: '', prices: [{ type: "", currencyCode: "", price: "" }] })}>{intl.formatMessage({ id: "addBranch" })}</Button>
                                                                    <Button variant="text" size='small' sx={{ padding: 0 }} disabled={values.branches.length == 1} onClick={() => remove(branchIndex)}>{intl.formatMessage({ id: "deleteBranch" })}</Button>
                                                                </Stack>
                                                            </Stack>
                                                            <CustomFormikSelect
                                                                name={`branches.${branchIndex}.id`}
                                                                placeholder={intl.formatMessage({ id: "selectX" }, { "x": intl.formatMessage({ id: "branch" }) })}
                                                                isClearable={true}
                                                                menuPosition={"fixed"}
                                                                isLoading={getBranchDropdownLoading}
                                                                zIndex={9999 - branchIndex}
                                                                menuPortalTarget={document.body}
                                                                value={
                                                                    branch.branchId
                                                                        ? (() => {
                                                                            const currency = allBranches.find(
                                                                                (item) => item.value === branch.branchId
                                                                            );
                                                                            return {
                                                                                label: currency?.label ?? "",
                                                                                value: { id: currency?.value, slug: currency?.field },
                                                                            };
                                                                        })()
                                                                        : null
                                                                }
                                                                onChange={(val: any, actionMeta) => {
                                                                    setFieldValue(`branches[${branchIndex}].id`, val?.value?.id ?? "");
                                                                    setFieldValue(`branches[${branchIndex}].slug`, val?.value?.field ?? "");
                                                                    setFieldValue(`branches[${branchIndex}].categoryId`, null);
                                                                }}

                                                                options={availableOptions?.map((item) => ({
                                                                    value: { id: item.value, field: item.field },
                                                                    label: item.label
                                                                }))}
                                                            />
                                                        </Grid>
                                                        <FoodRow branchIndex={branchIndex} branch={branch} setFieldValue={setFieldValue} />
                                                        <FieldArray name={`branches[${branchIndex}].prices`}>
                                                            {({ push: pushPrice, remove: removePrice }) => (
                                                                <>
                                                                    {branch.prices?.map((priceItem, priceIndex) => {
                                                                        // ✅ zaten seçilmiş branchId'leri bul
                                                                        const selectedPriceType = branch.prices
                                                                            .map((b) => b.type)
                                                                            .filter(Boolean);
                                                                        // ✅ select için kullanılabilir seçenekleri filtrele
                                                                        const availablePortionsOptions = portions.filter(
                                                                            (item) => !selectedPriceType.includes(item.value) || item.value === priceItem.type
                                                                        );
                                                                        return (<Fragment key={`price-${priceIndex}`}>
                                                                            <Grid item xs={12} md={1}>
                                                                                <InputLabel htmlFor={`prices-${priceIndex}-addPrice`} sx={{ fontWeight: 500, marginBottom: 2 }}>{intl.formatMessage({ id: "price" })}</InputLabel>
                                                                                <Stack direction="row" spacing={1}>
                                                                                    <Button sx={{ minWidth: 40 }} type='button' variant="outlined" onClick={() => pushPrice({ currencyCode: '', price: '' })}>{"+"}</Button>
                                                                                    <Button disabled={priceIndex == 0 || values.branches[branchIndex].prices.length === 1} sx={{ minWidth: 40 }} type='button' variant="outlined" color="error" onClick={() => removePrice(priceIndex)}>{"-"}</Button>
                                                                                </Stack>
                                                                            </Grid>
                                                                            <Grid item xs={12} md={4}>
                                                                                <InputLabel htmlFor={`prices-${priceIndex}-portion`} sx={{ fontWeight: 500, marginBottom: 1 }}>{intl.formatMessage({ id: "portion" })}</InputLabel>
                                                                                <CustomFormikSelect
                                                                                    name={`branches[${branchIndex}].prices[${priceIndex}].type`}
                                                                                    placeholder={intl.formatMessage({ id: "selectX" }, { "x": intl.formatMessage({ id: "portion" }) })}
                                                                                    isDisabled={priceIndex == 0}
                                                                                    isClearable={true}
                                                                                    menuPosition={"fixed"}
                                                                                    zIndex={999 - priceIndex}
                                                                                    menuPortalTarget={document.body}
                                                                                    //size='sm'
                                                                                    value={
                                                                                        priceItem.type
                                                                                            ? (() => {
                                                                                                const portion = portions?.find(
                                                                                                    (item) => item.value === priceItem.type
                                                                                                );
                                                                                                return {
                                                                                                    label: intl.formatMessage({ id: portion?.label }),
                                                                                                    value: portion?.value ?? "0",
                                                                                                };
                                                                                            })()
                                                                                            : null
                                                                                    }
                                                                                    onChange={(val: any, actionMeta) => {
                                                                                        setFieldValue(`branches[${branchIndex}].prices[${priceIndex}].type`, val?.value ?? "");
                                                                                    }}

                                                                                    options={availablePortionsOptions}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} md={4}>
                                                                                <InputLabel htmlFor={`prices-${priceIndex}-currencyCode`} sx={{ fontWeight: 500, marginBottom: 1 }}>{intl.formatMessage({ id: "currencyCode" })}</InputLabel>
                                                                                <CustomFormikSelect
                                                                                    name={`branches[${branchIndex}].prices[${priceIndex}].currencyCode`}
                                                                                    placeholder={intl.formatMessage({ id: "selectX" }, { "x": intl.formatMessage({ id: "currencyType" }) })}
                                                                                    isClearable={true}
                                                                                    menuPosition={"fixed"}
                                                                                    isLoading={getCurrencyDropdownLoading}
                                                                                    zIndex={9999 - branchIndex}
                                                                                    menuPortalTarget={document.body}
                                                                                    //size='sm'
                                                                                    value={
                                                                                        priceItem.currencyCode
                                                                                            ? (() => {
                                                                                                const currency = getCurrencyDropdownData?.data?.find(
                                                                                                    (item) => item.value === priceItem.currencyCode
                                                                                                );
                                                                                                return {
                                                                                                    label: t(currency?.label) ?? "",
                                                                                                    value: currency?.value ?? "0",
                                                                                                };
                                                                                            })()
                                                                                            : null
                                                                                    }
                                                                                    onChange={(val: any, actionMeta) => {
                                                                                        setFieldValue(`branches[${branchIndex}].prices[${priceIndex}].currencyCode`, val?.value ?? "");
                                                                                    }}

                                                                                    options={getCurrencyDropdownData?.data?.map((item) => ({
                                                                                        value: item.value,
                                                                                        label: t(item.label)
                                                                                    }))}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12} md={3}>
                                                                                <InputLabel htmlFor={`prices-${priceIndex}-price`} sx={{ fontWeight: 500, marginBottom: 1 }}>{intl.formatMessage({ id: "price" })}</InputLabel>
                                                                                <Field name={`branches[${branchIndex}].prices[${priceIndex}].price`}>
                                                                                    {({ field, form }: any) => {
                                                                                        const isTouched =
                                                                                            form.touched?.branches?.[branchIndex]?.prices?.[priceIndex]?.price;

                                                                                        const hasError =
                                                                                            form.errors?.branches?.[branchIndex]?.prices?.[priceIndex]?.price;

                                                                                        return (
                                                                                            <CurrencyInput
                                                                                                id="price"
                                                                                                name={`branches[${branchIndex}].prices[${priceIndex}].price`}
                                                                                                value={form.values.branches[branchIndex].prices[priceIndex].price}
                                                                                                placeholder={intl.formatMessage({ id: "amount" })}
                                                                                                onValueChange={(value, name, values2) => {
                                                                                                    form.setFieldValue(
                                                                                                        `branches[${branchIndex}].prices[${priceIndex}].price`,
                                                                                                        values2?.value
                                                                                                    );
                                                                                                }}
                                                                                                style={{
                                                                                                    width: "-webkit-fill-available",
                                                                                                    padding: 14,
                                                                                                    border: `1px solid ${isTouched && hasError ? "#F04134" : "#BEC8D0"}`,
                                                                                                    borderRadius: 8,
                                                                                                    color: "#1D2630",
                                                                                                    fontSize: "0.875rem",
                                                                                                    boxSizing: "content-box",
                                                                                                    height: "1.4375em",
                                                                                                    font: "inherit"
                                                                                                }}
                                                                                            />
                                                                                        );
                                                                                    }}
                                                                                </Field>
                                                                            </Grid></Fragment>)
                                                                    })}
                                                                </>)}
                                                        </FieldArray>
                                                    </Grid>
                                                    </Box>
                                                    )
                                                })}
                                            </>
                                        )}
                                    </FieldArray>
                                    <DialogActions sx={{ marginTop: 5 }}>
                                        <Button color="info" onClick={handleClose}>
                                            {intl.formatMessage({ id: "close" })}
                                        </Button>
                                        <AnimateButton>
                                            <Button disableElevation
                                                disabled={updateBranchFoodIsLoading}
                                                type="button" variant="contained" color="primary" onClick={() => { handleSubmit() }}>
                                                {(updateBranchFoodIsLoading) && <PuffLoader size={20} color='white' />}
                                                {(updateBranchFoodIsLoading == false) && intl.formatMessage({ id: "save" })}
                                            </Button>
                                        </AnimateButton>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>}
                </Box>
            </Dialog>
        </>
    )
}

export default UpdateFoodPriceModal

const FoodRow = ({ branchIndex, setFieldValue, branch }: { branchIndex: number, setFieldValue: any, branch: FoodPriceBranch }) => {

    const intl = useIntl()
    const t = useLocalizedField()
    const branchSlug = branch.branchSlug
    const {
        data: getCategoryDropdownData,
        isLoading: getCategoryDropdownLoading,
    } = useGetCategoryDropdownQuery(
        { branchSlug: branchSlug },
        { skip: !branchSlug } // branch seçilmeden çağırma
    )

    return (
        <>
            <Grid item xs={12} md={12}>
                <InputLabel htmlFor="branchId" sx={{ fontWeight: 500, marginBottom: 1 }}>{intl.formatMessage({ id: "category" })}</InputLabel>
                <CustomFormikSelect
                    name={`branches.${branchIndex}.categoryId`}
                    placeholder={intl.formatMessage({ id: "selectX" }, { "x": intl.formatMessage({ id: "currency" }) })}
                    isClearable={true}
                    menuPosition={"fixed"}
                    isLoading={getCategoryDropdownLoading}
                    zIndex={9999 - branchIndex}
                    menuPortalTarget={document.body}
                    value={
                        branch.categoryId
                            ? (() => {
                                const branchItem = getCategoryDropdownData?.data?.find(
                                    (item) => item.value === branch.categoryId
                                );
                                return {
                                    label: t(branchItem?.label),
                                    value: branchItem?.value
                                };
                            })()
                            : null
                    }
                    onChange={(val: any) => {
                        setFieldValue(`branches[${branchIndex}].categoryId`, val?.value ?? "");
                    }}

                    options={getCategoryDropdownData?.data?.map((item) => ({
                        value: item.value,
                        label: t(item.label)
                    }))}
                />
            </Grid></>
    )
}
