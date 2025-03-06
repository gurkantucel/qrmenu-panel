import { Grid } from '@mui/material';
import BlogListView from 'sections/blog/BlogListView';
import { getBlogList } from './actions';
import { notFound } from 'next/navigation';

const PricePage = async () => {
    const result = await getBlogList();
    if (result.status == "failure") {
        return notFound();
    }
    return (
        <>
            <Grid container justifyContent="center" alignItems="center" sx={{ pt: 5, pb: 10.5 }}>
                <BlogListView data={result.data.data} />
            </Grid>
        </>
    )
}

export default PricePage