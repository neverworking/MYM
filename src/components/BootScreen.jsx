import React, {useEffect} from 'react'

export default function BootScreen({onFinish}){
  useEffect(()=>{
    const bootAudio = new Audio('/sounds/boot.wav'); bootAudio.volume = 0.8; bootAudio.play().catch(()=>{});
    const t = setTimeout(()=> onFinish && onFinish(), 2000); return ()=> clearTimeout(t);
  },[])
  return (
    <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.6)',zIndex:9999}}>
      <div style={{background:'#0f380f', padding:20, borderRadius:8, border:'4px solid #063006', color:'#9bbc0f', textAlign:'center', width:360}}>
        <div style={{fontSize:14}}>HEAVEN</div>
        <div style={{fontSize:10, opacity:0.9}}>GAME BOY — BOOT SEQUENCE</div>
        <div style={{marginTop:12, fontSize:11}}>Starting...</div>
      </div>
    </div>
  )
}