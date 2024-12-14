'use client';

import { useEffect, useRef, useState } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import SpeedDial from '@mui/material/SpeedDial';
import Box from '@mui/material/Box';

// third-party
import FullCalendar from '@fullcalendar/react';
import { EventInput } from '@fullcalendar/common';
import { DateSelectArg, EventClickArg, EventDropArg, EventSourceInput } from '@fullcalendar/core';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';

// project-imports
import { PopupTransition } from 'components/@extended/Transitions';
import CalendarStyled from 'sections/apps/calendar/CalendarStyled';
import Toolbar from 'sections/apps/calendar/Toolbar';
import AddEventForm from 'sections/apps/calendar/AddEventForm';

import { useGetEvents, updateEvent } from 'api/calender';

// types
import { Add } from 'iconsax-react';

// ==============================|| CALENDAR - MAIN ||============================== //

export default function Calendar() {
  const matchDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>();
  const [calendarView, setCalendarView] = useState<string>();
  const [date, setDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<null | { start: Date; end: Date }>(null);
  const calendarRef = useRef<FullCalendar>(null);

  const modalCallback = (openModal: boolean) => {
    // open/close modal based on dialog state
    if (!isModalOpen) {
      setSelectedEvent(null);
    }
    setModalOpen(openModal);
  };

  const handleModal = () => {
    if (isModalOpen) {
      setSelectedEvent(undefined);
    }
    setModalOpen(!isModalOpen);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <CalendarStyled>

        <FullCalendar
          weekends
          editable
          droppable
          selectable
          ref={calendarRef}
          rerenderDelay={10}
          initialDate={date}
          initialView={calendarView}
          dayMaxEventRows={3}
          eventDisplay="block"
          headerToolbar={false}
          allDayMaintainDuration
          eventResizableFromStart
          height={matchDownSM ? 'auto' : 720}
          plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
        />
      </CalendarStyled>

      {/* Dialog renders its body even if not open */}
      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        fullWidth
        onClose={handleModal}
        open={isModalOpen}
        sx={{ '& .MuiDialog-paper': { p: 0, bgcolor: 'secondary.lighter' } }}
      >
        <AddEventForm modalCallback={modalCallback} event={selectedEvent} range={selectedRange} onCancel={handleModal} />
      </Dialog>
      <Tooltip title="Add New Event">
        <SpeedDial
          ariaLabel="add-event-fab"
          sx={{ display: 'inline-flex', position: 'sticky', bottom: 24, left: '100%', transform: 'translate(-50%, -50% )' }}
          icon={<Add />}
          onClick={handleModal}
        />
      </Tooltip>
    </Box>
  );
}
