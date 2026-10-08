"use client";
import AppShell from "@/components/layout/AppShell";
import { useMemo, useState } from "react";
import { Scale, Target, TrendingDown, Dumbbell, Plus, CalendarDays, ArrowDown, Sparkles } from "lucide-react";
import { useNeurofit } from "@/lib/store";

export default function Evolucao(){
  const {currentUser,addWeight}=useNeurofit();
  const [weight,setWeight]=useState("");
  const weights=currentUser.weights;
  const current=currentUser.profile.weight||0;
  const start=weights[0]?.weight||current;
  const target=currentUser.profile.targetWeight||0;
  const lost=start-current;
  const distance=Math.abs(current-target);
  const progress=target&&start!==target ? Math.max(0,Math.min(100,Math.round(Math.abs(start-current)/Math.abs(start-target)*100))) : 0;
  const recent=weights.slice(-6);
  const min=recent.length?Math.min(...recent.map(w=>w.weight)):0;
  const max=recent.length?Math.max(...recent.map(w=>w.weight)):0;

  const points=useMemo(()=>{
    if(recent.length<2)return "";
    const range=Math.max(.5,max-min);
    return recent.map((w,i)=>{
      const x=(i/(recent.length-1))*100;
      const y=92-((w.weight-min)/range)*68;
      return `${x},${y}`;
    }).join(" ");
  },[recent,max,min]);

  function submit(e:React.FormEvent){e.preventDefault(); if(+weight){addWeight(+weight);setWeight("")}}

  return <AppShell><div className="mobile-content">
    <header>
      <p className="section-title">SEU PROGRESSO</p>
      <h1 className="mt-2 text-[30px] font-black tracking-tight">Sua evolução</h1>
      <p className="mt-2 text-sm leading-6 text-[#7897ae]">Acompanhe seu peso, veja sua tendência e mantenha o foco no objetivo.</p>
    </header>

    <section className="mt-5 rounded-[28px] border border-[#11527f] bg-[radial-gradient(circle_at_85%_15%,rgba(0,156,255,.20),transparent_42%),linear-gradient(145deg,#071a2a,#040a11)] p-5 shadow-[0_18px_60px_rgba(0,90,180,.12)]">
      <div className="flex items-center justify-between gap-4">
        <div><p className="text-xs font-bold tracking-[.16em] text-[#6f8ea5]">PESO ATUAL</p><p className="mt-1 text-[34px] font-black">{current.toFixed(1)} <span className="text-lg text-[#7e99aa]">kg</span></p></div>
        <div className="relative h-24 w-24 shrink-0 rounded-full" style={{background:`conic-gradient(#0aaaff ${progress*3.6}deg,#0b2235 ${progress*3.6}deg)`}}><div className="absolute inset-[7px] flex flex-col items-center justify-center rounded-full bg-[#06111b]"><span className="text-lg font-black text-[#19dfff]">{progress}%</span><span className="text-[9px] text-[#6f8ea5]">META</span></div></div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-[#123b5c] bg-[#03101a]/80 p-3"><p className="text-[10px] text-[#6f8ea5]">META</p><p className="mt-1 font-black">{target?`${target.toFixed(1)} kg`:'—'}</p></div>
        <div className="rounded-2xl border border-[#123b5c] bg-[#03101a]/80 p-3"><p className="text-[10px] text-[#6f8ea5]">DISTÂNCIA</p><p className="mt-1 font-black">{target?`${distance.toFixed(1)} kg`:'—'}</p></div>
      </div>
    </section>

    <div className="mt-3 grid grid-cols-2 gap-3">
      <Stat icon={<TrendingDown size={18}/>} label="Mudança" value={lost>0?`-${lost.toFixed(1)} kg`:lost<0?`+${Math.abs(lost).toFixed(1)} kg`:'0 kg'} sub="desde o início" good={lost>0}/>
      <Stat icon={<Dumbbell size={18}/>} label="Treinos" value={String(currentUser.workouts.filter(w=>w.completed).length)} sub="concluídos"/>
    </div>

    <section className="glass mt-4 rounded-[26px] p-5">
      <div className="flex items-center justify-between"><div><p className="section-title">HISTÓRICO</p><h2 className="mt-1 text-xl font-black">Tendência do peso</h2></div><div className="rounded-xl bg-[#062b49] p-2.5 text-[#19dfff]"><TrendingDown size={18}/></div></div>
      {recent.length<2 ? <div className="mt-5 rounded-2xl border border-dashed border-[#17496c] bg-[#04101a] p-7 text-center"><p className="text-sm font-semibold">Ainda faltam registros</p><p className="mt-1 text-xs leading-5 text-[#6f8da5]">Registre seu peso algumas vezes para vermos a tendência.</p></div> : <div className="mt-5 overflow-hidden rounded-2xl border border-[#123653] bg-[#030c14] p-3"><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-44 w-full"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#0aaaff" stopOpacity=".25"/><stop offset="1" stopColor="#0aaaff" stopOpacity="0"/></linearGradient></defs><polygon points={`0,100 ${points} 100,100`} fill="url(#area)"/><polyline points={points} fill="none" stroke="#12cfff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>{recent.map((w,i)=>{const range=Math.max(.5,max-min);const x=(i/(recent.length-1))*100;const y=92-((w.weight-min)/range)*68;return <circle key={w.id} cx={x} cy={y} r="2.2" fill="#071827" stroke="#19dfff" strokeWidth="1.4" vectorEffect="non-scaling-stroke"/>})}</svg><div className="mt-2 flex justify-between text-[10px] text-[#5f7d94]"><span>{recent[0]?.date?.slice(0,10)||''}</span><span>{recent[recent.length-1]?.date?.slice(0,10)||''}</span></div></div>}
    </section>

    <section className="mt-4 rounded-[26px] border border-[#11527f] bg-[linear-gradient(145deg,#061b2b,#04101a)] p-5">
      <div className="flex items-start gap-3"><div className="rounded-xl bg-[#062b49] p-2.5 text-[#19dfff]"><Scale size={19}/></div><div><h2 className="font-black">Registrar novo peso</h2><p className="mt-1 text-xs leading-5 text-[#7897ae]">Use de preferência o mesmo horário e condições para comparar melhor.</p></div></div>
      <form onSubmit={submit} className="mt-4 flex gap-2"><input required type="number" step="0.1" value={weight} onChange={e=>setWeight(e.target.value)} className="field flex-1" placeholder="Ex.: 96,4 kg"/><button className="blue-gradient flex shrink-0 items-center gap-2 rounded-2xl px-4 font-black"><Plus size={18}/> Salvar</button></form>
    </section>

    <section className="glass mt-4 rounded-[26px] p-5"><div className="flex items-center gap-3"><div className="rounded-xl bg-[#062b49] p-2.5 text-[#19dfff]"><Target size={18}/></div><div><p className="font-bold">Seu objetivo</p><p className="text-xs text-[#7897ae]">{currentUser.profile.goal||'Configure seu objetivo'}</p></div></div><div className="mt-4 flex items-center gap-3 text-sm"><span className="font-bold">{current.toFixed(1)} kg</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-[#102437]"><div className="blue-gradient h-full rounded-full" style={{width:`${progress}%`}}/></div><span className="font-bold text-[#19dfff]">{target?`${target.toFixed(1)} kg`:'—'}</span></div></section>
  </div></AppShell>
}
function Stat({icon,label,value,sub,good}:{icon:React.ReactNode;label:string;value:string;sub:string;good?:boolean}){return <div className="glass rounded-2xl p-4"><div className="flex items-center gap-2 text-[#19dfff]"><span className="rounded-lg bg-[#062b49] p-2">{icon}</span><span className="text-[10px] font-bold text-[#7897ae]">{label}</span></div><p className={`mt-3 text-xl font-black ${good?'text-[#2be697]':''}`}>{value}</p><p className="mt-1 text-[10px] text-[#5f7d94]">{sub}</p></div>}
