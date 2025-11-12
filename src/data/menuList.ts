export const menuList = [
    {
        id: 'group-pages',
        title: "Sayfalar",
        type: 'group',
        children: [
            {
                id: 'home',
                code: null,
                title: "Ana Sayfa",
                type: 'item',
                url: '/home',
                icon: ""
            },
            {
                id: 'categories',
                code: "00001",
                title: "Kategoriler",
                type: 'item',
                url: '/categories',
                icon: ""
            },
            {
                id: 'menus',
                code: "00025",
                title: "Menüler",
                type: 'item',
                url: '/menus',
                icon: ""
            },
            {
                id: 'chefsPicks',
                code: "00026",
                title: "Şefin Seçtikleri",
                type: 'item',
                url: '/selected-foods',
                icon: ""
            },
            {
                id: 'myBusiness',
                code: "00055",
                title: "İşletmem",
                type: 'item',
                url: '/branches',
                icon: ""
            },
            {
                id: 'qrCodes',
                code: "00055",
                title: "QR Kodları",
                type: 'item',
                url: '/qr-codes',
                icon: ""
            },
            {
                id: 'myPackage',
                code: "00049",
                title: "Paketim",
                type: 'item',
                url: '/statistics',
                icon: ""
            },
            {
                id: 'settings',
                code: null,
                title: "Ayarlar",
                type: 'collapse',
                icon: "",
                children: [
                    {
                        id: 'appointment-process',
                        code: "00002",
                        title: "Randevu İşlemleri",
                        type: 'item',
                        url: '/settings/appointment-process',
                    },
                    {
                        id: 'diet-template',
                        code: "00052",
                        title: "Diyet Şablonları",
                        type: 'item',
                        url: '/settings/diet-template',
                    },
                    {
                        id: 'sms-integration',
                        code: "00054",
                        title: "SMS Entegrasyonu",
                        type: 'item',
                        url: '/settings/sms-integration',
                    },
                    {
                        id: 'sms-template',
                        code: "00048",
                        title: "SMS Şablonları",
                        type: 'item',
                        url: '/settings/sms-template',
                    },
                    {
                        id: 'person-type',
                        code: "00047",
                        title: "Çalışan Türleri",
                        type: 'item',
                        url: '/settings/person-type',
                    }
                ]
            },
        ]
    }
];