"use client"

import { Grid, Typography } from "@mui/material"
import Logo from "components/logo"
import { motion } from "framer-motion"

const FooterElement = () => {
    return (
        <motion.div
            initial={{ opacity: 0, translateY: 550 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
                type: 'spring',
                stiffness: 150,
                damping: 30
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Logo to="/" />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ 
                        fontFamily: 'var(--font-poppins)',
                        fontSize: "0.875rem",
                        lineHeight: "1.57",
                        color: "#1D2630",
                        fontWeight: 400, maxWidth: 320 }}>
                        {"Klinik Ease, sadece bir yazılım değil, aynı zamanda işinizi büyütmenize yardımcı olacak bir iş ortağıdır. İhtiyaçlarınıza özel çözümlerimizle kliniğinizin potansiyelini en üst düzeye çıkarın. Hemen Klinik Ease'i keşfedin ve kliniğiniz için en iyi çözümü bulun."}
                    </Typography>
                </Grid>
            </Grid>
        </motion.div>
    )
}

export default FooterElement