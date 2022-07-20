import React, { useState } from 'react';
import { Stack, Typography, TextField } from '@mui/material';
import { SxProps } from '@mui/system';

export interface ComponentProps {
    disabled?: boolean;
    title?: string;
    inputValue?: string;
    placeholder?: string;
    height?: number;
    multiline?: boolean;
    rows?: number;
    fontSize?: number;
    fontWeight?: number;
    number?: boolean;
    error?: boolean;
    errorText?: string;
    limit?: number;
    sx?: SxProps;
    changeHandler?: (value: string) => void;
}

const CustomTextField: React.FC<ComponentProps> = ({
    disabled,
    inputValue,
    title,
    placeholder,
    height,
    multiline,
    rows,
    fontSize,
    fontWeight,
    number = false,
    error = false,
    errorText = '',
    limit,
    sx,
    changeHandler = () => {},
}): JSX.Element => {
    const [text, setText] = useState('');
    const [invalid, setInvalid] = useState<boolean>(true);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = limit ? event.target.value.slice(0, limit) : event.target.value;
        let valid = false;
        if (number) {
            valid = !isNaN(Number(value));
        } else {
            valid = true;
        }

        if (valid) {
            setText(value);
            changeHandler(value);
        }
    };

    React.useEffect(() => {
        setInvalid(number ? text === '' || isNaN(Number(text)) : !text);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

    React.useEffect(() => {
        setText(inputValue === undefined || (number && inputValue === 'NaN') ? '' : inputValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue]);

    React.useEffect(() => {
        if (error) setInvalid(true);
    }, [error]);

    return (
        <Stack spacing={0.5} sx={{ ...sx }}>
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
                        height: multiline ? 'auto' : height === undefined ? 40 : height,
                        '& fieldset, &:hover fieldset': {
                            borderWidth: error && invalid ? 2 : 0,
                            borderColor: error && invalid ? '#EB5757' : 'white',
                        },
                        '&.Mui-focused fieldset': {
                            borderWidth: 2,
                            borderColor: error && invalid ? '#EB5757' : '#1890FF',
                        },
                        '& input': {
                            height: height === undefined ? 40 : height,
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
