import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme =>({
    botonIniciarSesion: {
        textAlign: 'center',
        borderRadius: 0,
        marginTop: '1.5rem'
    },
    cartaPrincipal: {
        marginLeft: '3rem',
        marginRight: '3rem',
        marginTop: '3rem',
        marginBottom: '3rem'
    },
    cartaSecundaria: {
        borderLeft: '3px solid #4D7F9E'
    },
    cartaIngresos: {
        background: 'linear-gradient(90deg, rgba(0,128,28,1) 25%, rgba(0,92,20,1) 75%, rgba(0,82,18,1) 100%)',
        color: "white",
        marginTop: '3rem',
        margin: "30px",
        '&:hover': {
            boxShadow: '1px 9px 49px 5px rgba(0,0,0,0.59)'
        }
    },
    cartaOtPendientes: {
        background: 'linear-gradient(90deg, rgba(0,101,128,1) 25%, rgba(0,79,101,1) 75%, rgba(0,67,85,1) 100%)',
        color: "white",
        marginTop: '3rem',
        margin: "30px",
        '&:hover': {
            boxShadow: '1px 9px 49px 5px rgba(0,0,0,0.59)'
        }
    },
    cartaAbonadosActivos: {
        background: 'linear-gradient(90deg, rgba(0,128,128,1) 25%, rgba(0,68,68,1) 75%, rgba(0,60,60,1) 100%)',
        color: "white",
        marginTop: '3rem',
        margin: "30px",
        '&:hover': {
            boxShadow: '1px 9px 49px 5px rgba(0,0,0,0.3)'
        }
    },
    cantidad: {
        color: "#4D7F9E",
        fontSize: "40px",
        float: "right",
        fontFamily: 'Poppins, sans-serif'
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
    cartaError: {
        backgroundColor: '#e2e2e2',
        marginTop: '10rem',
        [theme.breakpoints.up('lg')]:{
            marginTop: '20rem',
            marginLeft: '5rem',
            marginRight: '60rem',
        },
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
    },    logoLogin: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '150px',
        height: '150px'
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