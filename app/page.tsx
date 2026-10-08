import Link from "next/link";
import Image from "next/image";
import {ArrowRight,Dumbbell,Brain,ChartNoAxesCombined} from "lucide-react";
export default function Home(){return <main className="mobile-app grid-bg min-h-[100dvh] px-5 pb-8 pt-8">
 <div className="flex min-h-[calc(100dvh-64px)] flex-col items-center text-center">
   <div className="mt-5 flex flex-col items-center">
     <div className="relative flex h-[190px] w-[190px] items-center justify-center">
       <div className="absolute inset-4 rounded-[54px] bg-[#007cff]/10 blur-2xl"/>
       <div className="absolute inset-1 rounded-[58px] border border-[#0d83d8]/40 bg-gradient-to-b from-[#061421] to-[#02060b] shadow-[0_0_45px_rgba(0,139,255,.18)]"/>
       <Image src="/neurofit-logo.png" alt="NEUROFIT" width={180} height={100} className="relative w-[180px]" priority/>
     </div>
     <div className="mt-4 h-[2px] w-10 bg-gradient-to-r from-transparent via-[#18dfff] to-transparent shadow-[0_0_10px_#00bfff]"/>
     <p className="mt-5 max-w-[250px] text-[11px] font-bold tracking-[.28em] text-[#a7b6c2]">SEU TREINO INTELIGENTE<br/>COM <span className="text-[#16cfff]">IA</span></p>
   </div>
   <Link href="/cadastro" className="blue-gradient mt-9 flex w-full max-w-[330px] items-center justify-center gap-4 rounded-full px-6 py-4 text-[12px] font-black tracking-[.14em]">COMEÇAR <ArrowRight size={19}/></Link>
   <div className="mt-auto grid w-full max-w-[360px] grid-cols-3 gap-3 pb-2 pt-12">
     <Feature icon={<Dumbbell/>} title="TREINOS" sub="PERSONALIZADOS"/>
     <Feature icon={<Brain/>} title="IA" sub="INTELIGENTE"/>
     <Feature icon={<ChartNoAxesCombined/>} title="EVOLUÇÃO" sub="EM TEMPO REAL"/>
   </div>
   <Link href="/login" className="mt-5 text-xs font-semibold text-[#66859c]">Já tenho uma conta</Link>
 </div>
 </main>}
function Feature({icon,title,sub}:{icon:React.ReactNode,title:string,sub:string}){return <div className="flex flex-col items-center"><div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#21455f] bg-[#030a11] text-[#19dfff] shadow-[inset_0_0_18px_rgba(0,131,255,.08)]">{icon}</div><p className="mt-2 text-[9px] font-black tracking-wide text-[#dbe7ef]">{title}</p><p className="text-[8px] font-bold tracking-wide text-[#788e9f]">{sub}</p></div>}
