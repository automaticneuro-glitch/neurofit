"use client";
import React, {createContext, useContext, useEffect, useMemo, useState} from "react";

export type Goal = "Emagrecer" | "Ganhar massa muscular" | "Emagrecer e ganhar massa" | "Manter peso";
export type Exercise = {id:string; name:string; muscle:string; sets:number; reps:number; rest:number; tips:string[]; image:string; video:string};
export type Workout = {id:string; title:string; muscle:string; duration:number; exercises:string[]; completed:boolean; date:string};
export type FoodEntry = {id:string; date:string; meal:string; description:string; kcal:number; protein:number; carbs:number; fat:number};
export type WeightEntry = {id:string; date:string; weight:number};
export type UserProfile = {name:string; email:string; age:number; height:number; weight:number; targetWeight:number; goal:Goal; level:string; days:number; equipment:string; createdAt:string};
export type UserRecord = {id:string; passwordHash:string; profile:UserProfile; completedSets:Record<string, number>; foods:FoodEntry[]; weights:WeightEntry[]; workouts:Workout[]; createdAt:string};

type Store = {users:UserRecord[]; currentUserId:string|null};
const KEY="neurofit_store_v1";
const initial:Store={users:[],currentUserId:null};

export const exercises:Exercise[]=[
 {id:"supino",name:"Supino reto",muscle:"Peito",sets:4,reps:10,rest:90,tips:["Mantenha os pés firmes no chão.","Desça a barra com controle até a linha do peito.","Evite tirar os ombros do banco."],image:"/exercises/supino.svg",video:"/exercises/videos/supino.mp4"},
 {id:"agachamento",name:"Agachamento livre",muscle:"Pernas",sets:4,reps:10,rest:120,tips:["Mantenha o tronco firme.","Joelhos acompanham a direção dos pés.","Desça apenas até onde mantém boa técnica."],image:"/exercises/agachamento.svg",video:"/exercises/videos/agachamento.mp4"},
 {id:"puxada",name:"Puxada frontal",muscle:"Costas",sets:3,reps:12,rest:90,tips:["Peito aberto e coluna neutra.","Puxe em direção à parte alta do peito.","Evite balançar o corpo."],image:"/exercises/puxada.svg",video:"/exercises/videos/puxada.mp4"},
 {id:"remada",name:"Remada baixa",muscle:"Costas",sets:3,reps:12,rest:90,tips:["Comece com os braços estendidos.","Puxe levando os cotovelos para trás.","Controle a volta."],image:"/exercises/remada.svg",video:"/exercises/videos/remada.mp4"},
 {id:"rosca",name:"Rosca direta",muscle:"Bíceps",sets:3,reps:12,rest:60,tips:["Mantenha os cotovelos próximos ao corpo.","Não balance o tronco.","Controle a descida."],image:"/exercises/rosca.svg",video:"/exercises/videos/rosca.mp4"},
 {id:"triceps",name:"Tríceps pulley",muscle:"Tríceps",sets:3,reps:12,rest:60,tips:["Cotovelos estáveis.","Empurre até perto da extensão completa.","Retorne lentamente."],image:"/exercises/triceps.svg",video:"/exercises/videos/triceps.mp4"},
];

function load():Store{if(typeof window==="undefined") return initial; try{return JSON.parse(localStorage.getItem(KEY)||"")||initial}catch{return initial}}
function save(s:Store){localStorage.setItem(KEY,JSON.stringify(s))}
async function hash(value:string){const data=new TextEncoder().encode(value); const buf=await crypto.subtle.digest("SHA-256",data); return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("")}

const Ctx=createContext<any>(null);
export function NeurofitProvider({children}:{children:React.ReactNode}){
 const [store,setStore]=useState<Store>(initial); const [ready,setReady]=useState(false);
 useEffect(()=>{setStore(load());setReady(true)},[]);
 useEffect(()=>{if(ready)save(store)},[store,ready]);
 const current=store.users.find(u=>u.id===store.currentUserId)||null;
 const updateUser=(fn:(u:UserRecord)=>UserRecord)=>setStore(s=>({...s,users:s.users.map(u=>u.id===s.currentUserId?fn(u):u)}));
 const api=useMemo(()=>({
  ready,currentUser:current,exercises,
  async register(data:{name:string;email:string;password:string}){const email=data.email.trim().toLowerCase(); if(store.users.some(u=>u.profile.email===email)) throw new Error("Este e-mail já está cadastrado."); const now=new Date().toISOString(); const id=crypto.randomUUID(); const passwordHash=await hash(data.password); const profile:UserProfile={name:data.name,email,age:0,height:0,weight:0,targetWeight:0,goal:"Emagrecer e ganhar massa",level:"Iniciante",days:4,equipment:"Academia",createdAt:now}; const u:UserRecord={id,passwordHash,profile,completedSets:{},foods:[],weights:[],workouts:[],createdAt:now}; setStore(s=>({users:[...s.users,u],currentUserId:id})); return u},
  async login(email:string,password:string){const h=await hash(password); const u=store.users.find(x=>x.profile.email===email.trim().toLowerCase()&&x.passwordHash===h); if(!u) throw new Error("E-mail ou senha inválidos."); setStore(s=>({...s,currentUserId:u.id})); return u},
  logout(){setStore(s=>({...s,currentUserId:null}))},
  completeOnboarding(profile:Partial<UserProfile>){updateUser(u=>{const p={...u.profile,...profile}; const weights=u.weights.length?u.weights:[{id:crypto.randomUUID(),date:new Date().toISOString(),weight:Number(p.weight)||0}]; return {...u,profile:p,weights,workouts:buildWorkouts(p)}})},
  updateProfile(profile:Partial<UserProfile>){updateUser(u=>({...u,profile:{...u.profile,...profile}}))},
  toggleSet(exerciseId:string,setNo:number){updateUser(u=>{const key=`${exerciseId}:${setNo}`; const next={...u.completedSets}; if(next[key]) delete next[key]; else next[key]=Date.now(); return {...u,completedSets:next}})},
  addWorkoutCompletion(){updateUser(u=>{const today=new Date().toISOString().slice(0,10); return {...u,workouts:u.workouts.map(w=>w.date===today?{...w,completed:true}:w)}})},
  addFood(entry:Omit<FoodEntry,"id"|"date">){updateUser(u=>({...u,foods:[...u.foods,{...entry,id:crypto.randomUUID(),date:new Date().toISOString()}]}))},
  removeFood(id:string){updateUser(u=>({...u,foods:u.foods.filter(f=>f.id!==id)}))},
  addWeight(weight:number){if(!weight||weight<=0)return; updateUser(u=>({...u,profile:{...u.profile,weight},weights:[...u.weights,{id:crypto.randomUUID(),date:new Date().toISOString(),weight}]}))},
  resetData(){setStore(s=>({...s,users:s.users.map(u=>u.id===s.currentUserId?{...u,foods:[],weights:[],completedSets:{},workouts:buildWorkouts(u.profile)}:u)}))},
 }),[store,current]);
 return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
export function useNeurofit(){const c=useContext(Ctx); if(!c) throw new Error("useNeurofit must be used inside NeurofitProvider"); return c}

function buildWorkouts(p:UserProfile):Workout[]{const today=new Date().toISOString().slice(0,10); const split=p.goal==="Emagrecer"?["Full Body A","Full Body B"]:["Peito + Tríceps","Costas + Bíceps","Pernas + Ombros","Full Body"];
 return split.slice(0,Math.max(2,Math.min(4,p.days||4))).map((title,i)=>({id:`w-${i}`,title,muscle:title.includes("Peito")?"Peito + Tríceps":title.includes("Costas")?"Costas + Bíceps":title.includes("Pernas")?"Pernas + Ombros":"Corpo inteiro",duration:45+i*5,exercises:i%3===0?["supino","triceps","rosca"]:i%3===1?["puxada","remada","rosca"]:["agachamento","supino","triceps"],completed:false,date:i===0?today:new Date(Date.now()+i*86400000).toISOString().slice(0,10)}));}
