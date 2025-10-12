// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Book1, Building, CalendarTick, DocumentCode2, DocumentDownload, HomeHashtag, I24Support, Information, MessageProgramming, Moneys, Setting2, SmsTracking, UserTag } from 'iconsax-react';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  home: HomeHashtag,
  page: Book1,
  maintenance: MessageProgramming,
  contactus: I24Support,
  samplePage: DocumentCode2,
  patient: UserTag,
  person: Building,
  appointment: CalendarTick,
  file: DocumentDownload,
  payment: Moneys,
  sms: SmsTracking,
  setting: Setting2,
  faq: Information
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages: NavItemType = {
  id: 'group-pages',
  title: <FormattedMessage id="sayfalar" />,
  type: 'group',
  icon: icons.page,
  children: [
    {
      id: 'home',
      title: <FormattedMessage id="home" />,
      type: 'item',
      url: '/app/home',
      icon: icons.home
    },
    {
      id: 'appointments',
      title: <FormattedMessage id="appointments" />,
      type: 'item',
      url: '/app/appointment',
      icon: icons.appointment
    },
    {
      id: 'patients',
      title: <FormattedMessage id="patients" />,
      type: 'item',
      url: '/app/patient',
      icon: icons.patient
    },
    {
      id: 'person',
      title: <FormattedMessage id="person" />,
      type: 'item',
      url: '/app/person',
      icon: icons.person
    },
    {
      id: 'files',
      title: <FormattedMessage id="files" />,
      type: 'item',
      url: '/app/files',
      icon: icons.file
    },
    {
      id: 'payments',
      title: <FormattedMessage id="payments" />,
      type: 'item',
      url: '/app/payments',
      icon: icons.payment
    },
    {
      id: 'sms-transactions',
      title: <FormattedMessage id="sms-transactions" />,
      type: 'item',
      url: '/app/sms-transactions',
      icon: icons.sms
    },
    {
      id: 'settings',
      title: <FormattedMessage id="settings" />,
      type: 'collapse',
      icon: icons.setting,
      children: [
        {
          id: 'appointment-process',
          title: <FormattedMessage id="appointmentProcesses" />,
          type: 'item',
          url: '/app/settings/appointment-process',
        }
      ]
    },
    {
      id: 'faq',
      title: <FormattedMessage id="faq" />,
      type: 'item',
      url: '/app/faq',
      icon: icons.faq
    }
  ]
};

export default pages;
