import { useSearchParams, useParams } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Grid, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import MainCard from 'components/MainCard'
import { Add, DocumentDownload, Trash } from 'iconsax-react';
import { useAppDispatch } from 'reduxt/hooks';
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
import dayjs from 'dayjs';
import { PatientFile } from 'reduxt/features/patient/models/patient-file-model';
import { useLazyGetPatientFileListQuery } from 'reduxt/features/patient/patient-file-api';
import Link from 'next/link';
import { FileTypeBoxIcon } from 'utils/icons/file-type-box-icon';
import AddAppointmentFileModal from './AddAppointmentFileModal';
import DeleteAppointmentFileModal from './DeleteAppointmentFileModal';
//import AddPatientFileModal from './AddPatientFileModal';
//import DeletePatientFileModal from './DeletePatientFileModal';

const columnHelper = createColumnHelper<PatientFile>()

const handleDownload = (link:string,fileName:string) => {
    // Anchor tag oluşturma ve indirme tetikleme
    const downloadLink = document.createElement('a');
    downloadLink.href = link;
    downloadLink.download = fileName; // İndirilecek dosyanın adı
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const AppointmentFileTable = () => {

    const params = useParams<{ slug: string }>()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patient')

    const dispatch = useAppDispatch();
    const intl = useIntl()

    const [getPatientFileList, {
        data: getPatientFileListData,
        isFetching: isPatientFileFetching,
        isLoading: isPatientFileLoading
    }] = useLazyGetPatientFileListQuery();

    const columns = useMemo<ColumnDef<PatientFile, any>[]>(() => [
        columnHelper.accessor('file_name', {
            header: intl.formatMessage({ id: "fileName" }),
            cell: info => {
                return <Stack direction="row" spacing={1.5} alignItems="center">
                    <Link href={info.row.original.url} target='_blank'>
                        <FileTypeBoxIcon objectMime={info.row.original.object_mime} imageUrl={info.row.original.url} alt={info.renderValue()} />
                    </Link>
                    <Stack spacing={0}>
                        <Typography variant="subtitle2">{info.renderValue()}</Typography>
                    </Stack>
                </Stack>
            },
            footer: info => info.column.id,
        }),
        columnHelper.accessor('object_size', {
            header: intl.formatMessage({ id: "size" }),
            cell: info => {
                return <Typography>{info.renderValue() == null ? "-" : `${formatBytes(Number(info.renderValue()))}`}</Typography>
            },
            footer: info => info.column.id,
        }),
        columnHelper.accessor('object_mime', {
            header: intl.formatMessage({ id: "fileExtension" }),
            cell: info => info.renderValue() == null ? "-" : info.renderValue(),
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
                return <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                    <Tooltip title={intl.formatMessage({ id: "delete" })}>
                        <IconButton
                            color="error"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                dispatch(setModal({
                                    open: true, modalType: ModalEnum.deletePatientFile,
                                    id: params.slug,
                                    title: info.row.original.file_name,
                                    data: info.row.original
                                }))
                            }}
                        >
                            <Trash />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={intl.formatMessage({ id: "download" })}>
                        <IconButton
                            color="primary"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                handleDownload(info.row.original.url,info.row.original.file_name)
                            }}
                        >
                            <DocumentDownload />
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

    const tableData = useMemo(() => getPatientFileListData?.data.files ?? [], [getPatientFileListData?.data.files]);

    const table = useReactTable({
        data: tableData,
        columns,
        rowCount: getPatientFileListData?.data.files.length,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        columnResizeMode: "onChange"
    })

    useEffect(() => {
        getPatientFileList({ patient_id: `${patientId}`, appointment_id: params.slug })
    }, [patientId])

    return (
        <Grid item xs={12}>
            <MainCard
                sx={{ marginBottom: 3 }}
                title={intl.formatMessage({ id: "files" })}
                secondary={
                    <Button variant="dashed" startIcon={<Add />} onClick={() => {
                        dispatch(setModal({
                            open: true,
                            modalType: ModalEnum.newPatientFile,
                            id: params.slug,
                            data: {
                                patient_id: patientId,
                                appointment_id: params.slug
                            }
                        }))
                    }}>{intl.formatMessage({ id: "add" })}</Button>
                }
            >
            <AddAppointmentFileModal />
            <DeleteAppointmentFileModal />
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
                            {isPatientFileFetching || isPatientFileLoading ? <TableRow>
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
                                            <EmptyTable msg={isPatientFileFetching ? intl.formatMessage({ id: "loadingDot" }) : intl.formatMessage({ id: "noData" })} />
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>
        </Grid>
    )
}

export default AppointmentFileTable