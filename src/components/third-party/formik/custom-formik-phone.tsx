import { FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import React from 'react'

type Props = {
    label?: string
    placeHolder?: string
    handleBlur: any
    handleChange: any
    valuePhoneCode?: string | null
    valuePhoneNumber?: string | null
    touchedPhoneNumber?: boolean | undefined
    namePhoneCode?: string
    namePhoneNumber?: string
    errorPhoneNumber?: string | undefined
    disabled?: boolean
}

const CustomFormikPhone = (props: Props) => {
    return (
        <>
            <Stack spacing={1}>
                <InputLabel htmlFor="personal-phone">{props.label ?? "-"}</InputLabel>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Select
                        MenuProps={{
                            style: { zIndex: 9999 }
                        }}
                        value={props.valuePhoneCode}
                        disabled={props.disabled}
                        name={props.namePhoneCode ?? "phone_code"}
                        onBlur={props.handleBlur} onChange={props.handleChange}>
                        <MenuItem value="+90">+90 🇹🇷</MenuItem>
                        <MenuItem value="+1">+1 🇺🇸</MenuItem>
                        <MenuItem value="+1">+1 🇨🇦</MenuItem>
                        <MenuItem value="+44">+44 🇬🇧</MenuItem>
                        <MenuItem value="+49">+49 🇩🇪</MenuItem>
                        <MenuItem value="+33">+33 🇫🇷</MenuItem>
                        <MenuItem value="+34">+34 🇪🇸</MenuItem>
                        <MenuItem value="+39">+39 🇮🇹</MenuItem>
                        <MenuItem value="+31">+31 🇳🇱</MenuItem>
                        <MenuItem value="+32">+32 🇧🇪</MenuItem>
                        <MenuItem value="+46">+46 🇸🇪</MenuItem>
                        <MenuItem value="+47">+47 🇳🇴</MenuItem>
                        <MenuItem value="+45">+45 🇩🇰</MenuItem>
                        <MenuItem value="+358">+358 🇫🇮</MenuItem>
                        <MenuItem value="+41">+41 🇨🇭</MenuItem>
                        <MenuItem value="+43">+43 🇦🇹</MenuItem>
                        <MenuItem value="+351">+351 🇵🇹</MenuItem>
                        <MenuItem value="+30">+30 🇬🇷</MenuItem>
                        <MenuItem value="+7">+7 🇷🇺</MenuItem>
                        <MenuItem value="+380">+380 🇺🇦</MenuItem>
                        <MenuItem value="+48">+48 🇵🇱</MenuItem>
                        <MenuItem value="+420">+420 🇨🇿</MenuItem>
                        <MenuItem value="+36">+36 🇭🇺</MenuItem>
                        <MenuItem value="+40">+40 🇷🇴</MenuItem>
                        <MenuItem value="+359">+359 🇧🇬</MenuItem>
                        <MenuItem value="+972">+972 🇮🇱</MenuItem>
                        <MenuItem value="+971">+971 🇦🇪</MenuItem>
                        <MenuItem value="+966">+966 🇸🇦</MenuItem>
                        <MenuItem value="+20">+20 🇪🇬</MenuItem>
                        <MenuItem value="+27">+27 🇿🇦</MenuItem>
                        <MenuItem value="+234">+234 🇳🇬</MenuItem>
                        <MenuItem value="+254">+254 🇰🇪</MenuItem>
                        <MenuItem value="+55">+55 🇧🇷</MenuItem>
                        <MenuItem value="+54">+54 🇦🇷</MenuItem>
                        <MenuItem value="+52">+52 🇲🇽</MenuItem>
                        <MenuItem value="+56">+56 🇨🇱</MenuItem>
                        <MenuItem value="+51">+51 🇵🇪</MenuItem>
                        <MenuItem value="+57">+57 🇨🇴</MenuItem>
                        <MenuItem value="+58">+58 🇻🇪</MenuItem>
                        <MenuItem value="+61">+61 🇦🇺</MenuItem>
                        <MenuItem value="+64">+64 🇳🇿</MenuItem>
                        <MenuItem value="+81">+81 🇯🇵</MenuItem>
                        <MenuItem value="+82">+82 🇰🇷</MenuItem>
                        <MenuItem value="+86">+86 🇨🇳</MenuItem>
                        <MenuItem value="+84">+84 🇻🇳</MenuItem>
                        <MenuItem value="+66">+66 🇹🇭</MenuItem>
                        <MenuItem value="+65">+65 🇸🇬</MenuItem>
                        <MenuItem value="+60">+60 🇲🇾</MenuItem>
                        <MenuItem value="+62">+62 🇮🇩</MenuItem>
                        <MenuItem value="+63">+63 🇵🇭</MenuItem>
                        <MenuItem value="+91">+91 🇮🇳</MenuItem>
                        <MenuItem value="+92">+92 🇵🇰</MenuItem>
                        <MenuItem value="+880">+880 🇧🇩</MenuItem>
                    </Select>
                    <TextField
                        fullWidth
                        id="person_phone_number"
                        error={Boolean(props.touchedPhoneNumber && props.errorPhoneNumber)}
                        value={props.valuePhoneNumber}
                        name={props.namePhoneNumber ?? "phone_number"}
                        disabled={props.disabled}
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        placeholder={props.placeHolder}
                        inputProps={{ maxLength: 10 }}
                    />
                </Stack>
            </Stack>
            {props.touchedPhoneNumber && props.errorPhoneNumber && (
                <FormHelperText error id="personal-contact-helper">
                    {props.errorPhoneNumber}
                </FormHelperText>
            )}
        </>
    )
}

export default CustomFormikPhone