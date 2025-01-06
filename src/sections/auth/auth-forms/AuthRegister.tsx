'use client';

import { useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { Form, Formik } from 'formik';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import AuthDivider from '../AuthDivider';
import { Checkbox, MenuItem, Select, TextField } from '@mui/material';
import CustomFormikSelect from 'components/third-party/formik/custom-formik-select';
import { useGetBranchDropdownQuery, useGetCountryDropdownQuery, useGetPackagesDropdownQuery, useLazyGetCityDropdownQuery, useLazyGetDistrictDropdownQuery } from 'reduxt/features/definition/definition-api';
import { registerValidationSchema } from 'utils/schemas/auth-validation-schema';
import { useRegisterMutation } from 'reduxt/features/auth/auth-api';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import PuffLoader from 'react-spinners/PuffLoader';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {

  const router = useRouter()

  const { data: getPackagesList, isLoading: getPackagesLoading } = useGetPackagesDropdownQuery();
  const { data: getCountryList, isLoading: getCountryLoading } = useGetCountryDropdownQuery();
  const [getCityList, { data: getCityListData,
    isLoading: getCityListLoading
  }] = useLazyGetCityDropdownQuery();
  const [getDistrictList, {
    data: getDistrictListData,
    isLoading: getDistrictListLoading
  }] = useLazyGetDistrictDropdownQuery();
  const { data: getBranchListData, isLoading: getBranchLoading } = useGetBranchDropdownQuery();

  const [register, { isLoading: registerIsLoading, data: registerResponse, error: registerError}] = useRegisterMutation();

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
          router.push("/app/auth/login")
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
          membership_package_id: 0,
          person_name: '',
          person_surname: '',
          person_phone_code: '+90',
          person_phone_number: '',
          person_email: '',
          company_name: '',
          branch_id: 0,
          country_id: 0,
          city_id: 0,
          district_id: 0,
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
            person_name: values.person_name,
            person_surname: values.person_surname,
            person_phone_code: values.person_phone_code,
            person_phone_number: values.person_phone_number,
            person_email: values.person_email,
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
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-signup">Paket</InputLabel>
                  <CustomFormikSelect
                    name='membership_package_id'
                    placeholder="Seçim yapınız..."
                    isLoading={getPackagesLoading}
                    zIndex={9995}
                    options={getPackagesList?.data?.map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    value={
                      values.membership_package_id ? { label: getPackagesList?.data?.find((item) => item.value == values.membership_package_id)?.label ?? "", value: getPackagesList?.data?.find((item) => item.value == values.membership_package_id)?.value ?? 0 } : null}
                    onChange={(val: any) => {
                      setFieldValue("membership_package_id", val?.value ?? 0);
                    }}
                  />
                </Stack>
              </Grid>
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
                <Stack spacing={1}>
                  <InputLabel htmlFor="personal-phone">Yetkili Telefon</InputLabel>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Select
                      MenuProps={{
                        style: { zIndex: 9999 }
                      }}
                      value={values.person_phone_code} name="person_phone_code" onBlur={handleBlur} onChange={handleChange}>
                      <MenuItem value="+90">+90</MenuItem>
                      <MenuItem value="+91">+91</MenuItem>
                      <MenuItem value="1-671">1-671</MenuItem>
                      <MenuItem value="+36">+36</MenuItem>
                      <MenuItem value="(225)">(255)</MenuItem>
                      <MenuItem value="+39">+39</MenuItem>
                      <MenuItem value="1-876">1-876</MenuItem>
                      <MenuItem value="+7">+7</MenuItem>
                      <MenuItem value="(254)">(254)</MenuItem>
                      <MenuItem value="(373)">(373)</MenuItem>
                      <MenuItem value="1-664">1-664</MenuItem>
                      <MenuItem value="+95">+95</MenuItem>
                      <MenuItem value="(264)">(264)</MenuItem>
                    </Select>
                    <TextField
                      fullWidth
                      id="person_phone_number"
                      error={Boolean(touched.person_phone_number && errors.person_phone_number)}
                      value={values.person_phone_number}
                      name="person_phone_number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Yetkili Telefon"
                      inputProps={{
                        type: "tel",
                        maxLength: 10,
                        inputMode: "numeric",
                      }}
                    />
                  </Stack>
                </Stack>
                {touched.person_phone_number && errors.person_phone_number && (
                  <FormHelperText error id="personal-contact-helper">
                    {errors.person_phone_number}
                  </FormHelperText>
                )}
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
                  <InputLabel htmlFor="company-signup">Ülke</InputLabel>
                  <CustomFormikSelect
                    name='country_id'
                    placeholder="Seçim yapınız..."
                    isLoading={getCountryLoading}
                    zIndex={9995}
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
                    zIndex={9994}
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
                    zIndex={9993}
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
              <Grid item xs={12} sm={12}>
                <Grid container flexDirection={"row"} alignItems={"center"} justifyContent={"start"} marginLeft={"-11px"}>
                  <Grid><Checkbox name='membershipAgreement' onChange={handleChange} /></Grid>
                  <Grid>
                    <Typography
                      component={Link}
                      href={"#"}
                      variant="body2"
                      sx={{ textDecoration: 'none' }}
                      color="primary"
                    >
                      {"Üyelik Sözleşmesi *"}
                    </Typography><>{" Okudum ve Kabul Ediyorum."}</></Grid>
                  {touched.membershipAgreement && errors.membershipAgreement && (
                    <Grid> <FormHelperText style={{ marginTop: 0 }} error id="membershipAgreement">
                      {`(${errors.membershipAgreement})`}
                    </FormHelperText></Grid>
                  )}
                </Grid>
                <Grid container flexDirection={"row"} alignItems={"center"} justifyContent={"start"} marginLeft={"-11px"}>
                  <Grid><Checkbox name='illuminationText' onChange={handleChange} /></Grid>
                  <Grid>
                    <Typography
                      component={Link}
                      href={"#"}
                      variant="body2"
                      sx={{ textDecoration: 'none' }}
                      color="primary"
                    >
                      {"Aydınlatma Metni *"}
                    </Typography><>{" Okudum ve Kabul Ediyorum."}</></Grid>
                  {touched.illuminationText && errors.illuminationText && (
                    <Grid> <FormHelperText style={{ marginTop: 0 }} error id="illuminationText">
                      {`(${errors.illuminationText})`}
                    </FormHelperText></Grid>
                  )}
                </Grid>
                <Grid container flexDirection={"row"} alignItems={"center"} justifyContent={"start"} marginLeft={"-11px"}>
                  <Grid><Checkbox name='kvkk' onChange={handleChange} /></Grid>
                  <Grid>
                    <Typography
                      component={Link}
                      href={"#"}
                      variant="body2"
                      sx={{ textDecoration: 'none' }}
                      color="primary"
                    >
                      {"Kişisel Verilerin İşlenmesine ilişkin Açık Rıza"}
                    </Typography><>{" Okudum ve Kabul Ediyorum."}</></Grid>
                  {touched.kvkk && errors.kvkk && (
                    <Grid> <FormHelperText style={{ marginTop: 0 }} error id="kvkk">
                      {`(${errors.kvkk})`}
                    </FormHelperText></Grid>
                  )}
                </Grid>

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
