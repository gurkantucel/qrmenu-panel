import { createSlice } from "@reduxjs/toolkit"
import { NavItemType } from "types/menu"

// assets
import { getCookie } from "cookies-next";
import { PersonAuthorization } from "./models/auth-models";

type Model = {
    items: NavItemType[]
}

interface PatientTabState {
    data: Model
}

const initialState: PatientTabState = {
    data: { items: [] }
}

const permissionControlMenu = () => {
    const personAuthorizations = getCookie("personAuthorizations");
    if (personAuthorizations != null) {
        const pAuth: PersonAuthorization[] = JSON.parse(personAuthorizations);
        const menuItems = [
            {
                id: 'home',
                code: null,
                title: "Ana Sayfa",
                type: 'item',
                url: '/app/home',
                icon: ""
            },
            {
                id: 'appointments',
                code: "00001",
                title: "Randevular",
                type: 'item',
                url: '/app/appointment',
                icon: ""
            },
            {
                id: 'patients',
                code: "00002",
                title: "Danışanlar",
                type: 'item',
                url: '/app/patient',
                icon: ""
            },
            {
                id: 'person',
                code: "00003",
                title: "Çalışanlar",
                type: 'item',
                url: '/app/person',
                icon: ""
            },
            {
                id: 'files',
                code: "00004",
                title: "Dosyalar",
                type: 'item',
                url: '/app/files',
                icon: ""
            },
            {
                id: 'make-an-offer',
                code: "00005",
                title: "Teklif Ver",
                type: 'item',
                url: '/app/make-an-offer',
                icon: ""
            },
            {
                id: 'payment',
                code: "00006",
                title: "Ödemeler",
                type: 'item',
                url: '/app/payment',
                icon: ""
            },
            {
                id: 'sms-transactions',
                code: "00007",
                title: "SMS İşlemleri",
                type: 'item',
                url: '/app/sms-transactions',
                icon: ""
            },
            {
                id: 'statistics',
                code: "00008",
                title: "İstatistikler",
                type: 'item',
                url: '/app/statistics',
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
                        code: "00009",
                        title: "Randevu İşlemleri",
                        type: 'item',
                        url: '/app/settings/appointment-process',
                    },
                    {
                        id: 'sms-template',
                        code: "00010",
                        title: "SMS Şablonları",
                        type: 'item',
                        url: '/app/settings/sms-template',
                    },
                    {
                        id: 'person-type',
                        code: "00011",
                        title: "Çalışan Türleri",
                        type: 'item',
                        url: '/app/settings/person-type',
                    }
                ]
            },
            {
                id: 'faq',
                code: null,
                title: "Sıkça Sorulan Sorular",
                type: 'item',
                url: '/app/faq',
                icon: ""
            }
        ]

        const newMenuItems: any[] = [];

        menuItems.forEach(menuItem => {
            const authorized = pAuth.find(auth => auth.code === menuItem.code);

            if (authorized || menuItem.code === null) {
                if (menuItem.type === 'collapse' && menuItem.children) {
                    const newChildren: any[] = [];
                    menuItem.children.forEach(child => {
                        const childAuthorized = pAuth.find(auth => auth.code === child.code);
                        if (childAuthorized) {
                            newChildren.push(child);
                        }
                    });
                    if (newChildren.length > 0) {
                        newMenuItems.push({ ...menuItem, children: newChildren });
                    }
                } else {
                    newMenuItems.push(menuItem);
                }
            }
        });

        return newMenuItems;
    }
    return [];
}

export const menuItemSlice = createSlice({
    name: "menuItem",
    initialState,
    reducers: {
        setMenuItem: (state) => {
            state.data = {
                items: [
                    {
                        id: 'group-pages',
                        title: "Sayfalar",
                        type: 'group',
                        children: permissionControlMenu()
                    }
                ]
            }
        },
        resetMenuItemState: () => initialState
    }
})

export const { setMenuItem, resetMenuItemState } = menuItemSlice.actions

export default menuItemSlice.reducer