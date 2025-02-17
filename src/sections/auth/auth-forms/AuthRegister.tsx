'use client';

import { useEffect, useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { Form, Formik, useFormikContext } from 'formik';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import AuthDivider from '../AuthDivider';
import { TextField } from '@mui/material';
import CustomFormikSelect from 'components/third-party/formik/custom-formik-select';
import { useGetBranchDropdownQuery, useGetCountryDropdownQuery, useLazyGetCityDropdownQuery, useLazyGetDistrictDropdownQuery, useGetMembershipPackagesDetailQuery } from 'reduxt/features/definition/definition-api';
import { registerValidationSchema } from 'utils/schemas/auth-validation-schema';
import { useRegisterMutation } from 'reduxt/features/auth/auth-api';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import PuffLoader from 'react-spinners/PuffLoader';
import CustomFormikPhone from 'components/third-party/formik/custom-formik-phone';
import { useIntl } from 'react-intl';
import { deleteCookie, getCookie } from 'cookies-next';
import { MembershipPackagesListModel } from 'reduxt/features/definition/models/membership-packages-model';
import { useLazyGetCouponCheckValidityQuery } from 'reduxt/features/coupon/coupon-api';
import AuthFormsAydinlatmaMetni from './auth-form-article/AydinlatmaMetni';
import AuthFormsUyelikSozlesmesi from './auth-form-article/UyelikSozlesmesi';
import AuthFormsKvkk from './auth-form-article/KvkkMetni';

type CouponCheckProps = {
  getPackagesList?: MembershipPackagesListModel
}

// ============================|| JWT - REGISTER ||============================ //

const MemberShipControl = () => {
  const { setFieldValue } = useFormikContext();
  const cookie = getCookie("membership_package_id");
  useEffect(() => {
    if (cookie != null) {
      setFieldValue("membership_package_id", cookie);
    }
  }, [setFieldValue])
  return null;
}

const CouponCheckValidity = (props: CouponCheckProps) => {
  const { touched, errors, values, handleBlur, handleChange, setFieldValue } = useFormikContext<any>();

  const [buttonType, setButtonType] = useState("uygula");

  const [getCouponCheckValidity, {
    isLoading: getCouponCheckValidityLoading,
    isError: getCouponCheckValidityIsError,
    error: getCouponCheckValidityError
  }] = useLazyGetCouponCheckValidityQuery();

  const handleApplyCoupon = async (coupon_code: string, product_id: string) => {
    try {
      if (buttonType == "uygula") {
        const result = await getCouponCheckValidity({ coupon_code: coupon_code, product_id: product_id }).unwrap();
        if (result?.data?.discount_percentage) {
          setFieldValue("amount", result?.data?.amount);
          setFieldValue("total_amount", result?.data?.total_amount);
          setFieldValue("vat", result?.data?.vat);
          setFieldValue("vat_amount", result?.data?.vat_amount);
          setFieldValue("discount_percentage", result?.data?.discount_percentage);
          setFieldValue("discount_amount", result?.data?.discount_amount);
          setFieldValue("total", result?.data?.total);
          setButtonType("kaldir");
        }
      } else if (buttonType == "kaldir") {
        setFieldValue("coupon_code", "");
        setButtonType("uygula");
        const filter = props.getPackagesList?.data?.find((item) => item.membership_package_id == values.membership_package_id);
        if (filter) {
          setFieldValue("amount", filter?.amount);
          setFieldValue("total_amount", filter?.total);
          setFieldValue("vat", filter?.vat);
          setFieldValue("vat_amount", filter?.vat_amount);
          setFieldValue("discount_amount", "");
          setFieldValue("total", filter?.total);
        }
      }
    } catch (error) {
      if (getCouponCheckValidityIsError) {
        var errors = getCouponCheckValidityError as any;
        enqueueSnackbar(errors.data?.message ?? "Hata", {
          variant: 'error', anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        },)
      }
    }
  }


  return (
    <Grid container flexDirection={"row"} alignItems={"center"} alignContent={"end"} paddingLeft={3} spacing={1} marginTop={1}>
      <Grid item xs={10}>
        <OutlinedInput
          fullWidth
          error={Boolean(touched.coupon_code && errors.coupon_code)}
          id="coupon_code"
          type="text"
          value={values.coupon_code}
          name="coupon_code"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="İndirim Kodu"
          inputProps={{ maxLength: 50 }}
        />
      </Grid>
      <Grid item xs={2}>
        <AnimateButton>
          <Button disableElevation disabled={getCouponCheckValidityLoading} fullWidth size="large" type="button" 
          variant="contained" 
          color={buttonType == "uygula" ? "primary" : "secondary"} 
          onClick={() => {
            if (values.coupon_code.trim().length == 0) {
              enqueueSnackbar("Kupon kodu girin.", {
                variant: 'error', anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right'
                }
              },)
              return;
            }
            handleApplyCoupon(values.coupon_code, values.membership_package_id)
          }}>
            {getCouponCheckValidityLoading && <PuffLoader size={20} color='white' />}
            {getCouponCheckValidityLoading == false && buttonType == "uygula" ? "Uygula" : "Kaldır"}
          </Button>
        </AnimateButton>
      </Grid>
    </Grid>
  )
}

export default function AuthRegister() {

  const router = useRouter()
  const intl = useIntl()

  //const memberShipPackageCookie = getCookie("membership_package_id");

  const { data: getPackagesList, isLoading: getPackagesLoading } = useGetMembershipPackagesDetailQuery();

  const { data: getCountryList, isLoading: getCountryLoading } = useGetCountryDropdownQuery();
  const [getCityList, { data: getCityListData,
    isLoading: getCityListLoading
  }] = useLazyGetCityDropdownQuery();
  const [getDistrictList, {
    data: getDistrictListData,
    isLoading: getDistrictListLoading
  }] = useLazyGetDistrictDropdownQuery();
  const { data: getBranchListData, isLoading: getBranchLoading } = useGetBranchDropdownQuery();

  const [register, { isLoading: registerIsLoading, data: registerResponse, error: registerError }] = useRegisterMutation();

  useEffect(() => {
    if (registerResponse) {
      enqueueSnackbar(registerResponse.message, {
        variant: registerResponse?.status == true ? 'success' : 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
      if (registerResponse?.status == true) {
        setTimeout(() => {
          deleteCookie("membership_package_id");
          router.push(`/app/auth/pay-form/${registerResponse.data[0]}`)
        }, 1000)
      }
    }
    if (registerError) {
      var error = registerError as any;
      enqueueSnackbar(error.data?.message ?? "Hata", {
        variant: 'error', anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        }
      },)
    }
  }, [registerResponse, registerError])

  return (
    <>
      <Formik
        initialValues={{
          membership_package_id: "",
          currency_code: "",
          amount: "",
          total_amount: "",
          discount_percentage: "",
          discount_amount: "",
          vat: "",
          vat_amount: "",
          total: "",
          coupon_id: "",
          coupon_code: '',
          person_name: '',
          person_surname: '',
          person_phone_code: '+90',
          person_phone_number: '',
          person_email: '',
          identity_number: '',
          company_name: '',
          branch_id: "",
          country_id: "",
          city_id: "",
          district_id: "",
          address: '',
          status: true,
          membershipAgreement: false,
          illuminationText: false,
          kvkk: false,
        }}
        validationSchema={registerValidationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          const model = {
            membership_package_id: values.membership_package_id,
            coupon_code: values.coupon_code.length == 0 ? null : values.coupon_code,
            person_name: values.person_name,
            person_surname: values.person_surname,
            person_phone_code: values.person_phone_code,
            person_phone_number: values.person_phone_number,
            person_email: values.person_email,
            identity_number: values.identity_number,
            company_name: values.company_name,
            branch_id: values.branch_id,
            country_id: values.country_id,
            city_id: values.city_id,
            district_id: values.district_id,
            address: values.address,
            status: values.status,
          }
          register(model);
        }}
      >
        {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <Form>
            <MemberShipControl />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AuthDivider>
                  <Typography variant="body1">Yetkili Bilgileri</Typography>
                </AuthDivider>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstname-signup">Yetkili Adı</InputLabel>
                  <OutlinedInput
                    id="person_name"
                    type="firstname"
                    value={values.person_name}
                    name="person_name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Yetkili Adı"
                    fullWidth
                    error={Boolean(touched.person_name && errors.person_name)}
                    inputProps={{ maxLength: 50 }}
                  />
                </Stack>
                {touched.person_name && errors.person_name && (
                  <FormHelperText error id="helper-text-firstname-signup">
                    {errors.person_name}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="lastname-signup">Yetkili Soyadı</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.person_surname && errors.person_surname)}
                    id="lastname-signup"
                    type="lastname"
                    value={values.person_surname}
                    name="person_surname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Yetkili Soyadı"
                    inputProps={{ maxLength: 50 }}
                  />
                </Stack>
                {touched.person_surname && errors.person_surname && (
                  <FormHelperText error id="helper-text-lastname-signup">
                    {errors.person_surname}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomFormikPhone
                  label={`Yetkili Telefon`}
                  placeHolder={`Yetkili Telefon`}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  namePhoneCode="person_phone_code"
                  valuePhoneCode={values.person_phone_code}
                  namePhoneNumber="person_phone_number"
                  valuePhoneNumber={values.person_phone_number}
                  touchedPhoneNumber={touched.person_phone_number}
                  errorPhoneNumber={errors.person_phone_number}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Yetkili E-posta</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.person_email && errors.person_email)}
                    id="person_email"
                    type="email"
                    value={values.person_email}
                    name="person_email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Yetkili E-posta"
                    inputProps={{ maxLength: 200 }}
                  />
                </Stack>
                {touched.person_email && errors.person_email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.person_email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-signup">Branş</InputLabel>
                  <CustomFormikSelect
                    name='branch_id'
                    placeholder="Seçim yapınız..."
                    isLoading={getBranchLoading}
                    options={getBranchListData?.data?.map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    value={
                      values.branch_id ? { label: getBranchListData?.data?.find((item) => item.value == values.branch_id)?.label ?? "", value: getBranchListData?.data?.find((item) => item.value == values.branch_id)?.value ?? 0 } : null}
                    onChange={(val: any) => {
                      setFieldValue("branch_id", val?.value ?? 0);
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <AuthDivider>
                  <Typography variant="body1">Şirket Bilgileri</Typography>
                </AuthDivider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-signup">Firma Adı</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.company_name && errors.company_name)}
                    id="company_name"
                    value={values.company_name}
                    name="company_name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Firma Adı"
                    inputProps={{}}
                  />
                </Stack>
                {touched.company_name && errors.company_name && (
                  <FormHelperText error id="helper-text-company-signup">
                    {errors.company_name}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="identity_number">{"VKN/TCKN"}</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.identity_number && errors.identity_number)}
                    id="identity_number"
                    type="lastname"
                    value={values.identity_number}
                    name="identity_number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={"VKN/TCKN"}
                    inputProps={{ maxLength: 11 }}
                  />
                </Stack>
                {touched.identity_number && errors.identity_number && (
                  <FormHelperText error id="helper-text-company-signup">
                    {errors.identity_number}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-signup">Ülke</InputLabel>
                  <CustomFormikSelect
                    name='country_id'
                    placeholder="Seçim yapınız..."
                    isLoading={getCountryLoading}
                    zIndex={995}
                    options={getCountryList?.data?.map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    value={
                      values.country_id ? { label: getCountryList?.data?.find((item) => item.value == values.country_id)?.label ?? "", value: getCountryList?.data?.find((item) => item.value == values.country_id)?.value ?? 0 } : null}
                    onChange={(val: any) => {
                      setFieldValue("country_id", val?.value ?? 0);
                      setFieldValue("city_id", 0);
                      getCityList({ country_id: val?.value })
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-signup">İl</InputLabel>
                  <CustomFormikSelect
                    name='city_id'
                    placeholder="Seçim yapınız..."
                    isLoading={getCityListLoading}
                    value={
                      values.city_id ? { label: getCityListData?.data?.find((item) => item.value == values.city_id)?.label ?? "", value: getCityListData?.data?.find((item) => item.value == values.city_id)?.value ?? 0 } : null}
                    zIndex={994}
                    onChange={(val: any) => {
                      setFieldValue("city_id", val?.value ?? 0);
                      setFieldValue("district_id", null);
                      getDistrictList({ city_id: val?.value })
                    }}
                    options={getCityListData?.data?.map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-signup">İlçe</InputLabel>
                  <CustomFormikSelect
                    name='district_id'
                    placeholder="Seçim yapınız..."
                    isLoading={getDistrictListLoading}
                    zIndex={993}
                    value={
                      values.district_id ? { label: getDistrictListData?.data?.find((item) => item.value == values.district_id)?.label ?? "", value: getDistrictListData?.data?.find((item) => item.value == values.district_id)?.value ?? 0 } : null}
                    onChange={(val: any) => {
                      setFieldValue("district_id", val?.value ?? 0);
                    }}
                    options={getDistrictListData?.data?.map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="personal-addrees1">Adres</InputLabel>
                  <TextField
                    multiline
                    rows={1}
                    fullWidth
                    id="personal-addrees1"
                    value={values.address}
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Adres"
                    error={Boolean(touched.address && errors.address)}
                    inputProps={{ maxLength: 500 }}
                  />
                </Stack>
                {touched.address && errors.address && (
                  <FormHelperText error id="personal-address-helper">
                    {errors.address}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <AuthDivider>
                  <Typography variant="body1">Paket Bilgileri</Typography>
                </AuthDivider>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-signup">Paket</InputLabel>
                  <CustomFormikSelect
                    name='membership_package_id'
                    placeholder="Seçim yapınız..."
                    isLoading={getPackagesLoading}
                    zIndex={995}
                    options={getPackagesList?.data?.map((item) => ({
                      value: item.membership_package_id,
                      label: item.name
                    }))}
                    value={
                      values.membership_package_id ? { label: getPackagesList?.data?.find((item) => item.membership_package_id == values.membership_package_id)?.name ?? "", value: getPackagesList?.data?.find((item) => item.membership_package_id == values.membership_package_id)?.membership_package_id ?? "0" } : null}
                    onChange={(val: any) => {
                      setFieldValue("membership_package_id", val?.value ?? "0");
                      const filter = getPackagesList?.data?.find((item) => item.membership_package_id == val.value);
                      setFieldValue("currency_code", filter?.currency_code);
                      setFieldValue("amount", filter?.amount);
                      setFieldValue("total_amount", filter?.amount);
                      setFieldValue("vat", filter?.vat);
                      setFieldValue("vat_amount", filter?.vat_amount);
                      setFieldValue("total", filter?.total);
                      if (values.coupon_code != null) {
                        setFieldValue("coupon_code", "");
                      }
                    }}
                  />
                </Stack>
              </Grid>
              {values.membership_package_id &&
                <>
                  <CouponCheckValidity getPackagesList={getPackagesList} />
                  <Grid container flexDirection={"column"} alignContent="flex-end" marginTop={2}>
                    <Grid item xs={6}>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography color="grey.500">{`${intl.formatMessage({ id: "amount" })}:`}</Typography>
                          <Typography>{`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: values.currency_code }).format(Number(values.amount))}`}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography color="grey.500">{`${intl.formatMessage({ id: "vat" })} (%${values.vat}):`}</Typography>
                          <Typography>{`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: values.currency_code }).format(Number(values.vat))}`}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography color="grey.500">{`${intl.formatMessage({ id: "totalAmount" })}:`}</Typography>
                          <Typography>{`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: values.currency_code }).format(Number(values.total_amount))}`}</Typography>
                        </Stack>
                        {values.discount_amount && <Stack direction="row" justifyContent="space-between">
                          <Typography color="grey.500">{`${intl.formatMessage({ id: "discountText" }, { coupon_code: values.coupon_code, discount_percentage: values.discount_percentage })} `}</Typography>
                          <Typography>{` ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: values.currency_code }).format(Number(values.discount_amount))}`}</Typography>
                        </Stack>}
                        <Stack direction="row" justifyContent="space-between" spacing={7}>
                          <Typography variant="subtitle1">{`${intl.formatMessage({ id: "amountToBePaid" })}:`}</Typography>
                          <Typography variant="subtitle1">
                            {`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: values.currency_code }).format(Number(values.total))}`}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </>}
              <Grid item xs={12} sm={12}>
                <AuthFormsUyelikSozlesmesi />
                <AuthFormsAydinlatmaMetni />
                <AuthFormsKvkk />
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting || registerIsLoading} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {registerIsLoading && <PuffLoader size={20} color='white' />}
                    {registerIsLoading == false && "Kayıt Ol"}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik >
    </>
  );
}
