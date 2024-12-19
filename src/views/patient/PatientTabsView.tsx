"use client"
import React, { ReactNode } from 'react'
import MainCard from 'components/MainCard';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { PatientTabEnum, setTab } from 'reduxt/features/definition/patientTabSlice';
import PatientPersonalInformation from './PatientPersonalInformation';
import { PatientHealthHistory } from './PatientHealthHistory';

interface TabPanelProps {
    children?: ReactNode;
    index: PatientTabEnum;
    value: PatientTabEnum;
}

const PatientTabsView = ({ params }: { params: { slug: string } }) => {
    const dispatch = useAppDispatch();
    const { data: { selectTab } } = useAppSelector((state: RootState) => state.patientTab);

    const handleChange = (event: React.SyntheticEvent, newValue: PatientTabEnum) => {
        dispatch(setTab({ selectTab: newValue }))
    };

    function TabPanel({ children, value, index, ...other }: TabPanelProps) {
        return (
            <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
                {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
            </div>
        );
    }


    return (
        <MainCard content={false}>
            <Box padding={2}>
                <Typography variant='h5' margin={1}>{"Danışan Detay"}</Typography>
                <Tabs value={selectTab} onChange={handleChange} aria-label="basic tabs example">
                    <Tab value={PatientTabEnum.kisisel_bilgiler} label="Kişisel Bilgiler" />
                    <Tab value={PatientTabEnum.saglik_gecmisi} label="Sağlık Geçmişi" />
                    <Tab value={PatientTabEnum.saglik_bilgileri} label="Sağlık Bilgileri" />
                    <Tab value={PatientTabEnum.dosyalar} label="Dosyalar" />
                    <Tab value={PatientTabEnum.odemeler} label="Ödemeler" />
                    <Tab value={PatientTabEnum.randevular} label="Randevular" />
                </Tabs>
                <TabPanel value={selectTab} index={PatientTabEnum.kisisel_bilgiler}>
                   <PatientPersonalInformation params={params} />
                </TabPanel>
                <TabPanel value={selectTab} index={PatientTabEnum.saglik_gecmisi}>
                    <PatientHealthHistory params={params} />
                </TabPanel>
            </Box>
        </MainCard>
    )
}

export default PatientTabsView