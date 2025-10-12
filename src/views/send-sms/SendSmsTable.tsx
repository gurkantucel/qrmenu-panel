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
import { useIntl } from 'react-intl';
import { Box, Chip, Divider, Stack, Tooltip } from '@mui/material';
import { Eye } from 'iconsax-react';
import IconButton from 'components/@extended/IconButton';
import { useAppDispatch } from 'reduxt/hooks';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import CustomScaleLoader from 'components/CustomScaleLoader';
import dayjs from 'dayjs';
import { APP_DEFAULT_PATH } from 'config';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import Link from 'next/link';
import { useSendSmsListQuery } from 'reduxt/features/sms-integration/sms-integration-api';
import { SendSmsListData } from 'reduxt/features/sms-integration/models/sms-integration-model';
import ViewSendSmsModal from './ViewSendSmsModal';
import AddSendSmsModal from './AddSendSmsModal';

const columnHelper = createColumnHelper<SendSmsListData>()

const SendSmsTable = () => {

  const intl = useIntl()

  let breadcrumbLinks = [
    { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
    { title: `${intl.formatMessage({ id: "payments" })}` },
  ];

  const dispatch = useAppDispatch();

  const columns = useMemo<ColumnDef<SendSmsListData, any>[]>(() => [
    columnHelper.accessor('patient_full_name', {
      header: intl.formatMessage({ id: "patientNameSurname" }),
      cell: info => info.renderValue() == null ? "-" : <Link href={`patient/${info.row.original.patient_id}`} className='custom-link'>
        {`${info.renderValue()}`}
      </Link>,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('sms_notification_type_name', {
      header: intl.formatMessage({ id: "smsTemplate" }),
      cell: info => info.renderValue() == null ? "-" : info.renderValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('result_code', {
      header: intl.formatMessage({ id: "status" }),
      cell: (info) => <Chip color={info.renderValue() == "SUCCESS" ? "success" : "error"} label={info.renderValue() == "SUCCESS" ? intl.formatMessage({ id: "successful" }) : intl.formatMessage({ id: "unsuccessful" })} size="small" variant="light" />,
      footer: info => info.column.id,
    }),
    columnHelper.accessor('created_at', {
      header: intl.formatMessage({ id: "date" }),
      cell: info => info.renderValue() == null ? "-" : dayjs(info.renderValue()).format("DD.MM.YYYY"),
      footer: info => info.column.id,
      meta: {
        filterVariant: 'date',
      },
    }),
    columnHelper.accessor('islemler', {
      header: intl.formatMessage({ id: "actions" }),
      size: 10,
      enableColumnFilter: false,
      cell: (info) => {
        return <Stack direction="row" alignItems="start" justifyContent="start" spacing={0}>
          <Tooltip title={intl.formatMessage({ id: "view" })}>
            <IconButton
              color="secondary"
              onClick={(e: any) => {
                e.stopPropagation();
                dispatch(setModal({
                  open: true,
                  modalType: ModalEnum.viewSendSms,
                  id: info.row.original.sms_id,
                  title: `${info.row.original.patient_full_name}`,
                  data: info.row.original
                }))
              }}
            >
              <Eye />
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

  const {
    data: getSendSmsListData,
    isFetching: isPatientPaymentHistoryFetching,
    isLoading: isPatientPaymentHistoryLoading
  } = useSendSmsListQuery({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    //filterSearch: columnFilters?.map((item) => `${item.id}=${item.value}`).join('&')
    filterSearch: columnFilters?.filter((item) => item.value != "-").map((item) => `${item.id}=${item.value}`).join('&')
  });

  const tableData = useMemo(() => getSendSmsListData?.data ?? [], [getSendSmsListData?.data]);


  const table = useReactTable({
    data: tableData,
    columns,
    onPaginationChange: setPagination,
    state: { columnFilters, pagination },
    rowCount: getSendSmsListData?.totalCount,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: false,
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <>
      <Breadcrumbs custom heading={`${intl.formatMessage({ id: "sendSMS" })}`} links={breadcrumbLinks} />
      <MainCard content={false} >
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="end" sx={{ padding: 2 }}>
          {/*<AddPatientPaymentHistoryModal />
          <DeletePatientPaymentHistoryModal />
          <ViewPatientPaymentHistoryModal />
          <PatientPaymentUpdateStatusModal />*/}
          <AddSendSmsModal />
          <ViewSendSmsModal />
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
                {isPatientPaymentHistoryFetching || isPatientPaymentHistoryLoading ? <TableRow>
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
                        <EmptyTable msg={isPatientPaymentHistoryFetching ? intl.formatMessage({ id: "loadingDot" }) : intl.formatMessage({ id: "noData" })} />
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
    </>
  )
}

export default SendSmsTable