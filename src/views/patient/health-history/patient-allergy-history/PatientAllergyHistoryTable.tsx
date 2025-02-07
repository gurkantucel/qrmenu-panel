import React, { useEffect, useMemo } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import MainCard from 'components/MainCard'
import { Add, Edit, Trash } from 'iconsax-react';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { useIntl } from 'react-intl';
import { ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import {
    ColumnDef,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    HeaderGroup,
    useReactTable,
} from '@tanstack/react-table'
import CustomScaleLoader from 'components/CustomScaleLoader';
import { EmptyTable, Filter } from 'components/third-party/react-table';
import { PatientTabEnum } from 'reduxt/features/definition/patientTabSlice';
import dayjs from 'dayjs';
import { PatientAllergyHistoryListData } from 'reduxt/features/patient/models/patient-allergy-history-model';
import { useLazyGetPatientAllergyHistoryListQuery } from 'reduxt/features/patient/allergy-history-api';
import AddPatientAllergyHistoryModal from './AddPatientAllergyHistoryModal';
import DeletePatientAllergyHistoryModal from './DeletePatientAllergyHistoryModal';

const columnHelper = createColumnHelper<PatientAllergyHistoryListData>()

const PatientAllergyHistoryTable = ({ params }: { params: { slug: string } }) => {
    const dispatch = useAppDispatch();
    const { data: { selectTab } } = useAppSelector((state: RootState) => state.patientTab);
    const intl = useIntl()

    const [getPatientAllergyHistoryList, {
        data: getPatientAllergyHistoryListData,
        isFetching: isPatientAllergyHistoryFetching,
        isLoading: isPatientAllergyHistoryLoading
    }] = useLazyGetPatientAllergyHistoryListQuery();

    const columns = useMemo<ColumnDef<PatientAllergyHistoryListData, any>[]>(() => [
        columnHelper.accessor('name', {
            header: intl.formatMessage({ id: "allergyName" }),
            cell: info => info.renderValue() == null ? "-" : info.renderValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('complications', {
            header: intl.formatMessage({ id: "complications" }),
            cell: info => info.renderValue() == null ? "-" : info.renderValue(),
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
        columnHelper.accessor('islemler', {
            header: intl.formatMessage({ id: "actions" }),
            size: 10,
            enableColumnFilter: false,
            cell: (info) => {
                return <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                    <Tooltip title={intl.formatMessage({ id: "edit" })}>
                        <IconButton
                            color="primary"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                dispatch(setModal({
                                    open: true,
                                    modalType: ModalEnum.newPatientAllergyHistory,
                                    id: info.row.original.patient_id,
                                    data: info.row.original
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
                                    open: true, modalType: ModalEnum.deletePatientAllergyHistory,
                                    id: info.row.original.patient_id,
                                    title: info.row.original.name,
                                    data: info.row.original
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

    const tableData = useMemo(() => getPatientAllergyHistoryListData?.data ?? [], [getPatientAllergyHistoryListData?.data]);

    const table = useReactTable({
        data: tableData,
        columns,
        rowCount: getPatientAllergyHistoryListData?.totalCount,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        columnResizeMode: "onChange"
    })

    useEffect(() => {
        if (selectTab == PatientTabEnum.saglik_gecmisi) {
            getPatientAllergyHistoryList({ patient_id: params.slug })
        }
    }, [selectTab])

    return (
        <MainCard
            sx={{ marginBottom: 3 }}
            title={intl.formatMessage({ id: "allergyHistory" })}
            secondary={
                <Button variant="dashed" startIcon={<Add />} onClick={() => {
                    dispatch(setModal({
                        open: true,
                        modalType: ModalEnum.newPatientAllergyHistory,
                        id: params.slug
                    }))
                }}>{intl.formatMessage({ id: "add" })}</Button>
            }
        >
            <AddPatientAllergyHistoryModal />
            <DeletePatientAllergyHistoryModal />
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
                        {isPatientAllergyHistoryFetching || isPatientAllergyHistoryLoading ? <TableRow>
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
                                        <EmptyTable msg={isPatientAllergyHistoryFetching ? intl.formatMessage({ id: "loadingDot" }) : intl.formatMessage({ id: "noData" })} />
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    )
}

export default PatientAllergyHistoryTable