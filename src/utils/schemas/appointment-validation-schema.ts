import * as Yup from 'yup';

const newAppointmentSchema = Yup.object({
    patient_id: Yup.string().nullable(),
    patient_name: Yup.string().nullable().when("patient_id", {
        is: (v: any) => v === null || undefined,
        then: (schema) => Yup.string()
            .matches(/^[a-zA-ZğüşıöçİĞÜŞÖÇ]+(?: [a-zA-ZğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
            .min(1, "Çok Kısa")
            .max(100, "Çok Uzun")
            .required('Hasta adı zorunludur')
    }),
    patient_surname: Yup.string().nullable().when("patient_id", {
        is: (v: any) => v === null || undefined,
        then: (schema) => Yup.string()
        .matches(/^[a-zA-ZğüşıöçİĞÜŞÖÇ]+(?: [a-zA-ZğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(1, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required('Hasta soyadı zorunludur')
    }),
    patient_phone_code: Yup.string().nullable().when("patient_id", {
        is: (v: any) => v === null || undefined,
        then: (schema) => Yup.string().min(2, 'Hasta telefon numarası zorunludur').required('Hasta telefon numarası zorunludur'),
    }),
    patient_phone_number: Yup.string().nullable().when("patient_id", {
        is: (v: any) => v === null || undefined,
        then: (schema) => Yup.string().min(10, "Telefon numarası girin.").max(10, "Telefon numarası girin.")
            .matches(/^[0-9]+$/, { message: "Telefon numarası girin." }).required("Bu alan zorunlu"),
    }),
    appointment_duration: Yup.number().min(0,"Bu alan zorunlu").required("Bu alan zorunlu"),
    person_id: Yup.string().min(36,"Seçim yapın.").required("Bu alan zorunlu"),
    appointment_status_id: Yup.string().min(36,"Seçim yapın.").required("Bu alan zorunlu"),
    appointment_type_id: Yup.string().min(36,"Seçim yapın.").required("Bu alan zorunlu"),
    appointment_start: Yup.string().required("Bu alan zorunlu")
})

const newAppointmentProcessTypeSchema = Yup.object({
    data: Yup.array(Yup.object({
        appointment_process_id: Yup.string().min(36,"Seçim yapın.").required("Bu alan zorunlu"),
        amount: Yup.number().required("Bu alan zorunlu")
    }))
})

const updateAppointmentProcessTypeSchema = Yup.object({
    amount: Yup.number().required("Bu alan zorunlu")
})

const newAppointmentProcessSchema = Yup.object({
    name: Yup.string().min(1, "Bu alan zorunlu").max(50, "Bu alan zorunlu").required("Bu alan zorunlu"),
    code: Yup.string().min(1, "Bu alan zorunlu").max(10, "Bu alan zorunlu").required("Bu alan zorunlu"),
    currency_id: Yup.string().min(36,"Seçim yapın.").required("Bu alan zorunlu"),
    amount: Yup.number().min(0, "Minumum 0 girin.").required("Bu alan zorunlu"),
    vat: Yup.number().min(0, "Minumum 0 girin."),
    appointment_process_type_id: Yup.string().min(36,"Seçim yapın.").required("Bu alan zorunlu"),
    sub_appointment_process: Yup.array(Yup.string()).nullable().when("appointment_process_type_id", {
        is: (v: any) => v === "305ee410-8284-408e-99c7-9c2ee07f7297",
        then: (schema) => Yup.array(Yup.string()).required("Bu alan zorunlu").min(1,"Bu alan zorunlu")
    })
})

const updateAppointmentNoteSchema = Yup.object({
    appointment_note: Yup.string().min(1, "Bu alan zorunlu").required("Bu alan zorunlu"),
})

export { newAppointmentSchema, newAppointmentProcessTypeSchema, updateAppointmentProcessTypeSchema, newAppointmentProcessSchema, updateAppointmentNoteSchema }