export interface PatientFileListModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    data: PatientFileListData
}

export interface PatientFileListData {
    files: PatientFile[]
}

export interface PatientFile {
    patient_file_id: number
    type: string
    appointment_id: any
    file_name: string
    object_name: string
    object_size: string
    object_mime: string
    created_at: string
    url: string
    islemler?:string
}
