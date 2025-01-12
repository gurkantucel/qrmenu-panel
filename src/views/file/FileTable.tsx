"use client"
import { Grid } from '@mui/material';
import MainCard from 'components/MainCard'
import AsyncSelect from 'react-select/async'
import React, { useState } from 'react'
import { useLazyGetPatientDropdownQuery } from 'reduxt/features/patient/patient-api';
import PatientFileTable from 'views/patient/patient-file/PatientFileTable';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { useIntl } from 'react-intl';
import { APP_DEFAULT_PATH } from 'config';

const FileTable = () => {

      const intl = useIntl()
    
      let breadcrumbLinks = [
        { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
        { title: `${intl.formatMessage({ id: "files" })}` },
      ];

    const [getPatientDropdown, { isLoading: getPatientDropdownLoading }] = useLazyGetPatientDropdownQuery();

    const [patientId, setPatientId] = useState<string>()

    const getPatientDropdownOptions = async (inputValue: string) => {

        if (inputValue.length > 3) {
            const items = await getPatientDropdown({ label: inputValue })
            return items.data?.data ?? [];
        }
        return [];
    }

    return (
        <>
        <Breadcrumbs custom heading={`${intl.formatMessage({ id: "files" })}`} links={breadcrumbLinks} />
        <MainCard sx={{ marginBottom: 3 }}>
            <Grid item xs={12} marginBottom={3}>
                <AsyncSelect
                    placeholder={"T.C., Telefon veya İsimle Danışan Arayın"}
                    isLoading={getPatientDropdownLoading}
                    isClearable={false}
                    noOptionsMessage={((label) => "Bulunamadı.")}
                    loadOptions={getPatientDropdownOptions}
                    cacheOptions
                    styles={{
                        container: (baseStyles: any) => ({
                            ...baseStyles,
                            zIndex: 998
                        }),
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor: '#BEC8D0',
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
                    onChange={(value) => {
                        setPatientId(`${value?.value}`);
                    }}
                />
            </Grid>
            <PatientFileTable page="file" patientId={patientId} />
        </MainCard>
        </>
    )
}

export default FileTable