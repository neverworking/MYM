import React from 'react'
import { Routes, Route } from 'react-router-dom'
import GameBoyShell from './components/GameBoyShell.jsx'
import Messages from './pages/Messages.jsx'
import Journey from './pages/Journey.jsx'

export default function App(){
  return (
    <Routes>
      <Route path='/' element={<GameBoyShell />} />
      <Route path='/messages' element={<GameBoyShell initialPage="messages" />} />
      <Route path='/journey' element={<GameBoyShell initialPage="journey" />} />
      <Route path='*' element={<GameBoyShell />} />
    </Routes>
  )
}