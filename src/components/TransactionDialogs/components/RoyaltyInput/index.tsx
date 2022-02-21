import React, { useState } from 'react';
import { Stack, Typography, TextField } from '@mui/material';

export interface ComponentProps {
    title?: string;
    placeholder?: string;
    handleChange?: (value: number) => void;
}

const RoyaltyInput: React.FC<ComponentProps> = ({ title, placeholder, handleChange = () => {} }): JSX.Element => {
    const [text, setText] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setText(value);
        handleChange(parseFloat(value));
    };

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
                borderRadius={3}
                paddingRight={2}
                overflow="hidden"
                sx={{ background: '#F0F1F2' }}
            >
                <TextField
                    value={text}
                    placeholder={placeholder}
                    sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                            height: 40,
                            fontSize: 20,
                            fontWeight: 500,
                            '& fieldset': {
                                borderWidth: 0,
                            },
                            '&.Mui-focused fieldset': {
                                borderWidth: 0,
                            },
                        },
                    }}
                    onChange={handleInputChange}
                />
                <Typography fontSize={14} fontWeight={700} marginLeft={0.5}>
                    %
                </Typography>
            </Stack>
        </Stack>
    );
};

export default RoyaltyInput;
