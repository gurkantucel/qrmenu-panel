import { FormHelperText } from '@mui/material'
import { Field } from 'formik'
import { ActionMeta, GroupBase, OptionsOrGroups, StylesConfig } from 'react-select'
import AsyncSelect from 'react-select/async'

type Props = {
    name: string
    placeholder?: string
    isLoading?: boolean
    options?: OptionsOrGroups<any, GroupBase<any>>
    loadOptions?: any
    loadingMessage?: ((obj: {
        inputValue: string;
    }) => React.ReactNode) | undefined
    noOptionsMessage?: () => string
    isErrorText?: boolean
    onChange?: ((newValue: any, actionMeta: ActionMeta<any>) => void)
    getOptionLabel?: any
    styles?: StylesConfig<any, any, GroupBase<unknown>>
    value?: any
    isClearable?: boolean
    isDisabled?: boolean
    zIndex?: number
    isMulti?: boolean
}

const CustomFormikAsyncSelect = (props: Props) => {
    return (
        <Field name={props.name}>
            {({ field, form, meta }: any) => (
                <>
                    <AsyncSelect
                        isMulti={props.isMulti}
                        id={props.name}
                        instanceId={props.name}
                        placeholder={props.placeholder ?? "Seçim yapınız..."}
                        isLoading={props.isLoading}
                        isDisabled={props.isDisabled}
                        isClearable={props.isClearable}
                        noOptionsMessage={props.noOptionsMessage ?? ((label) => "Bulunamadı.")}
                        loadingMessage={props.loadingMessage}
                        getOptionLabel={props.getOptionLabel}
                        loadOptions={props.loadOptions}
                        cacheOptions
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
                        meta.error && <FormHelperText error id={`helper-text-${props.name}`}>
                            {meta.error}
                        </FormHelperText>}
                </>
            )}
        </Field>
    )
}

export default CustomFormikAsyncSelect