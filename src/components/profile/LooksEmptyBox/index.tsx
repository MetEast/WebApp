import React, { useState } from 'react';
import { Stack, Grid, Typography } from '@mui/material';
import { SecondaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {}

const LooksEmptyBox: React.FC<ComponentProps> = (): JSX.Element => {
    return <Stack>Looks empty here</Stack>;
};

export default LooksEmptyBox;
