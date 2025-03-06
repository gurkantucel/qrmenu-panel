'use client';

import { forwardRef, CSSProperties, ReactNode, Ref, ReactElement } from 'react';

// material-ui
import Card, { CardProps } from '@mui/material/Card';
import CardContent, { CardContentProps } from '@mui/material/CardContent';
import CardHeader, { CardHeaderProps } from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

// project-imports
import useConfig from 'hooks/useConfig';

// types
import { KeyedObject } from 'types/root';

// header style
const headerSX = {fontFamily: 'var(--font-poppins)', fontWeight: 600, p: 2.5, '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' } };

export interface MainCardProps extends KeyedObject {
  border?: boolean;
  boxShadow?: boolean;
  children?: ReactElement;
  subheader?: ReactElement | string;
  style?: CSSProperties;
  content?: boolean;
  contentSX?: CardContentProps['sx'];
  darkTitle?: boolean;
  divider?: boolean;
  sx?: CardProps['sx'];
  secondary?: CardHeaderProps['action'];
  shadow?: string;
  elevation?: number;
  title?: ReactNode | string;
  codeHighlight?: boolean;
  codeString?: string;
  modal?: boolean;
}

// ==============================|| CUSTOM - MAIN CARD ||============================== //

function MainCard2(
  {
    border = true,
    boxShadow = true,
    children,
    subheader,
    content = true,
    contentSX = {},
    darkTitle,
    divider = true,
    elevation,
    secondary,
    shadow,
    sx = {},
    title,
    codeHighlight = false,
    codeString,
    modal = false,
    ...others
  }: MainCardProps,
  ref: Ref<HTMLDivElement>
) {
  const { themeContrast } = useConfig();

  return (
    <Card
      elevation={elevation || 0}
      ref={ref}
      {...others}
      sx={{
        position: 'relative',
        border: border ? '1px solid' : 'none',
        borderRadius: "12px",
        borderColor: "rgba(219, 224, 229, 0.65)",
        ...(((themeContrast && boxShadow) || shadow) && {
          boxShadow: shadow ? shadow : '0px 8px 24px #131920'
        }),
        ...(codeHighlight && {
          '& pre': {
            m: 0,
            p: '12px !important',
            fontFamily: 'var(--font-poppins)',
            fontSize: '0.75rem'
          }
        }),
        ...(modal && {
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: `calc( 100% - 50px)`, sm: 'auto' },
          '& .MuiCardContent-root': {
            overflowY: 'auto',
            minHeight: 'auto',
            maxHeight: `calc(100vh - 200px)`
          }
        }),
        ...sx
      }}
    >
      {/* card header and action */}
      {!darkTitle && title && (
        <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1',fontFamily: 'var(--font-poppins)',fontSize: "0.875rem",
          fontWeight: 600,
          lineHeight: "1.57"}} title={title} action={secondary} subheader={subheader} />
      )}
      {darkTitle && title && <CardHeader sx={headerSX} title={<Typography variant="h4">{title}</Typography>} action={secondary} />}

      {/* content & header divider */}
      {title && divider && <Divider />}

      {/* card content */}
      {content && <CardContent sx={contentSX}>{children}</CardContent>}
      {!content && children}

      {/* card footer - clipboard & highlighter  */}
      {codeString && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
        </>
      )}
    </Card>
  );
}

export default forwardRef(MainCard2);
