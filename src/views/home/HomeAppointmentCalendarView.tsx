import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { Box, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import CalendarStyled from 'sections/apps/calendar/CalendarStyled';
import { EventSourceInput } from '@fullcalendar/core';
import { Theme } from '@mui/material/styles';
import { useIntl } from 'react-intl';
import { useLazyGetAppointmentCalendarListQuery } from 'reduxt/features/appointment/appointment-calendar-api';
import Toolbar from 'sections/apps/calendar/Toolbar';
import Select from 'react-select'
import MainCard from 'components/MainCard';
import { useLazyAcceptingAppointmentDropDownQuery } from 'reduxt/features/person/person-api';
import CustomScaleLoader from 'components/CustomScaleLoader';

const HomeAppointmentCalendarView = () => {
    const matchDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const [personId, setPersonId] = useState<number | null>()

    const intl = useIntl()

    const [calendarView, setCalendarView] = useState<string>("dayGridMonth");
    const [date, setDate] = useState(new Date());
    const calendarRef = useRef<FullCalendar>(null);

    const [getAcceptingAppointmentDropDownList, {
        data: getAcceptingAppointmentListData,
        isLoading: getAcceptingAppointmentListLoading
    }] = useLazyAcceptingAppointmentDropDownQuery();

    const handleDateToday = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.today();
            setDate(calendarApi.getDate());
        }
    };

    const handleViewChange = (newView: string) => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.changeView(newView);
            setCalendarView(newView);
        }
    };

    const handleDatePrev = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.prev();
            setDate(calendarApi.getDate());
        }
    };

    const handleDateNext = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.next();
            setDate(calendarApi.getDate());
        }
    };

    const [getAppointmentCalendarList, {
        data: appointmentCalendarData,
        isLoading: appointmentCalendarLoading,
        isFetching: appointmentCalendarFetching
    }] = useLazyGetAppointmentCalendarListQuery();

    useEffect(()=>{
        getAcceptingAppointmentDropDownList({})
    },[])

    useEffect(() => {
        if (getAcceptingAppointmentListData?.status && getAcceptingAppointmentListData.data != null) {
            setPersonId(getAcceptingAppointmentListData?.data[0].value)
            getAppointmentCalendarList({ person_id: getAcceptingAppointmentListData?.data[0].value });
        }
    }, [getAcceptingAppointmentListData])

    return (
        <MainCard
            title={intl.formatMessage({ id: "appointments" })}
            secondary={
                <Typography variant="h6">
                    <Select
                        placeholder={"Seçim yapınız..."}
                        noOptionsMessage={(label) => "Bulunamadı."}
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
                        value={
                            personId ? { label: getAcceptingAppointmentListData?.data?.find((item: any) => item.value == personId)?.label ?? "", value: getAcceptingAppointmentListData?.data?.find((item: any) => item.value == personId)?.value ?? 0 } : null}
                        isLoading={getAcceptingAppointmentListLoading}
                        options={getAcceptingAppointmentListData?.data?.map((item: any) => ({
                            value: item.value,
                            label: item.label
                        }))}
                        onChange={(val: any) => {
                            getAppointmentCalendarList({ person_id: val?.value })
                        }}
                    />
                </Typography>
            }
        >
            {appointmentCalendarLoading || appointmentCalendarFetching || getAcceptingAppointmentListLoading ? <CustomScaleLoader /> :
                <Box sx={{ px: 3, pb: 2 }}>
                    <CalendarStyled>
                        <Toolbar
                            date={date}
                            view={calendarView!}
                            onClickNext={handleDateNext}
                            onClickPrev={handleDatePrev}
                            onClickToday={handleDateToday}
                            onChangeView={handleViewChange}
                        />
                        <FullCalendar
                            weekends
                            editable
                            droppable
                            selectable
                            events={appointmentCalendarData?.data as EventSourceInput ?? []}
                            ref={calendarRef}
                            rerenderDelay={10}
                            initialDate={date}
                            initialView={calendarView}
                            allDayText='Tüm'
                            scrollTime={"08:00:00"}
                            noEventsText={intl.formatMessage({id: "noEventsText"})}
                            dayMaxEventRows={3}
                            eventDisplay="block"
                            headerToolbar={false}
                            allDayMaintainDuration
                            eventResizableFromStart
                            locale={"tr"}
                            select={(val) => {
                            }}
                            //eventDrop={handleEventUpdate}
                            //eventClick={handleEventSelect}
                            //eventResize={handleEventUpdate}
                            //height={matchDownSM ? 'auto' : 720}
                            height={matchDownSM ? 'auto' : 600}
                            plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                        />
                    </CalendarStyled>
                </Box>}
        </MainCard>
    )
}

export default HomeAppointmentCalendarView