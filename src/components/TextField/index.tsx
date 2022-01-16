import React, { useState } from 'react';
import { Stack, Typography, TextField } from '@mui/material';

export interface ComponentProps {
    title?: string;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
    changeHandler: (value: string) => void
}

const CustomTextField: React.FC<ComponentProps> = ({ title, placeholder, multiline, rows, changeHandler }): JSX.Element => {
    const [text, setText] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setText(value);
        changeHandler(value);
    };

    return (
        <Stack spacing={0.5}>
            {title && (
                <Typography fontSize={12} fontWeight={700}>
                    {title}
                </Typography>
            )}
            <TextField
                placeholder={placeholder}
                value={text}
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
                onChange={handleInputChange}
            />
        </Stack>
    );
};

export default CustomTextField;
