// src/hooks/useAppSnackbar.ts
import { useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

export const useAppSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const showMessage = (code: string, success?: boolean) => {
    enqueueSnackbar(formatMessage({ id: code ?? "ERROR" }), {
      variant: success == undefined ? 'info' : success == true ? 'success' : 'error',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      autoHideDuration: 3000,
    });
  };

  return { showMessage };
};
