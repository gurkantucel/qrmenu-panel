// third-party
import { Column, RowData, Table } from '@tanstack/react-table';

// project-import
import DebouncedInput from './DebouncedInput';

// assets
import { InputBaseComponentProps, MenuItem, Select } from '@mui/material';
import { useIntl } from 'react-intl';


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
};

// ==============================|| FILTER - INPUT ||============================== //

export default function Filter<T extends RowData>({ column, table }: Props<T>) {
  const intl = useIntl()
  //const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();
  const meta = column.columnDef?.meta?.filterVariant;

  return meta == "select" ? <Select
    sx={{
      '& .MuiSelect-select': {
        padding: "10px 10px 10px 12px"
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
        padding: "10px 10px 10px 12px"
      }
    }}
    MenuProps={{
      style: { zIndex: 9999, },
    }}
    defaultValue={"1"}
    onChange={(event) => {
      column.setFilterValue(event.target.value);
    }}>
    <MenuItem value="-">{intl.formatMessage({ id: "all" })}</MenuItem>
    <MenuItem value="1">{intl.formatMessage({ id: "waiting" })}</MenuItem>
    <MenuItem value="4">{intl.formatMessage({ id: "postponed" })}</MenuItem>
    <MenuItem value="5">{intl.formatMessage({ id: "delayed" })}</MenuItem>
    <MenuItem value="2">{intl.formatMessage({ id: "completed" })}</MenuItem>
    <MenuItem value="6">{intl.formatMessage({ id: "inComplete" })}</MenuItem>
    <MenuItem value="3">{intl.formatMessage({ id: "cancelled" })}</MenuItem>
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
      inputProps={{min: 0}}
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
