import React from 'react';
import Button from '@mui/material/Button';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';

interface ComponentProps {
    text: string;
    variant: VariantType;
}

const MyApp: React.FC<ComponentProps> = ({text, variant}) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    enqueueSnackbar(text);
  };

  const handleClickVariant = (variant: VariantType) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(text, { variant });
  };

  return (
    <React.Fragment>
      <Button onClick={handleClick}>Show snackbar</Button>
      <Button onClick={handleClickVariant(variant)}>Show success snackbar</Button>
    </React.Fragment>
  );
};

const IntegrationNotistack: React.FC<ComponentProps> = ({text, variant}) => {
  return (
    <SnackbarProvider maxSnack={3}>
      <MyApp text={text} variant={variant} />
    </SnackbarProvider>
  );
}

export default IntegrationNotistack;