// project-imports
import FooterBlock from "layout/BlogLayout/FooterBlock";
import Header from "layout/BlogLayout/Header";
import { Poppins } from "next/font/google";

// ==============================|| DASHBOARD LAYOUT ||============================== //

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  fallback: ['sans-serif'],
  weight: ['300', '400', '500', '700'],
  adjustFontFallback: false
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main id="blog" className={poppins.variable}>
      <Header />
      {children}
      <FooterBlock />
    </main>
  );
}
