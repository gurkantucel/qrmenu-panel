'use client';

import { useEffect, useState, SyntheticEvent } from 'react';

// next
import Image from 'next/legacy/image';
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';

// material-ui
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import FirebaseSocial from './FirebaseSocial';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { APP_DEFAULT_PATH } from 'config';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// types
import { StringColorProps } from 'types/password';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import AuthDivider from '../AuthDivider';
import { Checkbox, FormControlLabel, MenuItem, Select, TextField } from '@mui/material';
import CustomFormikSelect from 'components/third-party/formik/custom-formik-select';

const Auth0 = '/assets/images/icons/auth0.svg';
const Cognito = '/assets/images/icons/aws-cognito.svg';
const Google = '/assets/images/icons/google.svg';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister({ providers, csrfToken }: any) {
  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          email: '',
          countryCode: '+90',
          contact: '',
          company: '',
          password: '',
          branch: '',
          address: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          firstname: Yup.string().max(255).required('First Name is required'),
          lastname: Yup.string().max(255).required('Last Name is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          signIn('register', {
            redirect: false,
            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
            password: values.password,
            company: values.company,
            callbackUrl: APP_DEFAULT_PATH
          }).then((res: any) => {
            if (res?.error) {
              setErrors({ submit: res.error });
              setSubmitting(false);
            }
          });
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AuthDivider>
                  <Typography variant="body1">Yetkili Bilgileri</Typography>
                </AuthDivider>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstname-signup">Yetkili Adı*</InputLabel>
                  <OutlinedInput
                    id="firstname-login"
                    type="firstname"
                    value={values.firstname}
                    name="firstname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Yetkili Adı"
                    fullWidth
                    error={Boolean(touched.firstname && errors.firstname)}
                  />
                </Stack>
                {touched.firstname && errors.firstname && (
                  <FormHelperText error id="helper-text-firstname-signup">
                    {errors.firstname}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="lastname-signup">Yetkili Soyadı*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.lastname && errors.lastname)}
                    id="lastname-signup"
                    type="lastname"
                    value={values.lastname}
                    name="lastname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Yetkili Soyadı"
                    inputProps={{}}
                  />
                </Stack>
                {touched.lastname && errors.lastname && (
                  <FormHelperText error id="helper-text-lastname-signup">
                    {errors.lastname}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="personal-phone">Yetkili Telefon</InputLabel>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Select value={values.countryCode} name="countryCode" onBlur={handleBlur} onChange={handleChange}>
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
                      id="personal-contact"
                      value={values.contact}
                      name="contact"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Yetkili Telefon"
                    />
                  </Stack>
                </Stack>
                {touched.contact && errors.contact && (
                  <FormHelperText error id="personal-contact-helper">
                    {errors.contact}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Yetkili E-posta*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Yetkili E-posta"
                    inputProps={{}}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-signup">Branş</InputLabel>
                  <CustomFormikSelect
                    name='branch'
                    placeholder="Seçim yapınız..."
                    isLoading={false}
                    options={[{ label: "Cildiye", value: 1 }, { label: "Psikiyatri", value: 2 }].map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    onChange={(val) => {
                      //setFieldValue("company_type_id", val.value);
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
                    error={Boolean(touched.company && errors.company)}
                    id="company-signup"
                    value={values.company}
                    name="company"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Firma Adı"
                    inputProps={{}}
                  />
                </Stack>
                {touched.company && errors.company && (
                  <FormHelperText error id="helper-text-company-signup">
                    {errors.company}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-signup">Ülke</InputLabel>
                  <CustomFormikSelect
                    name='branch'
                    placeholder="Seçim yapınız..."
                    isLoading={false}
                    zIndex={9999}
                    options={[{ label: "Türkiye", value: 1 }, { label: "Azerbaycan", value: 2 }].map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    onChange={(val) => {
                      //setFieldValue("company_type_id", val.value);
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-signup">İl</InputLabel>
                  <CustomFormikSelect
                    name='branch'
                    placeholder="Seçim yapınız..."
                    isLoading={false}
                    zIndex={9998}
                    options={[{ label: "Ankara", value: 1 }, { label: "Karabük", value: 2 }].map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    onChange={(val) => {
                      //setFieldValue("company_type_id", val.value);
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-signup">İlçe</InputLabel>
                  <CustomFormikSelect
                    name='branch'
                    placeholder="Seçim yapınız..."
                    isLoading={false}
                    zIndex={9997}
                    options={[{ label: "Merkez", value: 1 }, { label: "Safranbolu", value: 2 }].map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    onChange={(val) => {
                      //setFieldValue("company_type_id", val.value);
                    }}
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
                  <Grid><Checkbox /></Grid>
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
                </Grid>
                <Grid container flexDirection={"row"} alignItems={"center"} justifyContent={"start"} marginLeft={"-11px"}>
                  <Grid><Checkbox /></Grid>
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
                </Grid>
                <Grid container flexDirection={"row"} alignItems={"center"} justifyContent={"start"} marginLeft={"-11px"}>
                  <Grid><Checkbox /></Grid>
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
                </Grid>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Kayıt Ol
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
