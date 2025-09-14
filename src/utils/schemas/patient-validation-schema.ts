import * as Yup from 'yup';

const newPatientValidationSchema = Yup.object({
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
    surname: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
    phone_number: Yup.string().min(10, "Telefon numarası girin.").max(10, "Telefon numarası girin.")
        .matches(/^[0-9]+$/, { message: "Telefon numarası girin." }).required("Bu alan zorunlu"),
})

const newPatientDiseaseHistorySchema = Yup.object({
    patient_id: Yup.string().min(36, "Seçim yapın.").required("Bu alan zorunlu"),
    disease_status_id: Yup.string().min(36, "Seçim yapın.").required("Bu alan zorunlu"),
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
    start_date: Yup.date().nullable().typeError('Başlangıç tarihi geçerli bir tarih olmalıdır'),
    end_date: Yup.date().nullable()
        .typeError('Bitiş tarihi geçerli bir tarih olmalıdır')
        .when(["start_date"], {
            is: (start_date: any) => start_date && start_date !== '',
            then: (schema) => Yup.date().nullable().min(Yup.ref('start_date'), 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır'),
        }),
})

const newPatientMedicineHistorySchema = Yup.object({
    patient_id: Yup.string().min(36, "Seçim yapın.").required("Bu alan zorunlu"),
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
    start_date: Yup.date().nullable().typeError('Başlangıç tarihi geçerli bir tarih olmalıdır'),
    end_date: Yup.date().nullable()
        .typeError('Bitiş tarihi geçerli bir tarih olmalıdır')
        .when(["start_date"], {
            is: (start_date: any) => start_date && start_date !== '',
            then: (schema) => Yup.date().nullable().min(Yup.ref('start_date'), 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır'),
        }),
})

const newPatientFamilyDiseaseSchema = Yup.object({
    patient_id: Yup.string().min(36, "Seçim yapın.").required("Bu alan zorunlu"),
    kinship_degree_id: Yup.string().min(36, "Seçim yapın.").required("Bu alan zorunlu"),
    disease_status_id: Yup.string().min(36, "Seçim yapın.").required("Bu alan zorunlu"),
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
    start_date: Yup.date().nullable().typeError('Başlangıç tarihi geçerli bir tarih olmalıdır'),
    end_date: Yup.date().nullable()
        .typeError('Bitiş tarihi geçerli bir tarih olmalıdır')
        .when(["start_date"], {
            is: (start_date: any) => start_date && start_date !== '',
            then: (schema) => Yup.date().nullable().min(Yup.ref('start_date'), 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır'),
        }),
})

const newPatientSurgeryHistorySchema = Yup.object({
    patient_id: Yup.string().min(36, "Seçim yapın.").required("Bu alan zorunlu"),
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
})

const newPatientTreatmentHistorySchema = Yup.object({
    patient_id: Yup.string().min(36, "Seçim yapın.").required("Bu alan zorunlu"),
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
})

const newPatientInjectionHistorySchema = Yup.object({
    patient_id: Yup.string().min(36, "Seçim yapın.").required("Bu alan zorunlu"),
    //injection_type_id: Yup.string().min(36,"Seçim yapın.").required("Bu alan zorunlu"),
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
    //injection_date: Yup.date().required("Bu alan zorunlu").typeError("Bu alan zorunlu"),
})

const newPatientAllergyHistorySchema = Yup.object({
    patient_id: Yup.string().min(36, "Seçim yapın.").required("Bu alan zorunlu"),
    name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(2, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
    start_date: Yup.date().nullable().typeError('Başlangıç tarihi geçerli bir tarih olmalıdır'),
    end_date: Yup.date().nullable()
        .typeError('Bitiş tarihi geçerli bir tarih olmalıdır')
        .when(["start_date"], {
            is: (start_date: any) => start_date && start_date !== '',
            then: (schema) => Yup.date().nullable().min(Yup.ref('start_date'), 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır'),
        }),
})

const newPatientPaymentHistorySchema = Yup.object({
    patient_id: Yup.string().min(36, "Seçim yapın.").required("Bu alan zorunlu"),
    payment_method_id: Yup.string().min(36, "Seçim yapın.").required("Bu alan zorunlu"),
    payment_date: Yup.string().required("Bu alan zorunlu"),
    detail: Yup.array(Yup.object({
        appointment_process_code: Yup.string().required("Bu alan zorunlu"),
        amount: Yup.number().required("Bu alan zorunlu"),
        quantity: Yup.number().required("Bu alan zorunlu"),
        discount_percentage: Yup.number().required("Bu alan zorunlu"),
    }))
})

const newDieticianPatientMeasurementValidationSchema = Yup.object({
    weight: Yup.number().min(0).max(250,"Gerçekçi veriler girin.").required("Bu alan zorunlu"),
    height: Yup.number().min(0).max(250,"Gerçekçi veriler girin.").required("Bu alan zorunlu"),
    waist: Yup.number().min(0).max(250,"Gerçekçi veriler girin.").required("Bu alan zorunlu"),
    hip: Yup.number().min(0).max(250,"Gerçekçi veriler girin.").required("Bu alan zorunlu"),
    chest: Yup.number().min(0).max(250,"Gerçekçi veriler girin.").required("Bu alan zorunlu"),
    measurement_date: Yup.string().trim().min(1).required("Bu alan zorunlu"),
})

export { newPatientValidationSchema, newPatientDiseaseHistorySchema, newPatientMedicineHistorySchema, newPatientFamilyDiseaseSchema, newPatientSurgeryHistorySchema, newPatientTreatmentHistorySchema, newPatientInjectionHistorySchema, newPatientPaymentHistorySchema, newPatientAllergyHistorySchema, newDieticianPatientMeasurementValidationSchema }