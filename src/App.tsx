import './App.css'
import { TopBar } from './components/Layout/TopBar'
import { SideNav } from './components/Layout/SideNav'
import { Canvas } from './components/Layout/Canvas'
import { Inspector } from './components/Layout/Inspector'

function App() {
  return (
    <div className="app">
      <TopBar />
      <div className="app-body">
        <SideNav />
        <Canvas />
        <Inspector />
      </div>
    </div>
  )
}

export default App
