import { Book1, Building, CalendarTick, DocumentDownload, HomeHashtag, Information, Setting2, ShoppingBag, SmsTracking, UserTag } from 'iconsax-react';

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
    case "sms-transactions":
      return SmsTracking;
    case "settings":
      return Setting2;
    case "faq":
      return Information;
    default:
      return Information;
  }
}