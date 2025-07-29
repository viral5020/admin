export const getInputBoxStyle = (isDarkMode) => ({
    backgroundColor: isDarkMode ? '#263238' : '#fff',
    borderRadius: 1,
    '& .MuiOutlinedInput-root': {
        height: 40,
        '& fieldset': {
            borderColor: '#c4c4c4',
        },
        '&:hover fieldset': {
            borderColor: '#000',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#000',
        },
    },
});
