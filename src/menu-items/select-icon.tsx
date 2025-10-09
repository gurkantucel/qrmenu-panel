import { Book1, Building, CalendarTick, DocumentDownload, HomeHashtag, Information, Layer, MoneySend, PresentionChart, Setting2, ShoppingBag, SmsTracking, UserTag } from 'iconsax-react';

export const selectIcon = (id: string) => {
  switch (id) {
    case "group-pages":
      return Book1;
    case "home":
      return HomeHashtag;
    case "appointments":
      return CalendarTick;
    case "patients":
      return UserTag;
    case "person":
      return Building;
    case "files":
      return DocumentDownload;
    case "payments":
      return ShoppingBag;
    case "make-an-offer":
      return MoneySend;
    case "sms-transactions":
      return SmsTracking;
    case "stock":
      return Layer;
    case "statistics":
      return PresentionChart;
    case "settings":
      return Setting2;
    case "faq":
      return Information;
    default:
      return Information;
  }
}