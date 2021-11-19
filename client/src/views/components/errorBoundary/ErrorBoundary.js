
function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Algo salió mal:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Recargue la página</button>
    </div>
  )
}

export default ErrorFallback;