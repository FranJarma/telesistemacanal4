import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Error401 = () => {
    const [counter, setCounter] = useState(3);
    let navigate = useNavigate();
    useEffect(() => {
        const timeout = setTimeout(() => {
          setCounter(counter -1);
        }, 1000);
        if(counter === 0) navigate('/home');
        return () => {
          clearTimeout(timeout);
        };
      }, [counter]);

    return (
        <>
        <section className="error-401">
            <h1>401</h1>
            <h2>No autorizado</h2>
            <p>Usted no tiene permisos suficientes para acceder a este recurso. Volviendo a home en... {counter}</p>
        </section>
        </>
    );
}
 
export default Error401;