import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { Box, Dialog, Grid, IconButton, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { AppointmentCalendarModalEnum, closeCalendarModal } from 'reduxt/features/appointment/appointmentCalendarModalSlice';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import CalendarStyled from 'sections/apps/calendar/CalendarStyled';
import { EventSourceInput } from '@fullcalendar/core';
import { useFormikContext } from 'formik';
import dayjs from 'dayjs';
import { CloseSquare } from 'iconsax-react';
import CustomScaleLoader from 'components/CustomScaleLoader';
import Toolbar from 'sections/apps/calendar/Toolbar';
import Select from 'react-select'
import { useIntl } from 'react-intl';
import { useGetAppointmentCalendarListQuery } from 'reduxt/features/appointment/appointment-api';
import { useAcceptingAppointmentDropDownQuery } from 'reduxt/features/person/person-api';

const durationCalc = (startStr: string, endStr: string) => {
    const startDate = dayjs(startStr);
    const endDate = dayjs(endStr);
    const differenceInMilliseconds = endDate.diff(startDate, 'milliseconds');
    const differenceInMinutes = differenceInMilliseconds / 1000 / 60;
    return differenceInMinutes;
}

const AddAppointmentCalendarModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType } } = useAppSelector((state: RootState) => state.appointmentCalendarModal);
    const intl = useIntl()

    const [calendarView, setCalendarView] = useState<string>("timeGridWeek");
    const [date, setDate] = useState(new Date());

    const calendarRef = useRef<FullCalendar>(null);

    //const acceptingAppointmentDropDown: DropdownListModel | undefined | any = useAppSelector((state) => state.personApi.queries["acceptingAppointmentDropDown({})"]?.data);

    const { data: getAcceptingAppointmentListData } = useAcceptingAppointmentDropDownQuery({},{ skip: open == false && modalType != AppointmentCalendarModalEnum.appointmentCalendar })

    const { values, setFieldValue } = useFormikContext<any>();

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


    const handleClose = () => {
        dispatch(closeCalendarModal())
    };

    const { isLoading: appointmentCalendarLoading, isFetching: appointmentCalendarFetching, data: appointmentCalendarData } = useGetAppointmentCalendarListQuery(
        { person_id: values.person_id }, { skip: !values.person_id && open == false && modalType != AppointmentCalendarModalEnum.appointmentCalendar })


    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <Dialog open={open && modalType == AppointmentCalendarModalEnum.appointmentCalendar} onClose={handleClose} fullScreen>
            {appointmentCalendarLoading || appointmentCalendarFetching ? <CustomScaleLoader /> : <Box sx={{ px: 3, py: 3 }}>
                <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 2 }}
                >
                    <Grid item>
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
                                    values.person_id ? { label: getAcceptingAppointmentListData?.data?.find((item: any) => item.value == values.person_id)?.label ?? "", value: getAcceptingAppointmentListData?.data?.find((item: any) => item.value == values.person_id)?.value ?? 0 } : null}
                                options={getAcceptingAppointmentListData?.data?.map((item: any) => ({
                                    value: item.value,
                                    label: item.label
                                }))}
                                onChange={(val: any) => {
                                    setFieldValue("person_id", val?.value);
                                    //getAppointmentCalendarList({ person_id: val?.value })
                                }}
                            />
                        </Typography>
                    </Grid>
                    <Grid item sx={{ mr: 1.5 }}>
                        <IconButton color="secondary" onClick={handleClose}>
                            <CloseSquare size={64} />
                        </IconButton>
                    </Grid>
                </Grid>
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
                        editable={false}
                        droppable={false}
                        selectable={true}
                        selectMirror={true}
                        selectMinDistance={1}
                        events={appointmentCalendarData?.data as EventSourceInput ?? []}
                        ref={calendarRef}
                        rerenderDelay={10}
                        initialDate={date}
                        initialView={calendarView}
                        dayMaxEventRows={3}
                        eventDisplay="block"
                        headerToolbar={false}
                        allDayMaintainDuration
                        eventResizableFromStart
                        scrollTime={"08:00:00"}
                        noEventsText={intl.formatMessage({ id: "noEventsText" })}
                        moreLinkText={intl.formatMessage({ id: "more" })}
                        allDayText='Tüm'
                        locale={"tr"}
                        select={(val) => {
                            setFieldValue("appointment_start", dayjs(val.startStr).format('YYYY-MM-DD HH:mm:ss'));
                            const calc = durationCalc(val.startStr, val.endStr);
                            setFieldValue("appointment_duration", calc);
                            handleClose();
                        }}
                        dateClick={(val) => {
                            setFieldValue("appointment_start", dayjs(val.dateStr).format('YYYY-MM-DD HH:mm:ss'));
                            setFieldValue("appointment_duration", 30);
                            handleClose();
                        }}
                        //eventDrop={handleEventUpdate}
                        //eventClick={handleEventSelect}
                        //eventResize={handleEventUpdate}
                        //height={matchDownSM ? 'auto' : 720}
                        //height={"78vh"}
                        height={'100vh'}
                        plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                    />
                </CalendarStyled>
            </Box>}
        </Dialog>
    )
}

export default AddAppointmentCalendarModal