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
    appointment_start: string
    appointment_process?: AppointmentProcess[] | null
    file_name: string
    object_name: string
    object_size: string
    object_mime: string
    created_at: string
    url: string
    islemler?: string
}

export interface AppointmentProcess {
    appointment_process_history_id: number
    appointment_process_history_name: string
}
