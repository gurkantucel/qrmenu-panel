import * as Yup from 'yup';

const newDietTemplateValidationSchema = Yup.object({
    person_id: Yup.string().uuid('Geçersiz UUID formatı').required('Diyetisyen ID zorunlu'),
    code: Yup.string().required('Kod zorunlu').min(1, 'Kod en az 1 karakter olmalı').max(10, 'Kod en fazla 10 karakter olmalı'),
    name: Yup.string().required('İsim zorunlu').min(1, 'İsim en az 1 karakter olmalı').max(100, 'İsim en fazla 100 karakter olmalı'),
    description: Yup.string().nullable().max(500, 'Açıklama en fazla 500 karakter olmalı'),
    detail: Yup.array().nullable()
        .of(
            Yup.object({
                day: Yup.number().required('Gün zorunlu'),
                detail: Yup.array().nullable()
                    .of(
                        Yup.object({
                            meal_time_id: Yup.string().uuid('Geçersiz UUID formatı').required('Öğün ID zorunlu'),
                            name: Yup.string().when('meal_time_id', {
                                is: (val: string) => val && val.length > 0,
                                then: (schema) => Yup.string().required('Yemek ismi zorunlu').min(1, 'Yemek ismi en az 1 karakter olmalı').max(100, 'Yemek ismi en fazla 100 karakter olmalı'),
                            }),
                            calorie: Yup.string().when('meal_time_id', {
                                is: (val: string) => val && val.length > 0,
                                then: (schema) => Yup.string().required('Kalori zorunlu').min(1, 'Kalori en az 1 karakter olmalı').max(100, 'Kalori en fazla 100 karakter olmalı'),
                            }),
                            note: Yup.string().nullable().max(200, 'Not en fazla 200 karakter olmalı'),
                            status: Yup.boolean().required('Durum zorunlu'),
                        })
                    )
            })
        ),
    status: Yup.boolean().required('Durum zorunlu'),
});

export { newDietTemplateValidationSchema }