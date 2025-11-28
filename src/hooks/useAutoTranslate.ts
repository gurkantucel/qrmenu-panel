import { useState } from 'react';
import { useTranslateMutation } from 'reduxt/features/translate/translate-api';

// Tipler
type LangCode = "TR" | "EN" | "ES" | "FR";
const ALL_LANGS: LangCode[] = ["TR", "EN", "ES", "FR"];

interface AutoTranslateParams {
    text?: string | null;
    currentLang: string; // "TR", "EN" vs.
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    prefix: string; // "title", "description", "slug" vs.
}

export const useAutoTranslate = () => {
    const [error, setError] = useState<string | null>(null);

    const [translate, { isLoading: translateIsLoading }] = useTranslateMutation();

    const autoTranslate = async ({ text, currentLang, setFieldValue, prefix }: AutoTranslateParams) => {
        // Boş metin kontrolü
        if (!text) return;
        setError(null);

        // Mevcut dil dışındakileri hedefle
        const targetLangs = ALL_LANGS.filter((l) => l !== currentLang);

        try {
            // API İsteği
            const response = await translate({ text, langs: targetLangs }).unwrap();
            const translations = response.data;

            if (translations) {
                targetLangs.forEach((lang) => {
                    // Dinamik field ismi: title_en, description_de vs.
                    const fieldName = `${prefix}_${lang.toLowerCase()}`;
                    
                    // Tip güvenli erişim
                    const value = translations[lang as keyof typeof translations];
                    
                    if (value) {
                        setFieldValue(fieldName, value);
                    }
                });
            }
        } catch (err) {
            console.error("Auto Translate Error:", err);
            setError("Çeviri işlemi sırasında bir hata oluştu.");
        }
    };

    return { autoTranslate, translateIsLoading, error };
};