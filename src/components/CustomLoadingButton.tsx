import { Button } from '@mui/material'
import React from 'react'
import { PuffLoader } from 'react-spinners'

type Props = {
    title?: string
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
    isLoading?: boolean
    disabled?: boolean
    autoFocus?: boolean
}

const CustomLoadingButton = (props: Props) => {
    return (
        <Button variant="contained" disabled={props.disabled} onClick={props.onClick} autoFocus={props.autoFocus ?? true}>
            {props.isLoading == true && <PuffLoader size={20} color='white' />}
            {props.isLoading == false && props.title}
        </Button>
    )
}

export default CustomLoadingButton