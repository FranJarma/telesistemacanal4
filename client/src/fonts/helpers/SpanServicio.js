
const spanServicio = ({servicioId, servicioNombre, onuMac}) => {

    if(servicioId === 1) {
        return <span  style={{color: 'navy'}}><i className='bx bx-tv bx-xs'></i> {servicioNombre}</span>
    }
    else if(servicioId === 2) {
        return <span style={{color: '#4D7F9E'}}><i className='bx bx-wifi bx-xs'></i> {servicioNombre} - <b>MAC: </b> {onuMac}</span>
    }
    else {
        return <span style={{color: 'orange'}}><i className='bx bxs-offer bx-xs'></i> {servicioNombre} - {onuMac}</span>
    }
}

export default spanServicio;
