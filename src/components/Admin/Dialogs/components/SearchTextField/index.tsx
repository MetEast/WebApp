import React from 'react';
import { Stack, Typography, TextField } from '@mui/material';
import { Icon } from '@iconify/react';

export interface ComponentProps {
    title?: string;
    placeholder?: string;
}

const SearchTextField: React.FC<ComponentProps> = ({ title, placeholder }): JSX.Element => {
    return (
        <Stack spacing={0.5}>
            {title && (
                <Typography fontSize={12} fontWeight={700}>
                    {title}
                </Typography>
            )}
            <Stack
                direction="row"
                alignItems="center"
                paddingLeft={2}
                overflow="hidden"
                sx={{ background: '#F0F1F2' }}
            >
                <Icon icon="ph:magnifying-glass" fontSize={24} color="black" style={{ marginBottom: 2 }} />
                <TextField
                    placeholder={placeholder}
                    sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                            height: 40,
                            fontSize: 14,
                            fontWeight: 500,
                            '& fieldset': {
                                borderWidth: 0,
                            },
                            '& input': {
                                paddingLeft: 0.5,
                            },
                            '&.Mui-focused fieldset': {
                                borderWidth: 0,
                            },
                        },
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default SearchTextField;
