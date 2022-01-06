import React from 'react';
import { Stack, Typography, TextField } from '@mui/material';

export interface ComponentProps {
    title?: string;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
}

const CustomTextField: React.FC<ComponentProps> = ({ title, placeholder, multiline, rows }): JSX.Element => {
    return (
        <Stack spacing={0.5}>
            {title && (
                <Typography fontSize={12} fontWeight={700}>
                    {title}
                </Typography>
            )}
            <TextField
                placeholder={placeholder}
                multiline={multiline}
                rows={rows}
                sx={{
                    width: '100%',
                    borderRadius: 3,
                    '& .MuiOutlinedInput-root': {
                        height: multiline ? 'auto' : 40,
                        '& fieldset': {
                            borderWidth: 0,
                        },
                        '&.Mui-focused fieldset': {
                            borderWidth: 0,
                        },
                    },
                }}
            />
        </Stack>
    );
};

export default CustomTextField;
