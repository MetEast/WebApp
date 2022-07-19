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

// const MenuProps = {
//     anchorOrigin: {
//         vertical: 'bottom',
//         horizontal: 'left',
//     },
//     transformOrigin: {
//         vertical: 'top',
//         horizontal: 'left',
//     },
//     variant: 'menu',
// };
const menuItems = ['', '1 DAY', '1 WEEK', '1 MONTH', 'Pick a specific date'];
const pickDateIndex = 4;

const CalendarBoxStyle = styled(Box)(({ theme }) => ({
    '& .MuiCalendarPicker-root button.Mui-selected': {
        color: theme.palette.background.paper,
        backgroundColor: theme.palette.text.primary,
    },
}));

const MenuItemStyle = styled(MenuItem)(() => ({
    '&:hover': {
        background: '#e8f4ff',
    },
}));

export interface ComponentProps {
    onChangeDate: (value: Date) => void;
    value?: number;
    error: boolean;
}

const DateTimePicker: React.FC<ComponentProps> = ({ onChangeDate, value, error }): JSX.Element => {
    const [selected, setSelected] = useState<number>(0);
    const [dateValue, setDateValue] = useState<Date>(value ? new Date(value * 1e3) : new Date());
    const [timeValue, setTimeValue] = useState<string>(
        `${dateValue.getHours().toString().padStart(2, '0')}:${dateValue.getMinutes().toString().padStart(2, '0')}`,
    );
    const [isOpenPicker, setOpenPicker] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (event: SelectChangeEvent<number>) => {
        const selectedIndex =
            typeof event.target.value === 'string' ? parseInt(event.target.value) : event.target.value;
        setSelected(selectedIndex);
        if (selectedIndex === 0) onChangeDate(new Date(0));
        else if (selectedIndex === pickDateIndex) onChangeDate(dateValue);
        // else onChangeDate(addDays(new Date(), (selectedIndex === 0 ? 1 : selectedIndex === 1 ? 7 : 30)));
        else {
            const newDate = addDays(new Date(), selectedIndex === 1 ? 1 : selectedIndex === 2 ? 7 : 30);
            handleDateChange(newDate);
        }
    };

    const handleSpecificPicker = (event: any) => {
        if (event.target.getAttribute('data-value') === pickDateIndex.toString()) setOpenPicker(true);
    };

    const renderValue = (option: number) => {
        // if (option === pickDateIndex) return <span>{getDateTimeString(dateValue)}</span>;
        // return <span>{menuItems[option]}</span>;
        if (value === 0) return <span></span>;
        return <span>{getDateTimeString(dateValue)}</span>;
    };

    const handleSpecificDate = () => {
        if (dateValue < new Date()) {
            enqueueSnackbar('Past time can not be selected!', { variant: 'warning' });
            return;
        }
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
        let time = event.target.value;
        if(!time) {
            let date = new Date();
            time = date.getHours() + ':' + date.getMinutes();
        }
        const splitTime = time.split(':');
        const tempDate = dateValue;
        tempDate.setHours(splitTime[0]);
        tempDate.setMinutes(splitTime[1]);
        tempDate.setSeconds(0);
        // if (tempDate < new Date()) {
        //     enqueueSnackbar('Past time can not be selected!', { variant: 'warning' });
        //     return;
        // }
        setTimeValue(time);
        setDateValue(tempDate);
        onChangeDate(tempDate);
    };

    const handleClosePicker = () => {
        setOpenPicker(false);
    };
    return (
        <>
            <Select
                defaultValue={undefined}
                variant="outlined"
                value={selected}
                onChange={handleChange}
                onClick={handleSpecificPicker}
                inputProps={{ 'aria-label': 'Without label' }}
                size="small"
                sx={{
                    mr: 0,
                    width: '100%',
                    height: '40px',
                    borderRadius: '12px',
                    alignItems: 'center',
                    border: error ? '2px solid #EB5757' : 'none',
                }}
                renderValue={renderValue}
                // MenuProps={MenuProps}
            >
                {menuItems.map((type, i) => (
                    <MenuItemStyle
                        key={i}
                        value={i}
                        autoFocus={selected === i}
                        sx={{ display: i === 0 ? 'none' : 'block' }}
                    >
                        {type}
                    </MenuItemStyle>
                ))}
            </Select>
            <Dialog
                open={isOpenPicker}
                onClose={handleClosePicker}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '12px',
                    },
                }}
            >
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
