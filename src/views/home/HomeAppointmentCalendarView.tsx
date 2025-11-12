import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { Box, SpeedDial, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import CalendarStyled from 'sections/apps/calendar/CalendarStyled';
import { EventSourceInput } from '@fullcalendar/core';
//import { Theme } from '@mui/material/styles';
import { useIntl } from 'react-intl';
import Toolbar from 'sections/apps/calendar/Toolbar';
import Select from 'react-select'
import MainCard from 'components/MainCard';
import { useAcceptingAppointmentDropDownQuery } from 'reduxt/features/person/person-api';
import CustomScaleLoader from 'components/CustomScaleLoader';
import { getCookie } from 'cookies-next';
import { Person } from 'reduxt/features/auth/models/auth-models';
import { Add } from 'iconsax-react';
import AddAppointmentModal from 'views/appointment/AddAppointmentModal';
import { useAppDispatch } from 'reduxt/hooks';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import { useRouter } from 'next/navigation';
import { useGetAppointmentCalendarListQuery } from 'reduxt/features/branch/appointment-api';

const HomeAppointmentCalendarView = () => {
    //const matchDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const [personId, setPersonId] = useState<string | null>()

    const intl = useIntl()
    const dispatch = useAppDispatch();
    const [calendarView, setCalendarView] = useState<string>("dayGridMonth");
    const [date, setDate] = useState(new Date());
    const calendarRef = useRef<FullCalendar>(null);

    const navigate = useRouter();

    const { isLoading: getAcceptingAppointmentListLoading, data: getAcceptingAppointmentListData } = useAcceptingAppointmentDropDownQuery({})

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

    const handleEventClick = (clickInfo: any) => {
        if (clickInfo.event != null) {
            const appointmentId = clickInfo.event.id;
            const patientId = clickInfo.event.extendedProps.patient_id;
            //console.log(`dietician/app/appointments/${appointmentId}?patient=${patientId}`);
            navigate.push(`appointment/${appointmentId}?patient=${patientId}`)
        }
    }

    const { isLoading: appointmentCalendarLoading, isFetching: appointmentCalendarFetching, data: appointmentCalendarData } = useGetAppointmentCalendarListQuery(
        { person_id: personId }, { skip: !personId })

    /*const [getAppointmentCalendarList, {
        data: appointmentCalendarData,
        isLoading: appointmentCalendarLoading,
        isFetching: appointmentCalendarFetching
    }] = useLazyGetAppointmentCalendarListQuery();*/

    useEffect(() => {
        if (getAcceptingAppointmentListData?.status && getAcceptingAppointmentListData.data != null) {
            const cookieValue = getCookie("person");
            if (cookieValue != null) {
                var personCookieValue = JSON.parse(cookieValue) as Person;
                var personFilter = getAcceptingAppointmentListData?.data.find((item) => item.value == personCookieValue.person_id)
                if (personFilter != null) {
                    setPersonId(personFilter.value)
                } else {
                    setPersonId(getAcceptingAppointmentListData?.data[0].value)
                }
            } else {
                setPersonId(getAcceptingAppointmentListData?.data[0].value)
            }
        }
    }, [getAcceptingAppointmentListData])

    return (
        <>
            <AddAppointmentModal page='home' />
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
                                setPersonId(val?.value);
                                //getAppointmentCalendarList({ person_id: val?.value })
                            }}
                        />
                    </Typography>
                }
            >
                {appointmentCalendarLoading || appointmentCalendarFetching || getAcceptingAppointmentListLoading ? <CustomScaleLoader /> :
                    <Box sx={{ px: 0, pb: 2 }}>
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
                                selectable={false}
                                events={appointmentCalendarData?.data as EventSourceInput ?? []}
                                ref={calendarRef}
                                rerenderDelay={10}
                                initialDate={date}
                                initialView={calendarView}
                                allDayText='Tüm'
                                scrollTime={"08:00:00"}
                                noEventsText={intl.formatMessage({ id: "noEventsText" })}
                                moreLinkText={intl.formatMessage({ id: "more" })}
                                dayMaxEventRows={3}
                                eventDisplay="block"
                                headerToolbar={false}
                                allDayMaintainDuration
                                eventResizableFromStart
                                locale={"tr"}
                                //eventContent={renderEventContent}
                                select={(val) => {
                                }}
                                //eventDrop={handleEventUpdate}
                                eventClick={handleEventClick}
                                //eventResize={handleEventUpdate}
                                //height={matchDownSM ? 'auto' : 720}
                                //height={matchDownSM ? 'auto' : 'auto'}
                                height={'auto'}
                                plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                            />
                        </CalendarStyled>
                        <Tooltip title={intl.formatMessage({ id: "newAppointment" })}>
                            <SpeedDial
                                ariaLabel="add-event-fab"
                                sx={{ display: 'inline-flex', position: 'sticky', bottom: 24, left: '100%', transform: 'translate(-50%, -50% )' }}
                                icon={<Add />}
                                onClick={() => {
                                    dispatch(setModal({
                                        open: true,
                                        modalType: ModalEnum.newAppointment
                                    }))
                                }}
                            />
                        </Tooltip>
                    </Box>}
            </MainCard>
        </>
    )
}

export default HomeAppointmentCalendarView

/*function renderEventContent(eventInfo: EventContentArg) {
    if (eventInfo.view.type == "listWeek") {
        return (
            <div style={{ textDecoration: eventInfo.backgroundColor == "#2ca87f" ? "line-through" : "none" }}>
                <b>{eventInfo.timeText}</b>
                <label>{eventInfo.event.title}</label>
            </div>
        )
    }
    return (
        <Tooltip title="Delete">
            <>
                <b style={{ marginRight: "2px" }}>{eventInfo.timeText}</b>
                <label>{eventInfo.event.title}</label>
            </>
        </Tooltip>
    )
}*/