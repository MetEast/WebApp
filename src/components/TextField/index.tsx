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
    number?: boolean;
    error?: boolean;
    errorText?: string;
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
    number = false,
    error = false,
    errorText = '',
    changeHandler = () => {},
}): JSX.Element => {
    const [text, setText] = useState(inputValue);
    const [invalid, setInvalid] = useState<boolean>(true);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setText(value);
        changeHandler(value);

        if (number) setInvalid(value === '' || isNaN(Number(value)));
        else setInvalid(value === '');
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
                        '& fieldset, &:hover fieldset': {
                            borderWidth: error && invalid ? 2 : 0,
                            borderColor: error && invalid ? '#EB5757' : 'white',
                        },
                        '&.Mui-focused fieldset': {
                            borderWidth: 2,
                            borderColor: error && invalid ? '#EB5757' : '#1890FF',
                        },
                        '& input': {
                            height: 40,
                            paddingY: 0,
                        },
                    },
                }}
                onChange={handleInputChange}
            />
            {error && invalid && (
                <Typography fontSize={12} fontWeight={500} color="#EB5757">
                    {errorText}
                </Typography>
            )}
        </Stack>
    );
};

export default CustomTextField;
