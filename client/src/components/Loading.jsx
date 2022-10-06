import {
    CircularProgress,
    Box
} from '@mui/material'
function Loading() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box> 
    )
}

export default Loading