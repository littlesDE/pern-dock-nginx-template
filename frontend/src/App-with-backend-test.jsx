import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [backendMessage, setBackendMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Test backend connectivity
  useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await fetch('/api')
        const data = await response.json()
        setBackendMessage(data.message)
      } catch (error) {
        setBackendMessage('Backend not available')
        console.error('Backend error:', error)
      } finally {
        setLoading(false)
      }
    }

    testBackend()
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      
      {/* Backend connectivity indicator */}
      <div className="card">
        <h3>Backend Status:</h3>
        {loading ? (
          <p>Checking backend...</p>
        ) : (
          <p style={{ color: backendMessage === 'Backend not available' ? 'red' : 'green' }}>
            {backendMessage}
          </p>
        )}
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
