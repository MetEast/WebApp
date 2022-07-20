import React, { useState } from 'react';
import { Stack, Typography, TextField } from '@mui/material';

export interface ComponentProps {
    title?: string;
    inputValue?: string;
    placeholder?: string;
    error?: boolean;
    errorText?: string;
    minValue?: number;
    handleChange?: (value: number) => void;
}

const ELAPriceInput: React.FC<ComponentProps> = ({
    title,
    inputValue,
    placeholder,
    error = false,
    errorText = '',
    minValue,
    handleChange = () => {},
}): JSX.Element => {
    const [input, setInput] = useState<string>('0');
    const [invalid, setInvalid] = useState<boolean>(true);
    const [status, setStatus] = useState<'none' | 'active'>('none');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const t = event.target.value;
        const value = t.indexOf('.') >= 0 ? t.substr(0, t.indexOf('.')) + t.substr(t.indexOf('.'), 3) : t;
        if (!isNaN(Number(value))) setInput(value);

        handleChange(parseFloat(value));
    };

    React.useEffect(() => {
        setInput(inputValue && !isNaN(Number(inputValue)) ? inputValue : '');
    }, [inputValue]);

    React.useEffect(() => {
        setInvalid(Number(input) === 0 || (!!minValue && Number(input) <= minValue));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input]);

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
                border={`2px solid ${error && invalid ? '#EB5757' : status === 'none' ? 'transparent' : '#1890FF'}`}
                sx={{ background: '#F0F1F2' }}
            >
                <TextField
                    placeholder={placeholder}
                    value={input}
                    onChange={handleInputChange}
                    onFocus={() => setStatus('active')}
                    onBlur={() => setStatus('none')}
                    InputProps={{ inputMode: 'numeric', inputProps: { min: 1 } }}
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
            {error && invalid && (
                <Typography fontSize={12} fontWeight={500} color="#EB5757">
                    {errorText}
                </Typography>
            )}
        </Stack>
    );
};

export default ELAPriceInput;
