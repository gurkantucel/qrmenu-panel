export interface PatientHealthInformationModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    data: PatientHealthInformationData
}

export interface PatientHealthInformationData {
    person_health_information_id: number
    patient_id: number
    patient_name: string
    patient_surname: string
    blood_type_id: number
    blood_type_name: string
    height: string
    weight: string
    created_at: string
    updated_at: string
    deleted_at: any
    created_by: any
    created_person: any
    updated_by: number
    updated_person: string
    status: boolean
}

export interface PatientHealtInformationUpdateBodyModel {
    patient_health_information_id: number | string | null
    patient_id: number | string | null
    blood_type_id: number | string | null
    height: number | string | null
    weight: number | string | null
    status: boolean
  }
  
