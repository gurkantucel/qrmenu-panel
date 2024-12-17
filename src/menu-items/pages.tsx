// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Book1, DocumentCode2, I24Support, MessageProgramming } from 'iconsax-react';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  page: Book1,
  maintenance: MessageProgramming,
  contactus: I24Support,
  samplePage: DocumentCode2
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
      url: '/sample-page',
      icon: icons.samplePage
    },
    {
      id: 'appointments',
      title: <FormattedMessage id="appointments" />,
      type: 'item',
      url: '/app/appointments',
      icon: icons.samplePage
    },
    {
      id: 'patients',
      title: <FormattedMessage id="patients" />,
      type: 'item',
      url: '/app/patient',
      icon: icons.samplePage
    },
    {
      id: 'person',
      title: <FormattedMessage id="person" />,
      type: 'item',
      url: '/app/person',
      icon: icons.samplePage
    },
    {
      id: 'files',
      title: <FormattedMessage id="files" />,
      type: 'item',
      url: '/app/files',
      icon: icons.samplePage
    },
    {
      id: 'payments',
      title: <FormattedMessage id="payments" />,
      type: 'item',
      url: '/app/payments',
      icon: icons.samplePage
    },
    {
      id: 'sms-transactions',
      title: <FormattedMessage id="sms-transactions" />,
      type: 'item',
      url: '/app/sms-transactions',
      icon: icons.samplePage
    },
    {
      id: 'settings',
      title: <FormattedMessage id="settings" />,
      type: 'item',
      url: '/app/settings',
      icon: icons.samplePage
    },
    {
      id: 'faq',
      title: <FormattedMessage id="faq" />,
      type: 'item',
      url: '/app/faq',
      icon: icons.samplePage
    }
  ]
};

export default pages;
