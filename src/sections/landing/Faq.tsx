'use client';

import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Grid, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import React from 'react'

type Props = {
    page?: string
    result?: any
}

const FaqLandingPage = (props: Props) => {

    if (props.result.data == null) {
        return <></>
    }

    return (
        <Box sx={{
            bgcolor: props.page == "home" ? '#edf8f4' : 'transparent',
            pb: { md: 10, xs: 7 }, pt: 4,
            '& .MuiAccordion-root': {
                borderColor: 'divider',
                borderRadius: 4,
                '& .MuiAccordionSummary-root': {
                    bgcolor: 'transparent',
                }
            },
            '& .MuiAccordionSummary-expandIconWrapper': {
                color: 'primary.main'
            }
        }}>
            <Container>
                <Grid item xs={12}>
                    <Grid container spacing={2} justifyContent="center" sx={{ textAlign: 'center', marginBottom: 3 }}>
                        <Grid item xs={12}>
                            <motion.div
                                initial={{ opacity: 0, translateY: 550 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 150,
                                    damping: 30,
                                    delay: 0.2
                                }}
                            >
                                <Typography variant="h2">Sıkça sorulan sorular
                                </Typography>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <motion.div
                                initial={{ opacity: 0, translateY: 550 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 150,
                                    damping: 30,
                                    delay: 0.4
                                }}
                            >
                                <Typography>
                                    Klinik Ease Hakkında sık sorulan sorular
                                </Typography>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Grid>
                {props.result?.data?.data?.map((item: any, index: number) => (
                    <Accordion key={`accordion-${index}`}>
                        <AccordionSummary aria-controls={`panel${index}d-content`} id={`panel${index}d-header`}>
                            <Typography variant="h6">{item.label ?? "-"}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {item.field ?? "-"}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Container>
        </Box >
    )
}

export default FaqLandingPage