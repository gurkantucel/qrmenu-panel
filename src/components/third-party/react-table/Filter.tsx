// material-ui
import Stack from '@mui/material/Stack';

// third-party
import { Column, RowData, Table } from '@tanstack/react-table';

// project-import
import DebouncedInput from './DebouncedInput';

// assets
import { Minus } from 'iconsax-react';
import { MenuItem, Select } from '@mui/material';
import { useIntl } from 'react-intl';

type NumberInputProps = {
  columnFilterValue: [number, number];
  getFacetedMinMaxValues: () => [number, number] | undefined;
  setFilterValue: (updater: any) => void;
};

// ==============================|| FILTER - NUMBER FIELD ||============================== //

function NumberInput({ columnFilterValue, getFacetedMinMaxValues, setFilterValue }: NumberInputProps) {
  const minOpt = getFacetedMinMaxValues()?.[0];
  const min = Number(minOpt ?? '');

  const maxOpt = getFacetedMinMaxValues()?.[1];
  const max = Number(maxOpt);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <DebouncedInput
        type="number"
        value={columnFilterValue?.[0] ?? ''}
        onFilterChange={(value) => setFilterValue((old: [number, number]) => [value, old?.[1]])}
        placeholder={`Min ${minOpt ? `(${min})` : ''}`}
        fullWidth
        inputProps={{ min: min, max: max }}
        size="small"
        startAdornment={false}
      />
      <>
        <Minus size="32" color="#FF8A65" variant="Outline" />
      </>
      <DebouncedInput
        type="number"
        value={columnFilterValue?.[1] ?? ''}
        onFilterChange={(value) => setFilterValue((old: [number, number]) => [old?.[0], value])}
        placeholder={`Max ${maxOpt ? `(${max})` : ''}`}
        fullWidth
        inputProps={{ min: min, max: max }}
        size="small"
        startAdornment={false}
      />
    </Stack>
  );
}

type TextInputProps = {
  columnId: string;
  columnFilterValue: string;
  setFilterValue: (updater: any) => void;
  header?: string;
  searchText?: string
};

// ==============================|| FILTER - TEXT FIELD ||============================== //

function TextInput({ columnId, columnFilterValue, header, searchText, setFilterValue }: TextInputProps) {
  const dataListId = columnId + 'list';

  return (
    <DebouncedInput
      type="text"
      fullWidth
      value={columnFilterValue ?? ''}
      onFilterChange={(value) => setFilterValue(value)}
      placeholder={`${searchText ?? "Search"} ${header}`}
      inputProps={{ list: dataListId }}
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
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

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
    <MenuItem value="-">{intl.formatMessage({id: "all"})}</MenuItem>
    <MenuItem value="true">{intl.formatMessage({id: "active"})}</MenuItem>
    <MenuItem value="false">{intl.formatMessage({id: "passive"})}</MenuItem>
  </Select> : typeof firstValue === 'number' ? (
    <NumberInput
      columnFilterValue={columnFilterValue as [number, number]}
      getFacetedMinMaxValues={column.getFacetedMinMaxValues}
      setFilterValue={column.setFilterValue}
    />
  ) : (
    <TextInput
      columnId={column.id}
      columnFilterValue={columnFilterValue as string}
      setFilterValue={column.setFilterValue}
      searchText={intl.formatMessage({id: "search"})}
      header={column.columnDef.header as string}
    />
  );
}
