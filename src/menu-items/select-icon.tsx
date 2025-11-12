import { Book1, Building, CalendarTick, Category2, DocumentDownload, HomeHashtag, Information, Layer, MagicStar, Moneys, MoneySend, PresentionChart, Reserve, ScanBarcode, Setting2, Shop, SmsTracking, UserOctagon, UserTag } from 'iconsax-react';

export const selectIcon = (id: string) => {
  switch (id) {
    case "group-pages":
      return Book1;
    case "home":
      return HomeHashtag;
    case "categories":
      return Category2;
    case "menus":
      return Reserve;
    case "myBusiness":
      return Shop;
    case "qrCodes":
      return ScanBarcode;
    case "myPackage":
      return UserOctagon;
    case "chefsPicks":
      return MagicStar;
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