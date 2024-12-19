"use client"
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { EmptyTable, Filter, TablePagination } from 'components/third-party/react-table';

import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  HeaderGroup,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Box, Divider, Link, Stack, Tooltip } from '@mui/material';
import { Edit, Eye, Trash } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import AddPatientModal from './AddPatientModal';
import { useAppDispatch } from 'reduxt/hooks';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import { useLazyGetPatientListQuery } from 'reduxt/features/patient/patient-api';
import { PatientListData } from 'reduxt/features/patient/models/patient-list-model';
import DeletePatientModal from './DeletePatientModal';
import CustomScaleLoader from 'components/CustomScaleLoader';
import { useRouter } from 'next/navigation';

const columnHelper = createColumnHelper<PatientListData>()

const PatientTable = () => {

  const router = useRouter()
  const intl = useIntl()

  const dispatch = useAppDispatch();

  const [getPatientList, {
    data: getPatientListData,
    isFetching: isPatientFetching,
    isLoading: isPatientLoading
  }] = useLazyGetPatientListQuery();

  const columns = useMemo<ColumnDef<PatientListData, any>[]>(() => [
    columnHelper.accessor('full_name', {
      header: intl.formatMessage({ id: "nameSurname" }),
      cell: info => info.renderValue() == null ? "-" : <Link href={`patient/${info.row.original.patient_id}`}>
        {`${info.renderValue()}`}
      </Link>,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('gender_name', {
      header: intl.formatMessage({ id: "gender" }),
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('phone_number', {
      header: intl.formatMessage({ id: "phoneNumber" }),
      cell: info => info.renderValue() == null ? "-" : <Link href={`tel:${info.row.original.phone_code}${info.renderValue()}`}>
        {`${info.renderValue()}`}
      </Link>,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('age', {
      header: intl.formatMessage({ id: "age" }),
      cell: info => info.renderValue() == null ? "-" : info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('last_appointment_date', {
      header: intl.formatMessage({ id: "lastAppointmentDate" }),
      cell: info => info.renderValue() == null ? "-" : info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('status', {
      header: intl.formatMessage({ id: "status" }),
      cell: (info) => <Chip color={info.renderValue() == true ? "success" : "error"} label={info.renderValue() == true ? intl.formatMessage({ id: "active" }) : intl.formatMessage({ id: "passive" })} size="small" variant="light" />,
      footer: info => info.column.id,
      meta: {
        filterVariant: 'select',
      },
    }),
    columnHelper.accessor('islemler', {
      header: intl.formatMessage({ id: "actions" }),
      size: 10,
      enableColumnFilter: false,
      cell: (info) => {
        return <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
          <Tooltip title={intl.formatMessage({ id: "view" })}>
            <IconButton
              color="secondary"
              onClick={(e: any) => {
                e.stopPropagation();
                router.push(`patient/${info.row.original.patient_id}`)
              }}
            >
              <Eye />
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: "edit" })}>
            <IconButton
              color="primary"
              onClick={(e: any) => {
                e.stopPropagation();
                dispatch(setModal({
                  open: true, modalType: ModalEnum.newPatient,
                  id: info.row.original.patient_id,
                  title: info.row.original.full_name
                }))
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: "delete" })}>
            <IconButton
              color="error"
              onClick={(e: any) => {
                e.stopPropagation();
                dispatch(setModal({
                  open: true, modalType: ModalEnum.deletePatient,
                  id: info.row.original.patient_id,
                  title: info.row.original.full_name
                }))
              }}
            >
              <Trash />
            </IconButton>
          </Tooltip>
        </Stack>
      },
      footer: info => info.column.id,
      meta: {
        filterVariant: 'select',
      },
    }),
  ], [])

  const [columnFilters, setColumnFilters] = useState<any[]>([]);

  const tableData = useMemo(() => getPatientListData?.data ?? [], [getPatientListData?.data]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data: tableData,
    columns,
    onPaginationChange: setPagination,
    state: { columnFilters, pagination },
    rowCount: getPatientListData?.totalCount,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: false,
    onColumnFiltersChange: setColumnFilters,
    columnResizeMode: "onChange"
  })

  useEffect(() => {
    if (getPatientListData != null) {
      getPatientList({
        page: table.getState().pagination.pageIndex + 1,
        pageSize: table.getState().pagination.pageSize,
      })
    }
  }, [pagination])

  useEffect(() => {
    if (columnFilters.length > 0) {
      var stringParams = columnFilters.map((item) => `${item.id}=${item.value}`).join('&')
      getPatientList({ filterSearch: stringParams })
    } else {
      getPatientList({})
    }
  }, [columnFilters])

  return (
    <MainCard content={false}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="end" sx={{ padding: 2 }}>
        <AddPatientModal />
        <DeletePatientModal />
      </Stack>
      <ScrollX>
        <TableContainer component={Paper}>
          <Table size='small'>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta} style={{ width: `${header.getSize()}px` }}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} {...header.column.columnDef.meta}>
                      {header.column.getCanFilter() && <Filter column={header.column} table={table} />}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {isPatientFetching || isPatientLoading ? <TableRow>
                <TableCell colSpan={table.getAllColumns().length}>
                  <CustomScaleLoader />
                </TableCell>
              </TableRow> :
                table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length}>
                      <EmptyTable msg={isPatientFetching ? intl.formatMessage({ id: "loadingDot" }) : intl.formatMessage({ id: "noData" })} />
                    </TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <TablePagination
              {...{
                setPageSize: table.setPageSize,
                setPageIndex: table.setPageIndex,
                getState: table.getState,
                getPageCount: table.getPageCount
              }}
            />
          </Box>
        </>
      </ScrollX>
    </MainCard>
  )
}

export default PatientTable