import { FormHelperText } from '@mui/material'
import { Field } from 'formik'
import Select, { ActionMeta, GroupBase, OptionsOrGroups, StylesConfig } from 'react-select'

type Props = {
    name: string
    placeholder?: string
    isLoading?: boolean
    options?: OptionsOrGroups<any, GroupBase<any>>
    isErrorText?: boolean
    onChange?: ((newValue: any, actionMeta: ActionMeta<any>) => void)
    styles?: StylesConfig<any, false, GroupBase<unknown>>
    value?: any
    isClearable?: boolean
    isDisabled?: boolean
    zIndex?: number
    isMulti?: any
    onMenuOpen?: (() => void) | undefined
    onMenuClose?: (() => void) | undefined
}

const CustomFormikSelect = (props: Props) => {
    return (
        <Field name={props.name}>
            {({ field, form, meta }: any) => (
                <>
                    <Select
                        isMulti={props.isMulti}
                        id={props.name}
                        instanceId={props.name}
                        placeholder={props.placeholder ?? "Seçim yapınız..."}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        isClearable={props.isClearable}
                        noOptionsMessage={(label) => "Bulunamadı."}
                        onMenuOpen={props.onMenuOpen}
                        onMenuClose={props.onMenuClose}
                        styles={props.styles ?? {
                            container: (baseStyles: any) => ({
                                ...baseStyles,
                                zIndex: props.zIndex ?? 998
                            }),
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: state.isFocused ? 'grey' : meta.touched &&
                                    meta.error ? 'red' : '#BEC8D0',
                                borderRadius: '8px',
                                boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(67, 142, 255, 0.25)' : 'var(--tb-border-color)',
                                color: '#1d2630',
                                minHeight: '48px',
                                paddingLeft: '5px',
                            }),
                            placeholder: (baseStyles, state) => ({
                                ...baseStyles,
                                color: '#aeaeae',
                            }),
                        }}
                        options={props.options}
                        onChange={props.onChange}
                        value={props.value}
                    />
                    {(props.isErrorText ?? true) && meta.touched &&
                        meta.error &&  <FormHelperText error id={`helper-text-${name}`}>
                        {meta.error}
                      </FormHelperText>}
                </>
            )}
        </Field>
    )
}

export default CustomFormikSelect