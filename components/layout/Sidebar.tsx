"use client";
import Link from "next/link";
import {usePathname,useRouter} from "next/navigation";
import {Home,Dumbbell,Apple,ChartNoAxesCombined,Sparkles,LogOut} from "lucide-react";
import {useNeurofit} from "@/lib/store";
const items:any[]=[
 ["/dashboard","Início",Home],
 ["/treino","Treino",Dumbbell],
 ["/alimentacao","Nutrição",Apple],
 ["/evolucao","Evolução",ChartNoAxesCombined],
 ["/assistente","IA",Sparkles]
];
export default function Sidebar(){
 const path=usePathname(); const r=useRouter(); const {logout}=useNeurofit();
 return <>
   <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-[430px] border-t border-[#103653] bg-[rgba(2,7,12,.96)] px-3 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 backdrop-blur-2xl">
     <div className="grid grid-cols-5 gap-1">
       {items.map(([href,label,Icon])=>{const active=path===href;return <Link key={href} href={href} className={`relative flex min-h-[55px] flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-bold transition ${active?"bg-[#062642] text-[#20d8ff]":"text-[#678399]"}`}>
         {active&&<span className="absolute top-0 h-[2px] w-8 rounded-full bg-[#16cfff] shadow-[0_0_12px_#008cff]"/>}
         <Icon size={19}/>{label}
       </Link>})}
     </div>
     <button onClick={()=>{logout();r.replace("/login")}} className="hidden">Sair</button>
   </div>
 </>
}
