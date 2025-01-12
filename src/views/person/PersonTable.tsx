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
  RowData,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react';
import { PersonListData } from 'reduxt/features/person/models/person-list-model';
import { useGetPersonListQuery } from 'reduxt/features/person/person-api';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box, Divider, Skeleton, Stack, Tooltip } from '@mui/material';
import { Edit, Eye, Key, Trash } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import AddPersonModal from './AddPersonModal';
import DeletePersonModal from './DeletePersonModal';
import { useAppDispatch } from 'reduxt/hooks';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import ViewPersonModal from './ViewPersonModal';
import UpdatePersonPasswordModal from './UpdatePersonPasswordModal';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select' | 'select2' | 'date'
  }
}

const columnHelper = createColumnHelper<PersonListData>()

const PersonTable = () => {

  const intl = useIntl()

  let breadcrumbLinks = [
    { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
    { title: `${intl.formatMessage({ id: "persons" })}` },
  ];

  const dispatch = useAppDispatch();

  /*const [getPersonList, {
    data: getPersonListData,
    isFetching: isPersonFetching,
    isLoading: isPersonLoading
  }] = useLazyGetPersonListQuery();*/

  const columns = useMemo<ColumnDef<PersonListData, any>[]>(() => [
    columnHelper.accessor('name', {
      header: intl.formatMessage({ id: "nameSurname" }),
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('person_type_name', {
      header: intl.formatMessage({ id: "personType" }),
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('email', {
      header: intl.formatMessage({ id: "email" }),
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('phone_number', {
      header: intl.formatMessage({ id: "phoneNumber" }),
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('accepting_appointment', {
      header: intl.formatMessage({ id: "acceptAppointments" }),
      cell: (info) => <Chip color={info.renderValue() == true ? "success" : "error"} label={info.renderValue() == true ? <FormattedMessage id='active' /> : <FormattedMessage id='passive' />} size="small" variant="light" />,
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
                dispatch(setModal({
                  open: true, modalType: ModalEnum.viewPerson,
                  id: info.row.original.person_id,
                }))
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
                  open: true, modalType: ModalEnum.newPerson,
                  id: info.row.original.person_id,
                  title: info.row.original.full_name
                }))
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: "changePassword" })}>
            <IconButton
              color="warning"
              onClick={(e: any) => {
                e.stopPropagation();
                dispatch(setModal({
                  open: true, modalType: ModalEnum.updatePersonPassword,
                  id: info.row.original.person_id,
                }))
              }}
            >
              <Key />
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: "delete" })}>
            <IconButton
              color="error"
              onClick={(e: any) => {
                e.stopPropagation();
                dispatch(setModal({
                  open: true, modalType: ModalEnum.deletePerson,
                  id: info.row.original.person_id,
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

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: getPersonListData, isLoading: isPersonLoading, isFetching: isPersonFetching } = useGetPersonListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    filterSearch: columnFilters?.map((item) => `${item.id}=${item.value}`).join('&')
  })

  const tableData = useMemo(() => getPersonListData?.data ?? [], [getPersonListData?.data]);

  const table = useReactTable({
    data: tableData,
    columns,
    onPaginationChange: setPagination,
    state: { columnFilters, pagination },
    rowCount: getPersonListData?.totalCount,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: false,
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <>
      <Breadcrumbs custom heading={`${intl.formatMessage({ id: "persons" })}`} links={breadcrumbLinks} />
      <MainCard content={false}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="end" sx={{ padding: 2 }}>
          <AddPersonModal />
          <DeletePersonModal />
          <ViewPersonModal />
          <UpdatePersonPasswordModal />
        </Stack>
        <ScrollX>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell key={header.id} {...header.column.columnDef.meta}>
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
                {isPersonFetching || isPersonLoading ? [0, 1, 2].map((item: number) => (
                  <TableRow key={item}>
                    {[0, 1, 2, 3, 4, 5].map((col: number) => (
                      <TableCell key={col}>
                        <Skeleton animation="wave" />
                      </TableCell>
                    ))}
                  </TableRow>
                )) :
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
                        <EmptyTable msg={isPersonFetching ? <FormattedMessage id='loadingDot' /> : <FormattedMessage id='noData' />} />
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
                  getPageCount: table.getPageCount,
                  selectRowLength: table.getRowModel().rows.length,
                  totalCount: table.getRowCount()
                }}
              />
            </Box>
          </>
        </ScrollX>
      </MainCard>
    </>
  )
}

export default PersonTable