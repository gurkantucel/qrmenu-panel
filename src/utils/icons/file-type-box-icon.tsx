import PdfFileBoxIcon from 'utils/icons/pdf-file-box-icon';
import Mp4FileBoxIcon from 'utils/icons/mp4-file-box-icon';
import XlsFileBoxIcon from 'utils/icons/xls-file-box-icon';
import DocxFileBoxIcon from 'utils/icons/docx-file-box-icon';
import CsvFileBoxIcon from 'utils/icons/csv-file-box-icon';
import PptFileBoxIcon from 'utils/icons/ppt-file-box-icon';
import FileBoxIcon from 'utils/icons/file-box-icon';
import Image from 'next/image';

type Props = {
    objectMime: string, 
    imageUrl?: string, 
    alt?: string
}

export const FileTypeBoxIcon = (props:Props) => {
    switch (props.objectMime) {
        case 'doc':
        case 'docx':
            return <DocxFileBoxIcon />
        case 'pdf':
            return <PdfFileBoxIcon />
        case 'txt':
            return <FileBoxIcon />
        case 'xls':
        case 'xlsx':
            return <XlsFileBoxIcon />
        case 'csv':
            return <CsvFileBoxIcon />;
        case 'ppt':
        case 'pptx':
            return <PptFileBoxIcon />
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
            return props.imageUrl !=null ? <Image src={props.imageUrl ?? "#"} alt={props.alt ?? ""} width={128} height={128} style={{ objectFit: "none" }} /> : <></>
        case 'mp4':
        case 'mov':
        case 'avi':
        case 'mkv':
        case 'webm':
            return <Mp4FileBoxIcon />;
        default:
            return <p></p>;
    }
}