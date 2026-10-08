import "./globals.css";
import type {Metadata} from "next";
import {NeurofitProvider} from "@/components/providers/NeurofitProvider";
export const metadata:Metadata={title:"NEUROFIT — Evolução inteligente",description:"Treino, alimentação e evolução com tecnologia."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><NeurofitProvider>{children}</NeurofitProvider></body></html>}
