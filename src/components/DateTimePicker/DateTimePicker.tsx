import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Select, MenuItem, TextField, Dialog, DialogContent, Typography, Stack } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CalendarPicker from '@mui/lab/CalendarPicker';
import { addDays } from 'date-fns';
import { useSnackbar } from 'notistack';
import { PrimaryButton } from '../Buttons/styles';
import { getDateTimeString, getTimeZone } from 'src/services/common';
import { SelectChangeEvent } from '@mui/material';
import { SxProps } from '@mui/system';

const MenuProps = {
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
    },
    transformOrigin: {
        vertical: 'top',
        horizontal: 'left',
    },
    variant: 'menu',
};
const menuItems = ['1 DAY', '1 WEEK', '1 MONTH', 'Pick a specific date'];
const pickDateIndex = 3;

const CalendarBoxStyle = styled(Box)(({ theme }) => ({
    '& .MuiCalendarPicker-root button.Mui-selected': {
        color: theme.palette.background.paper,
        backgroundColor: theme.palette.text.primary,
    },
}));

export interface ComponentProps {
    onChangeDate: (value: Date) => void;
    sx: SxProps;
}

const DateTimePicker: React.FC<ComponentProps> = ({ onChangeDate, sx }): JSX.Element => {
    const [selected, setSelected] = useState<number>(-1);
    const [dateValue, setDateValue] = useState<Date>(new Date());
    const [timeValue, setTimeValue] = useState<string>(
        `${dateValue.getHours().toString().padStart(2, '0')}:${dateValue.getMinutes().toString().padStart(2, '0')}`,
    );
    const [isOpenPicker, setOpenPicker] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (event: SelectChangeEvent<number>) => {
        const selectedIndex =
            typeof event.target.value === 'string' ? parseInt(event.target.value) : event.target.value;
        setSelected(selectedIndex);
        if (selectedIndex === pickDateIndex) onChangeDate(dateValue);
        else onChangeDate(addDays(new Date(), (selectedIndex === 0 ? 1 : selectedIndex === 1 ? 7 : 30)));
    };

    const handleSpecificPicker = (event: any) => {
        if (event.target.getAttribute('data-value') === pickDateIndex.toString()) setOpenPicker(true);
    };

    const renderValue = (option: number) => {
        if (option === pickDateIndex) return <span>{getDateTimeString(dateValue)}</span>;
        return <span>{menuItems[option]}</span>;
    };

    const handleSpecificDate = () => {
        setOpenPicker(false);
    };

    // datepicker
    const handleDateChange = (newDate: any) => {
        const splitTime = timeValue.split(':');
        newDate.setHours(splitTime[0]);
        newDate.setMinutes(splitTime[1]);
        newDate.setSeconds(0);
        setDateValue(newDate);
        onChangeDate(newDate);
    };

    const handleTimeChange = (event: any) => {
        const splitTime = event.target.value.split(':');
        const tempDate = dateValue;
        tempDate.setHours(splitTime[0]);
        tempDate.setMinutes(splitTime[1]);
        tempDate.setSeconds(0);
        if (tempDate < new Date()) {
            enqueueSnackbar('Past time can not be selected!', { variant: 'warning' });
            return;
        }
        setTimeValue(event.target.value);
        setDateValue(tempDate);
        onChangeDate(tempDate);
    };

    const handleClosePicker = () => {
        setOpenPicker(false);
    };
    return (
        <>
            <Select
                // defaultValue={0}
                variant="standard"
                value={selected}
                onChange={handleChange}
                onClick={handleSpecificPicker}
                inputProps={{ 'aria-label': 'Without label' }}
                size="small"
                sx={sx}
                renderValue={renderValue}
                // MenuProps={MenuProps}
            >
                {menuItems.map((type, i) => (
                    <MenuItem key={i} value={i} autoFocus={selected === i}>
                        {type}
                    </MenuItem>
                ))}
            </Select>
            <Dialog open={isOpenPicker} onClose={handleClosePicker}>
                <DialogContent>
                    <CalendarBoxStyle>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <CalendarPicker disablePast date={dateValue} onChange={handleDateChange} />
                        </LocalizationProvider>
                    </CalendarBoxStyle>
                    <Stack direction="row" sx={{ mb: 1 }}>
                        <Typography variant="body2" component="div" sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ display: 'block' }}>
                                Select time
                            </Typography>
                            Your time zone is UTC{getTimeZone()}
                        </Typography>
                        <TextField
                            variant="standard"
                            type="time"
                            sx={{
                                '& input[type="time"]': {
                                    p: 1,
                                },
                                '& input[type="time"]::-webkit-calendar-picker-indicator': {
                                    cursor: 'pointer',
                                    p: 1,
                                    border: '1px solid',
                                    borderColor: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? theme.palette.grey[800]
                                            : theme.palette.grey[400],
                                    borderRadius: '100%',
                                    filter: (theme) => `invert(${theme.palette.mode === 'dark' ? 1 : 0})`,
                                },
                                '& input[type="time"]::-webkit-calendar-picker-indicator:hover': {
                                    borderColor: (theme) => theme.palette.grey[500],
                                },
                                '& :before, & :after': { display: 'none' },
                            }}
                            value={timeValue}
                            onChange={handleTimeChange}
                        />
                    </Stack>
                    <PrimaryButton onClick={handleSpecificDate} fullWidth>
                        Apply
                    </PrimaryButton>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DateTimePicker;
