import { Badge, IconButton } from '@mui/material';
import React, { ChangeEvent, useEffect, useRef } from 'react'
import { useCreateBranchLogoMutation } from 'reduxt/features/branch/branch-api';
import Avatar from 'components/@extended/Avatar';
import MuiAvatar from '@mui/material/Avatar';
import { SquareLoader } from 'react-spinners';
import { enqueueSnackbar } from 'notistack';

const avatarImage = '/assets/images/users';

const CreateBranchLogoComponent = ({ branchId, logoUrl }: { branchId: string, logoUrl?: string | null }) => {

    const [createBranchLogo, { isLoading: createBranchLogoIsLoading, data: createBranchLogoResponse, error: createBranchLogoError }] = useCreateBranchLogoMutation();

    const dosyaInputu = useRef<HTMLInputElement>(null);

    const dosyaSec = () => {
        if (dosyaInputu.current) {
            dosyaInputu.current.click();
        }
    };

    const dosyaYukle = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const formData = new FormData();
                formData.append('branchId', branchId);
                formData.append('logo', file);
                createBranchLogo(formData)
            };
            reader.readAsDataURL(file);
        }
    };


    useEffect(() => {
        if (createBranchLogoResponse) {
            enqueueSnackbar(createBranchLogoResponse.message, { variant: createBranchLogoResponse?.success == true ? 'success' : 'error' })
        }
        if (createBranchLogoError) {
            var error = createBranchLogoError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", { variant: 'error' })
        }
    }, [createBranchLogoResponse, createBranchLogoError])

    if (createBranchLogoIsLoading) {
        return <SquareLoader />
    }

    if (logoUrl) {
        return (
            <>
                <IconButton onClick={dosyaSec}><Badge color="secondary" overlap="circular" badgeContent="Değiştir" sx={{marginBottom: 5}}>
                    <MuiAvatar src={logoUrl} sx={{ width: 96, height: 96 }} />
                </Badge>
                </IconButton>
                <input
                    type="file"
                    disabled={createBranchLogoIsLoading}
                    ref={dosyaInputu}
                    accept="image/*"
                    onChange={dosyaYukle}
                    style={{ display: 'none' }}
                />
            </>
        )
    }

    return (
        <>
            <IconButton onClick={dosyaSec}>
                <Badge color="secondary" overlap="circular" badgeContent="Değiştir">
                    <Avatar alt="Güven Pastanesi" size="xl" src={`${avatarImage}/default.png`} />
                </Badge>
            </IconButton>
            <input
                type="file"
                disabled={createBranchLogoIsLoading}
                ref={dosyaInputu}
                accept="image/*"
                onChange={dosyaYukle}
                style={{ display: 'none' }}
            />
        </>
    )
}

export default CreateBranchLogoComponent