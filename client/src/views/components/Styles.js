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
    cartaSecundaria: {
        borderLeft: '3px solid teal'
    },
    cartaHome: {
        marginTop: '3rem',
        borderLeft: '3px solid teal'
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
                border: '1px solid #000000',  
            },
            '&:hover fieldset': {
                border: '1px solid #000000',
            },
            '&.Mui-focused fieldset': {
                border: '1px solid #000000',
            },
        },
    },
    helperForm: {
        marginTop: '0px'
    }
}))

export default useStyles;