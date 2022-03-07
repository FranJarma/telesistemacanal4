const DesdeHasta = ({desde, hasta, proposito, title1, title2}) => (
    <><span title={title1} style={{color: "orange"}}>{desde}</span><i title={proposito} className='bx bxs-right-arrow-square bx-xs'></i><span style={{color: "teal"}} title={title2}>{hasta}</span></>
);

export default DesdeHasta;