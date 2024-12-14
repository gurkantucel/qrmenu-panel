import * as Yup from 'yup';

const registerValidationSchema = Yup.object({
    person_name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(1, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
    person_surname: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(1, "Çok Kısa")
        .max(100, "Çok Uzun")
        .required("Bu alan zorunlu"),
    person_phone_number: Yup.string()
        .matches(/^[0-9]+$/, { message: "Telefon numarası girin." }).required("Bu alan zorunlu"),
    person_email: Yup.string().email("E-posta girin.").required("Bu alan zorunlu"),
    company_name: Yup.string()
        .matches(/^[a-zA-Z0-9ğüşıöçİĞÜŞÖÇ&.]+(?: [a-zA-Z0-9ğüşıöçİĞÜŞÖÇ&.]+)*$/, { message: "Boşluklar ve özel karakterler içermemelidir." })
        .min(1, "Çok Kısa")
        .max(200, "Çok Uzun")
        .required("Bu alan zorunlu"),
    branch_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    country_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    city_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    district_id: Yup.number().min(1, "Seçim yapın.").required("Bu alan zorunlu"),
    address: Yup.string()
        .matches(/^\S+(?: \S+)*$/, { message: "Boşluklar içermemelidir." })
        .min(15, "Çok Kısa")
        .max(500, "Çok Uzun")
        .required("Bu alan zorunlu"),
    membershipAgreement: Yup.bool().oneOf([true], 'Onaylayın.'),
    illuminationText: Yup.bool().oneOf([true], 'Onaylayın.'),
    kvkk: Yup.bool().oneOf([true], 'Onaylayın.')
})

const loginValidationSchema = Yup.object({
    username: Yup.string().email("E-posta girin.").required("Bu alan zorunlu"),
    password: Yup.string()
        .matches(/^\S+(?: \S+)*$/, { message: "Boşluklar içermemelidir." })
        .min(5, "Çok Kısa")
        .max(500, "Çok Uzun")
        .required("Bu alan zorunlu"),
})


export { registerValidationSchema, loginValidationSchema}