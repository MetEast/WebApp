import React, { useState } from 'react';
import { Stack, Typography, TextField } from '@mui/material';

export interface ComponentProps {
    disabled?: boolean;
    title?: string;
    inputValue?: string;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
    fontSize?: number;
    fontWeight?: number;
    changeHandler?: (value: string) => void;
}

const CustomTextField: React.FC<ComponentProps> = ({
    disabled,
    inputValue,
    title,
    placeholder,
    multiline,
    rows,
    fontSize,
    fontWeight,
    changeHandler = () => {},
}): JSX.Element => {
    const [text, setText] = useState(inputValue);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setText(value);
        changeHandler(value);
    };

    React.useEffect(() => {
        setText(inputValue);
    }, [inputValue]);

    return (
        <Stack spacing={0.5}>
            {title && (
                <Typography fontSize={12} fontWeight={700}>
                    {title}
                </Typography>
            )}
            <TextField
                disabled={disabled}
                placeholder={placeholder}
                value={text}
                multiline={multiline}
                rows={rows}
                sx={{
                    width: '100%',
                    borderRadius: 3,
                    '& .MuiOutlinedInput-root': {
                        fontSize: fontSize === undefined ? 'auto' : fontSize,
                        fontWeight: fontWeight === undefined ? 'auto' : fontWeight,
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
