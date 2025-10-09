// third-party
import { Column, RowData, Table } from '@tanstack/react-table';

// project-import
import DebouncedInput from './DebouncedInput';

// assets
import { InputBaseComponentProps, MenuItem, Select } from '@mui/material';
import { useIntl } from 'react-intl';
import { DropdownListData } from 'utils/models/dropdown-list-model';


// ==============================|| FILTER - NUMBER FIELD ||============================== //

type TextInputProps = {
  columnId: string;
  columnFilterValue: string;
  setFilterValue: (updater: any) => void;
  header?: string;
  searchText?: string
  type?: string
  inputProps?: InputBaseComponentProps | undefined
};

// ==============================|| FILTER - TEXT FIELD ||============================== //

function TextInput({ columnId, columnFilterValue, header, searchText, setFilterValue, type, inputProps }: TextInputProps) {
  const dataListId = columnId + 'list';

  return (
    <DebouncedInput
      type={type ?? "text"}
      fullWidth
      value={columnFilterValue ?? ''}
      onFilterChange={(value) => setFilterValue(value)}
      placeholder={`${searchText ?? "Search"} ${header}`}
      inputProps={{ ...inputProps, list: dataListId }}
      size="small"
      startAdornment={false}
    />
  );
}

type Props<T extends RowData> = {
  column: Column<T, unknown>;
  table: Table<T>;
  getAppointmentStatusData?: DropdownListData[]
  getAppointmentTypeData?: DropdownListData[]
  getPersonData?: DropdownListData[]
  getGenderData?: DropdownListData[]
};

// ==============================|| FILTER - INPUT ||============================== //

export default function Filter<T extends RowData>({ column, table, getAppointmentStatusData, getAppointmentTypeData, getPersonData, getGenderData }: Props<T>) {
  const intl = useIntl()
  //const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();
  const meta = column.columnDef?.meta?.filterVariant;

  return meta == "select" ? <Select
    sx={{
      '& .MuiSelect-select': {
        padding: "10px 10px 10px 12px",
        textTransform: "none"
      }
    }}
    MenuProps={{
      style: { zIndex: 9999, },
    }}
    defaultValue={"-"}
    onChange={(event) => {
      column.setFilterValue(event.target.value);
    }}>
    <MenuItem value="-">{intl.formatMessage({ id: "all" })}</MenuItem>
    <MenuItem value="true">{intl.formatMessage({ id: "active" })}</MenuItem>
    <MenuItem value="false">{intl.formatMessage({ id: "passive" })}</MenuItem>
  </Select> : meta == "appointmentStatus" ? <Select
    sx={{
      width: '100%',
      '& .MuiSelect-select': {
        width: "100% !important",
        padding: "10px 10px 10px 12px",
        textTransform: "none"
      }
    }}
    MenuProps={{
      style: { zIndex: 9999, },
    }}
    defaultValue={"-"}
    onChange={(event) => {
      column.setFilterValue(event.target.value);
    }}>
    <MenuItem value="-">{intl.formatMessage({ id: "all" })}</MenuItem>
    {getAppointmentStatusData?.map((item) => (
      <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
    ))}
  </Select> : meta == "appointmentType" ? <Select
    sx={{
      width: '100%',
      '& .MuiSelect-select': {
        width: "100% !important",
        padding: "10px 10px 10px 12px",
        textTransform: "none"
      }
    }}
    MenuProps={{
      style: { zIndex: 9999, },
    }}
    defaultValue={"-"}
    onChange={(event) => {
      column.setFilterValue(event.target.value);
    }}>
    <MenuItem value="-">{intl.formatMessage({ id: "all" })}</MenuItem>
    {getAppointmentTypeData?.map((item) => (
      <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
    ))}
  </Select> : meta == "personNameSurname" ? <Select
    sx={{
      width: '100%',
      '& .MuiSelect-select': {
        width: "100% !important",
        padding: "10px 10px 10px 12px",
        textTransform: "none"
      }
    }}
    MenuProps={{
      style: { zIndex: 9999, },
    }}
    defaultValue={"-"}
    onChange={(event) => {
      column.setFilterValue(event.target.value);
    }}>
    <MenuItem value="-">{intl.formatMessage({ id: "all" })}</MenuItem>
    {getPersonData?.map((item) => (
      <MenuItem key={item.value} value={item.label}>{item.label}</MenuItem>
    ))}
  </Select> : meta == "gender" ? <Select
    sx={{
      width: '100%',
      '& .MuiSelect-select': {
        width: "100% !important",
        padding: "10px 10px 10px 12px",
        textTransform: "none"
      }
    }}
    MenuProps={{
      style: { zIndex: 9999, },
    }}
    defaultValue={"-"}
    onChange={(event) => {
      column.setFilterValue(event.target.value);
    }}>
    <MenuItem value="-">{intl.formatMessage({ id: "all" })}</MenuItem>
    {getGenderData?.map((item) => (
      <MenuItem key={item.value} value={item.label}>{item.label}</MenuItem>
    ))}
  </Select> : meta == "movementType" ? <Select
    sx={{
      '& .MuiSelect-select': {
        padding: "10px 10px 10px 12px",
        textTransform: "none"
      }
    }}
    MenuProps={{
      style: { zIndex: 9999, },
    }}
    defaultValue={"-"}
    onChange={(event) => {
      column.setFilterValue(event.target.value);
    }}>
    <MenuItem value="-">{intl.formatMessage({ id: "all" })}</MenuItem>
    <MenuItem value="true">{intl.formatMessage({ id: "increase" })}</MenuItem>
    <MenuItem value="false">{intl.formatMessage({ id: "decrease" })}</MenuItem>
  </Select> : meta == "date" ? (
    <TextInput
      type='date'
      columnId={column.id}
      columnFilterValue={columnFilterValue as string}
      setFilterValue={column.setFilterValue}
      searchText={intl.formatMessage({ id: "search" })}
      header={column.columnDef.header as string}
    />
  ) : meta == "number" ? (
    <TextInput
      type='number'
      columnId={column.id}
      columnFilterValue={columnFilterValue as string}
      setFilterValue={column.setFilterValue}
      searchText={intl.formatMessage({ id: "search" })}
      header={column.columnDef.header as string}
      inputProps={{ min: 0 }}
    />
  ) : (
    <TextInput
      columnId={column.id}
      columnFilterValue={columnFilterValue as string}
      setFilterValue={column.setFilterValue}
      searchText={intl.formatMessage({ id: "search" })}
      header={column.columnDef.header as string}
    />
  );
}
