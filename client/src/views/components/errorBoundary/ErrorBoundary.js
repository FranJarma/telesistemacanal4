import { useNavigate } from 'react-router-dom';

const ErrorBoundary = () => {
  const history = useNavigate();

  return (
    <div role="alert">
      <p>Algo salió mal</p>
      <button onClick={() => history.push('/home')}>Volver a home</button>
    </div>
  )
}
export default ErrorBoundary;