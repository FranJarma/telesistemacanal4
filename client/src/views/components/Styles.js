import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme =>({
    botonIniciarSesion: {
        textAlign: 'center',
        borderRadius: 0,
        marginTop: '1.5rem'
    },
    cartaPrincipal: {
        marginLeft: '7rem',
        marginRight: '3rem',
        marginTop: '3rem',
        marginBottom: '3rem'
    },
    cartaHome: {
        marginLeft: '5rem',
        marginRight: '3rem',
        marginTop: '3rem'
    },
    cartaLogin: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        marginTop: '10rem',
        [theme.breakpoints.up('lg')]:{
            marginLeft: '35rem',
            marginRight: '35rem',
        },
        [theme.breakpoints.down('md')]:{
            marginLeft: '15rem',
            marginRight: '15rem',
        },
        [theme.breakpoints.down('sm')]:{
            marginLeft: '5rem',
            marginRight: '5rem',
        },
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
    },
    logoLogin: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '120px',
        height: '100px'
    },
    inputModal: {
        '& .MuiOutlinedInput-root': {  
            '& fieldset': {           
                borderColor: 'grey',  
            },
            '&:hover fieldset': {
                borderColor: 'grey',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'grey',
            },
        },
    }
}))

export default useStyles;