"use client"
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
import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box, Button, Chip, Divider, Skeleton, Stack, Tooltip } from '@mui/material';
import { Add, Edit, Eye, Trash } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import { useAppDispatch } from 'reduxt/hooks';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import DeleteDietTemplateModal from './DeleteDietTemplateModal';
import { useGetDieticianPatientDietTemplateListQuery } from 'reduxt/features/patient/dietician-patient-diet-template-api';
import { DieticianPatientDietTemplateListData } from 'reduxt/features/patient/models/dietician-patient-diet-template-list-model';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import CreateDieticianPatientDietTemplateModal from './CreateDieticianPatientDietTemplateModal';
import ViewDieticianPatientDietTemplateModal from './ViewDieticianPatientDietTemplateModal';

const columnHelper = createColumnHelper<DieticianPatientDietTemplateListData>()

const DietListTable = () => {

  const params = useParams<{ slug: string }>()
  const intl = useIntl()

  const dispatch = useAppDispatch();

  const columns = useMemo<ColumnDef<DieticianPatientDietTemplateListData, any>[]>(() => [
    columnHelper.accessor('diet_template_name', {
      header: intl.formatMessage({ id: "name" }),
      cell: info => info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('start_date', {
      header: intl.formatMessage({ id: "startDate" }),
      cell: info => info.renderValue() == null ? "-" : dayjs(info.renderValue()).format("DD.MM.YYYY"),
      footer: info => info.column.id,
      meta: {
        filterVariant: 'date',
      },
    }),
    columnHelper.accessor('end_date', {
      header: intl.formatMessage({ id: "endDate" }),
      cell: info => info.renderValue() == null ? "-" : dayjs(info.renderValue()).format("DD.MM.YYYY"),
      footer: info => info.column.id,
      meta: {
        filterVariant: 'date',
      },
    }),
    columnHelper.accessor('created_by', {
      header: intl.formatMessage({ id: "createdBy" }),
      cell: info => info.renderValue() != null ? info.row.original.created_user : "-",
      footer: info => info.column.id,
    }),
    columnHelper.accessor('status', {
      header: intl.formatMessage({ id: "status" }),
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
                  open: true, modalType: ModalEnum.viewDieticianPatientDietTemplate,
                  id: info.row.original.patient_diet_template_id,
                  title: info.row.original.diet_template_name,
                  data: info.row.original
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
                  open: true, modalType: ModalEnum.newDieticianPatientDietTemplate,
                  id: info.row.original.patient_diet_template_id,
                  data: info.row.original,
                  title: info.row.original.patient_full_name
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
                  open: true, modalType: ModalEnum.deleteDieticianPatientDietTemplate,
                  id: info.row.original.patient_diet_template_id,
                  title: info.row.original.diet_template_name,
                  data: { patient_id: info.row.original.patient_id, person_id: info.row.original.person_id }
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

  const [columnFilters, setColumnFilters] = useState<any[]>([{ "id": "patient_id", "value": params.slug }]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: getDietTemplateListData, isLoading: isDietTemplateLoading, isFetching: isDietTemplateFetching } = useGetDieticianPatientDietTemplateListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    filterSearch: columnFilters?.filter((item) => item.value != "-").map((item) => `${item.id}=${item.value}`).join('&')
  })

  const tableData = useMemo(() => getDietTemplateListData?.data ?? [], [getDietTemplateListData?.data]);

  const table = useReactTable({
    data: tableData,
    columns,
    onPaginationChange: setPagination,
    state: { columnFilters, pagination },
    rowCount: getDietTemplateListData?.totalCount,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: false,
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <>
      <MainCard
        sx={{ marginBottom: 3 }}
        contentSX={{
          padding: 0, '&:last-child': {
            paddingBottom: 0
          }
        }}
        title={intl.formatMessage({ id: "dietTemplate" })} secondary={
          <Button variant="dashed" startIcon={<Add />} onClick={() => {
            dispatch(setModal({
              open: true,
              modalType: ModalEnum.newDieticianPatientDietTemplate,
              id: params.slug
            }))
          }}>{intl.formatMessage({ id: "add" })}</Button>
        }>
        <CreateDieticianPatientDietTemplateModal />
        <DeleteDietTemplateModal />
        <ViewDieticianPatientDietTemplateModal />
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
                {isDietTemplateLoading || isDietTemplateFetching ? [0, 1, 2].map((item: number) => (
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
                        <EmptyTable msg={isDietTemplateFetching ? <FormattedMessage id='loadingDot' /> : <FormattedMessage id='noData' />} />
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

export default DietListTable