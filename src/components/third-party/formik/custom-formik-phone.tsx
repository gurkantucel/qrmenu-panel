import { FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import React from 'react'

type Props = {
    label?: string
    placeHolder?:string
    handleBlur: any
    handleChange: any
    valuePhoneCode?: string | null
    valuePhoneNumber?: string | null
    touchedPhoneNumber?: boolean | undefined
    namePhoneCode?:string
    namePhoneNumber?:string
    errorPhoneNumber?: string | undefined
    disabled?:boolean
}

const CustomFormikPhone = (props:Props) => {
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
                        error={Boolean(props.touchedPhoneNumber && props.errorPhoneNumber)}
                        value={props.valuePhoneNumber}
                        name={props.namePhoneNumber ?? "phone_number"}
                        disabled={props.disabled}
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        placeholder={props.placeHolder}
                        inputProps={{maxLength: 10}}
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