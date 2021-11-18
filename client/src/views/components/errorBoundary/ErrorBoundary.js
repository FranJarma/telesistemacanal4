
function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Algo salió mal:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Intente de nuevo</button>
    </div>
  )
}

export default ErrorFallback;