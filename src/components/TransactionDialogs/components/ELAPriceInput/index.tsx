import React, { useState } from 'react';
import { Stack, Typography, TextField } from '@mui/material';

export interface ComponentProps {
    title?: string;
    inputValue?: string;
    placeholder?: string;
    error?: boolean;
    errorText?: string;
    handleChange?: (value: number) => void;
}

const ELAPriceInput: React.FC<ComponentProps> = ({
    title,
    inputValue,
    placeholder,
    error = false,
    errorText = '',
    handleChange = () => {},
}): JSX.Element => {
    const [input, setInput] = useState('0');
    const [status, setStatus] = useState<'none' | 'active'>('none');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        let valid = !isNaN(Number(value));
        if (valid) setInput(value);

        handleChange(parseFloat(value));
        // setInput(isNaN(parseFloat(value)) ? 0 : parseFloat(value));
        // handleChange(isNaN(parseFloat(value)) ? 0 : parseFloat(value));
    };

    React.useEffect(() => {
        setInput(inputValue === undefined ? '' : inputValue);
    }, [inputValue]);

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
                border={`1px solid ${status === 'none' ? 'transparent' : '#1890FF'}`}
                sx={{ background: '#F0F1F2' }}
            >
                <TextField
                    placeholder={placeholder}
                    value={input}
                    onChange={handleInputChange}
                    onFocus={() => setStatus('active')}
                    onBlur={() => setStatus('none')}
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
                    <Typography fontSize={16} fontWeight={700} marginLeft={0.5} sx={{ wordBreak: 'normal' }}>
                        ELA
                    </Typography>
                </Stack>
            </Stack>
            {error && (
                <Typography fontSize={12} fontWeight={500} color="#EB5757">
                    {errorText}
                </Typography>
            )}
        </Stack>
    );
};

export default ELAPriceInput;
