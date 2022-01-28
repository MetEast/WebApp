import React, { useState } from 'react';
import { Stack, Typography, TextField } from '@mui/material';

export interface ComponentProps {
    title?: string;
    placeholder?: string;
    handleChange?: (value: number) => void;
}

const ELAPriceInput: React.FC<ComponentProps> = ({ title, placeholder, handleChange = () => {}}): JSX.Element => {
    const [input, setInput] = useState(0);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInput(parseFloat(value));
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
                    placeholder={placeholder}
                    value={input}
                    onChange={handleInputChange}
                    sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                            height: 40,
                            fontSize: 20,
                            fontWeight: 600,
                            '& fieldset': {
                                borderWidth: 0,
                            },
                            '&.Mui-focused fieldset': {
                                borderWidth: 0,
                            },
                        },
                    }}
                />
                <Stack direction="row" alignItems="center">
                    <img src="/assets/icons/elatos-ela.svg" height={20} alt="" />
                    <Typography fontSize={16} fontWeight={700} marginLeft={0.5}>
                        ELA
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default ELAPriceInput;
