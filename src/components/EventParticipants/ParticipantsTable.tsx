/**
 * Table which display the participants information for the event
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import React from 'react';
// Material UI
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// Globally used Types
import ParticipantInfo from '../../globalType/ParticipantInfo';
// Components
import EditDeleteBtn from './EditDeleteBtn';
// Override CSS
import './ParticipantsTable.css';

// Type for the component's props
type ParticipantsTableProps = {
  eventId: string | number;
  participantsList: ParticipantInfo[];
  setModifiedFlagFunc: () => void;
};

// Styles
const styles = {
  commentCell: {
    maxHeight: 'inherit',
    height: '100%',
    width: '100%',
    whiteSpace: 'initial',
    lineHeight: '20px',
    overflow: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
};

/**
 * React Functional Component to generate DataGrid to display the participant's
 *   information.
 *
 * @param {ParticipantsTableProps} props Properties that passed from the parent
 *   Component.
 * @return {React.ReactElement} Renders ParticipantsTable
 */
function ParticipantsTable(props: ParticipantsTableProps): React.ReactElement {
  const { eventId, participantsList, setModifiedFlagFunc } = props;

  // Functions to render cell components
  const renderComments = React.useCallback(
    (cellValues): React.ReactElement => (
      <Box sx={styles.commentCell}>
        <Box sx={{ margin: 'auto', width: '100%' }}>{cellValues.value}</Box>
      </Box>
    ),
    []
  );
  const renderBtn = React.useCallback(
    (cellValues): React.ReactElement => (
      <EditDeleteBtn
        data={cellValues.row}
        eventId={eventId}
        setModifiedFlagFunc={setModifiedFlagFunc}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  // Column definition for the DataGrid
  const columnDef: GridColDef[] = [
    {
      field: 'participantName',
      headerName: 'Name',
      headerAlign: 'center',
      headerClassName: 'ParticipantsTable-cellStyle',
      minWidth: 100,
    },
    {
      field: 'email',
      headerName: 'Email',
      headerAlign: 'center',
      headerClassName: 'ParticipantsTable-cellStyle',
      minWidth: 200,
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      headerAlign: 'center',
      headerClassName: 'ParticipantsTable-cellStyle',
      minWidth: 140,
    },
    {
      field: 'comment',
      headerName: 'Comment',
      headerAlign: 'center',
      headerClassName: 'ParticipantsTable-cellStyle',
      minWidth: 200,
      flex: 1,
      renderCell: renderComments,
    },
    {
      field: 'editBtn',
      headerName: 'Edit / Delete',
      headerAlign: 'center',
      headerClassName: 'ParticipantsTable-cellStyle',
      minWidth: 120,
      align: 'center',
      renderCell: renderBtn,
    },
  ];

  return (
    <DataGrid
      rows={participantsList}
      columns={columnDef}
      density="compact"
      rowHeight={80}
      showCellRightBorder
      showColumnRightBorder
    />
  );
}

export default ParticipantsTable;
