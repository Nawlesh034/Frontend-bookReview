// App.jsx
import { Outlet } from 'react-router-dom'
import Navabar from './components/Navbar'

function App() {
  return (
    <div className="App h-screen w-screen">
      <Navabar />
      <Outlet />
    </div>
  )
}

export default App
