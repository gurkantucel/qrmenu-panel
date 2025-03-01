import React from 'react';

type Props = {
    fullName:string
}

const NameAvatar = ({ fullName }: Props) => {
    if (!fullName) {
        return null; // Ad veya soyad yoksa hiçbir şey gösterme
    }

    const adlar = fullName.split(' '); // Adı boşluklara göre ayır
    const ilkIsimBasHarfi = adlar[0][0].toUpperCase(); // İlk ismin baş harfi
    const soyadBasHarfi = adlar[adlar.length - 1][0].toUpperCase(); // Soyadın baş harfi

    const basHarfler = `${ilkIsimBasHarfi}${soyadBasHarfi}`;

    return (
        <div
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#00c3a54d',
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,.05)",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 500
            }}
        >
            {basHarfler}
        </div>
    );
};

export default NameAvatar;