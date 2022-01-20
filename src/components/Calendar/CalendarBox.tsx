/**
 * Calendar Box Component
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
// Material UI
import { Box, Typography } from '@mui/material';
// Component
const DateEventModal = React.lazy(() => import('./DateEventModal'));

/**
 * Interface for the Component's props
 */
interface CalendarBoxProps {
  date: number;
  dateString: string;
  eventList: { id: string; name: string; category: string }[];
}

// Styles
const calendarBoxStyle = {
  backgroundColor: 'white',
  padding: '2px',
  overflow: 'hidden',
};

// Color of event block with respect to the category of event
const colorMap: { [index: string]: string } = {
  정기모임: 'gold',
  비대면: 'greenyellow',
  etc: 'lightpink',
  more: 'white',
};

/**
 * Function to generate style properties of each event entry
 *
 * @param {string} category event's category
 * @param {boolean} finishedRender Whether render is finished
 * @return {object} Style object of event entry
 */
function styleProvider(category: string, finishedRender: boolean): object {
  return {
    opacity: finishedRender ? 1 : 0,
    width: '100%',
    backgroundColor: colorMap[category] ? colorMap[category] : colorMap.etc,
    padding: category === 'more' ? '1px 2px' : '2px 3px',
    margin: '2px 0',
    borderRadius: '3px',
  };
}

/**
 * React Functional Component to generate calendar box representing each date
 *
 * @param {CalendarBoxProps} props Properties that passed from the parent
 *   Component.
 * @return {React.ReactElement} Renders CalendarBox
 */
function CalendarBox(props: CalendarBoxProps): React.ReactElement {
  // Props
  const { date, eventList, dateString } = props;
  // States
  const [numEventEntry, setNumEventEntry] = React.useState(Number.MAX_VALUE);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [boxSize, setBoxSize] = React.useState(0);
  const [dateSize, setDateSize] = React.useState(0);
  const [eventSize, setEventSize] = React.useState(0);
  const [finishedRender, setFinishedRender] = React.useState(false);
  // Ref
  const boxRef = React.useRef(null);
  const dateRef = React.useRef(null);
  const eventRef = React.useRef(null);

  // Calculate how many event entry can be displayed in the box
  const updateElemSize = React.useCallback((): void => {
    // When no eventRef boxRef, or dateRef set, do nothing
    if (!eventRef.current || !boxRef.current || !dateRef.current) {
      return;
    }

    // Retrieve heights
    setBoxSize((boxRef.current as { clientHeight: number }).clientHeight);
    setEventSize(
      (eventRef.current as { clientHeight: number }).clientHeight + 2
    );
    setDateSize((dateRef.current as { clientHeight: number }).clientHeight);
  }, []);

  // Add event listener to get element size on resize
  React.useEffect(() => {
    // Mount eventListener
    window.addEventListener('resize', updateElemSize);

    // Remove eventListener when component unmounts
    return (): void => {
      window.removeEventListener('resize', updateElemSize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update cell when parameter changes
  React.useEffect(() => {
    updateElemSize();

    // Calculate how many entry can fit in the box
    const numAvailable = Math.max(
      Math.floor((boxSize - dateSize) / eventSize), // Newly calculated
      1 // Minimum 1 event
    );
    const numEvents = Math.min(
      numAvailable,
      eventList.length // Maximum number of events
    );

    // re-render box when available num event changes
    if (!isNaN(numEvents) && numEvents > 0 && numEventEntry !== numEvents) {
      setNumEventEntry(numEvents);
      setFinishedRender(true);
    }

    return (): void => {
      if (finishedRender) {
        setFinishedRender(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxSize, dateSize, eventSize, numEventEntry, eventList.length]);

  /**
   * Method to generate eventEntry Elements
   *
   * @param {CalendarBoxProps.eventList} eventList List of event
   * @param {number} numSlot number of available event to be displayed
   * @return {React.ReactElement[]} Array of React Elements
   */
  const getEventEntryElem = React.useCallback(
    (
      eventList: CalendarBoxProps['eventList'],
      numSlot: number
    ): React.ReactElement[] => {
      const elements = [];
      const displayAll = eventList.length <= numSlot;
      const maxDisplay = displayAll ? eventList.length : numSlot - 1;

      // Display events
      for (let i = 0; i < maxDisplay; ++i) {
        const event = eventList[i];
        elements.push(
          <Box
            ref={i === 0 ? eventRef : null}
            sx={{ ...styleProvider(event.category, finishedRender) }}
            key={event.id}
          >
            <Typography component="div" variant="calendarEvent" noWrap>
              {event.name}
            </Typography>
          </Box>
        );
      }

      // Display how many events remaining
      if (!displayAll) {
        elements.push(
          <Box
            ref={numSlot === 1 ? eventRef : null}
            sx={{
              ...styleProvider('more', finishedRender),
              border: '1px solid black',
            }}
            key={`${date}-more`}
          >
            <Typography
              component="div"
              variant="calendarEvent"
              noWrap
              sx={{ fontWeight: 700 }}
            >
              {eventList.length - numSlot + 1} More
            </Typography>
          </Box>
        );
      }

      return elements;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [finishedRender]
  );

  // EventHandlers to open/close modal
  const handleOpen = (): void => {
    if (!modalOpen && date) {
      setModalOpen(true);
    }
  };
  const handleClose = (): void => {
    setModalOpen(false);
  };

  return (
    <Box ref={boxRef} sx={calendarBoxStyle} onClick={handleOpen}>
      {date && (
        <>
          <Typography ref={dateRef} variant="calendarBody" component="div">
            {date}
          </Typography>
          {getEventEntryElem(eventList, numEventEntry)}
          {modalOpen && (
            <DateEventModal
              isOpen={modalOpen}
              handleClose={handleClose}
              dateString={dateString}
              eventList={eventList}
              colorScheme={colorMap}
            />
          )}
        </>
      )}
    </Box>
  );
}

export default React.memo(CalendarBox);
