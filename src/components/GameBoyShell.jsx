import React, {useEffect, useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import BootScreen from './BootScreen.jsx'

const EXTERNAL = {
  movies: 'https://backup-plan-gamma.vercel.app/',
  playlist: 'https://play-chi.vercel.app/',
  messages: 'https://goodmorningh.netlify.app/'
}

export default function GameBoyShell({ initialPage }){
  const navigate = useNavigate()
  const menuItems = ['Movies Together','Playlist','Morning Messages','Heaven Journey']
  const [selected, setSelected] = useState(0)
  const [showPanel, setShowPanel] = useState(false)
  const [panelTitle, setPanelTitle] = useState('Welcome')
  const [panelContent, setPanelContent] = useState('Select a menu item to open content.')
  const [muted, setMuted] = useState(()=> localStorage.getItem('hh_muted') === '1')
  const [booting, setBooting] = useState(()=> localStorage.getItem('hh_seen_boot') !== '1')
  const bgAudioRef = useRef(null)

  useEffect(()=>{
    if (initialPage === 'messages') { setTimeout(()=> openInternal('messages'), 300) }
    if (initialPage === 'journey') { setTimeout(()=> openInternal('journey'), 300) }
  },[initialPage])

  useEffect(()=>{
    const bg = new Audio('/sounds/bgloop.wav'); bg.loop = true; bg.volume = 0.18; bgAudioRef.current = bg; if (!muted) bg.play().catch(()=>{});
    return ()=> { bg.pause(); bg.currentTime = 0 }
  },[])

  useEffect(()=>{
    localStorage.setItem('hh_muted', muted ? '1' : '0')
    if (bgAudioRef.current){ muted ? bgAudioRef.current.pause() : bgAudioRef.current.play().catch(()=>{}) }
  },[muted])

  useEffect(()=>{
    const onKey = (e)=>{
      if (e.key === 'ArrowDown'){ setSelected(s => (s+1)%menuItems.length); e.preventDefault() }
      if (e.key === 'ArrowUp'){ setSelected(s => (s-1+menuItems.length)%menuItems.length); e.preventDefault() }
      if (e.key === 'Enter'){ handleActivate(selected) }
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[selected])

  function play(name){
    if (muted) return
    const a = new Audio('/sounds/' + name + '.wav'); a.volume = 0.9; a.play().catch(()=>{})
  }

  function handleActivate(idx){
    play('select')
    if (idx === 0){ window.open(EXTERNAL.movies, '_blank', 'noopener') }
    else if (idx === 1){ window.open(EXTERNAL.playlist, '_blank', 'noopener') }
    else if (idx === 2){ window.open(EXTERNAL.messages, '_blank', 'noopener') }
    else if (idx === 3){ navigate('/journey'); setPanelTitle('Heaven Journey'); setPanelContent('A short journey — placeholder content.'); setShowPanel(true) }
  }

  function openInternal(which){
    if (which === 'messages'){ setPanelTitle('Morning Messages'); setPanelContent('Retro-styled Messages page — coming soon!'); setShowPanel(true) }
    if (which === 'journey'){ setPanelTitle('Heaven Journey'); setPanelContent('A short journey — placeholder content.'); setShowPanel(true) }
  }

  function finishBoot(){ setBooting(false); localStorage.setItem('hh_seen_boot', '1') }
  if (booting) return <BootScreen onFinish={finishBoot} />

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <div className="device">
        <div className="device-shell">
          <div className="screen-frame">
            <div className="screen" role="application" aria-label="Heaven Hub GameBoy">
              <div style={{position:'absolute', right:10, top:8}}>
                <button onClick={()=> setMuted(m => !m)} style={{padding:6, borderRadius:6, border:'3px solid rgba(0,0,0,0.12)', background:'#d0f0c9', cursor:'pointer'}} aria-pressed={muted}>
                  {muted ? '🔇' : '🔊'}
                </button>
              </div>
              <div className="header">
                <div className="title">HEAVEN HUB</div>
                <div className="subtitle">CHOOSE WHERE YOU WANT<br/>TO GO WITH ME...</div>
              </div>
              <div className="menu" role="listbox" aria-label="Main menu">
                {menuItems.map((m,i)=>(
                  <button key={m} className="menu-btn" aria-selected={i===selected} onClick={()=> { setSelected(i); handleActivate(i) }}>
                    <span style={{display:'inline-block', width:16, textAlign:'center'}}>{i===selected ? '▶' : ' '}</span>
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="screen-footer">
                <div className="hint">Use arrow keys or click — press Enter to open</div>
              </div>
            </div>
          </div>
          <div className="controls">
            <div className="dpad" aria-hidden>
              <div className="dpad-inner">
                <div className="up"></div><div className="left"></div><div className="center"></div><div className="right"></div><div className="down"></div>
              </div>
            </div>
            <div className="small-buttons">
              <div className="select-start"><div className="sel">SELECT</div><div className="str">START</div></div>
              <div className="ab">
                <div className="btn a" onClick={()=> window.open(EXTERNAL.movies, '_blank', 'noopener')} aria-label="A button">A</div>
                <div className="btn b" onClick={()=> window.open(EXTERNAL.playlist, '_blank', 'noopener')} aria-label="B button">B</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPanel && (
        <div className="panel" role="dialog" aria-label={panelTitle}>
          <h2>{panelTitle}</h2>
          <div>{panelContent}</div>
          <div style={{marginTop:12}}><button className="close-btn" onClick={()=> setShowPanel(false)}>Close</button></div>
        </div>
      )}
    </div>
  )
}
