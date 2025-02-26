// material-ui
import Grid from '@mui/material/Grid';

// project-imports
import ContactHeader from 'sections/extra-pages/contact/ContactHeader';
import ContactContent from 'sections/extra-pages/contact/ContactContent';
import FaqLandingPage from 'sections/landing/Faq';
import { getHomeFaq } from 'app/(simple)/landing/actions';

// ==============================|| CONTACT US - MAIN ||============================== //

export default async function ContactUSPage() {
  const faqResult = await getHomeFaq();
  return (
    <>
      <Grid container spacing={12} justifyContent="center" alignItems="center" sx={{ mb: 12 }}>
        <Grid item xs={12} md={12}>
          <ContactHeader />
        </Grid>
      </Grid>
      <ContactContent />
      <FaqLandingPage result={faqResult} />
    </>
  );
}
