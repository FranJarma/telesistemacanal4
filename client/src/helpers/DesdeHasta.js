const DesdeHasta = ({desde, hasta, proposito, title1, title2}) => (
    <><span title={title1} style={{color: "coral"}}>{desde}</span><i title={proposito} className='bx bxs-right-arrow-square bx-xs'></i><span style={{color: "#4D7F9E"}} title={title2}>{hasta}</span></>
);

export default DesdeHasta;