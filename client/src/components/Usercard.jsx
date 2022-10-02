import React from 'react';
import { Link } from 'react-router-dom';
import {
    Grid,
    Typography,
    Box,
    Avatar,
    Divider,
} from '@mui/material'

const Usercard = () => {

    return (
        <Grid container sx={{
            paddingBottom: 2.5,
            width: '70%',
            backgroundColor: 'yellow',
            display: "flex", 
            flexFlow: "column nowrap",
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 2,
            position: 'relative'
        }}> 
            <Box sx={{ borderTopLeftRadius: 5, borderTopRightRadius: 5, zIndex: 1, backgroundColor: 'red', width: '100%', height: 80,  }} />
            <Grid item sx={{ zIndex: 2, position: 'relative', top: -40, }}>
                <Avatar alt="alt here" src="img link here" sx={{ width: 75, height: 75 }} />
            </Grid>
            <Grid item sx={{ textAlign: 'center', position: 'relative', top: -30 }}>
                <Typography>Username</Typography>
                <Typography>@User Handle</Typography>
            </Grid>
            <Divider variant="middle" flexItem sx={{ marginBottom: 2}}/>
            <Grid container sx={{            
                display: "flex", 
                flexFlow: "row nowrap",
                justifyContent: 'center',
                alignItems: 'center',  
                gap: 2, 
                width: '90%',  
                marginBottom: 2,  
            }}>
                <Grid item xs={5} sx={{ textAlign: 'center',  }}>
                    {/* Need to add link to user follower page */}
                    <Typography>0</Typography>
                    <Typography>Followers</Typography>
                </Grid>
                <Grid item xs={5} sx={{ textAlign: 'center' }}>
                    {/* Need to add link to user following page */}
                    <Typography>13434</Typography>
                    <Typography>Followings</Typography>
                </Grid>
            </Grid>
            <Divider variant="middle" flexItem/>
            <Grid item sx={{marginTop: 2}}>
                <Typography><Link to="/userporfile/:id">My Profile</Link></Typography>
            </Grid>
        </Grid>
    )
}

export default Usercard;