import * as Yup from 'yup';

const newAppointmentSchema = Yup.object({
    patient_id: Yup.number().nullable(),
    patient_name: Yup.string().nullable().when("patient_id", {
        is: (v: any) => v === null || undefined,
        then: (schema) => Yup.string().min(1, 'Hasta adı zorunludur').required('Hasta adı zorunludur'),
    }),
    patient_surname: Yup.string().nullable().when("patient_id", {
        is: (v: any) => v === null || undefined,
        then: (schema) => Yup.string().min(1, 'Hasta soyadı zorunludur').required('Hasta soyadı zorunludur'),
    }),
    patient_phone_code: Yup.string().nullable().when("patient_id", {
        is: (v: any) => v === null || undefined,
        then: (schema) => Yup.string().min(2, 'Hasta telefon numarası zorunludur').required('Hasta telefon numarası zorunludur'),
    }),
    patient_phone_number: Yup.string().nullable().when("patient_id", {
        is: (v: any) => v === null || undefined,
        then: (schema) => Yup.string().min(10, 'Hasta telefon numarası zorunludur').required('Hasta telefon numarası zorunludur'),
    }),
    person_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    appointment_status_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    appointment_start: Yup.string().required("Bu alan zorunlu")
})

const newAppointmentProcessTypeSchema = Yup.object({
    data: Yup.array(Yup.object({
        appointment_process_id: Yup.number().required("Bu alan zorunlu"),
        amount: Yup.number().required("Bu alan zorunlu")
    }))
})

const updateAppointmentProcessTypeSchema = Yup.object({
    amount: Yup.number().required("Bu alan zorunlu")
})

const newAppointmentProcessSchema = Yup.object({
    name: Yup.string().min(1, "Bu alan zorunlu").max(50, "Bu alan zorunlu").required("Bu alan zorunlu"),
    code: Yup.string().min(1, "Bu alan zorunlu").max(10, "Bu alan zorunlu").required("Bu alan zorunlu"),
    currency_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    amount: Yup.number().min(0,"Minumum 0 girin.").required("Bu alan zorunlu"),
    vat: Yup.number().nullable().min(0,"Minumum 0 girin."),
    appointment_process_type_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    sub_appointment_process: Yup.array(Yup.number()).nullable().when("appointment_process_type_id", {
        is: (v: any) => v === 3,
        then: (schema) => Yup.array(Yup.number()).required("Bu alan zorunlu"),
    })
})

export { newAppointmentSchema, newAppointmentProcessTypeSchema, updateAppointmentProcessTypeSchema, newAppointmentProcessSchema }