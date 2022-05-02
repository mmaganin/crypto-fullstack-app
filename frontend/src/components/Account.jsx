import { Box, TextField } from '@mui/material';

function Account() {
    return (
        <div>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <TextField
                        error
                        id="outlined-error"
                        label="Error"
                    />
                    <TextField
                        error
                        id="outlined-error-helper-text"
                        label="Error"
                        helperText="Incorrect entry."
                    />
                </div>

            </Box>
        </div>
    );
}

export default Account;