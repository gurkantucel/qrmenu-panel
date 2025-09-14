import { Box, Container } from '@mui/material'
import React from 'react'
import HashGeneratorView from 'views/hash-generator/HashGeneratorView'

const HashGeneratorPage = () => {
    return (
        <Box sx={{ pt: 15, pb: 10.5 }}>
            <Container>
                <HashGeneratorView />
            </Container>
        </Box>
    )
}

export default HashGeneratorPage