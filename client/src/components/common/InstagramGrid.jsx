 "use client";
 import React, { useState } from "react";
 import Image from "next/image";
 import { Dialog, DialogContent } from "@/src/components/ui/dialog";
 import { customerMedia } from "@/src/lib/data/customerMedia";

 const InstagramGrid = () => {
   const [selected, setSelected] = useState(null);

   return (
     <>
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 max-w-6xl mx-auto">
         <div className="col-span-2 md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-2 md:gap-4">
           {customerMedia.slice(0,4).map((m, i) => (
             <button
               key={m.id}
               onClick={() => setSelected(m)}
               className="aspect-square bg-gray-200 rounded-lg md:rounded-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer p-0 border-0"
             >
               {m.type === "image" ? (
                 <Image src={m.src} alt={m.caption || m.name} width={600} height={600} className="w-full h-full object-cover" />
               ) : (
                 <video src={m.src} className="w-full h-full object-cover" playsInline muted loop />
               )}
             </button>
           ))}
         </div>

         <div className="hidden md:block lg:col-span-1">
           <button onClick={() => setSelected(customerMedia[2])} className="w-full aspect-[2/4.15] bg-gray-200 rounded-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer p-0 border-0">
             {customerMedia[2]?.type === "image" ? (
               <Image src={customerMedia[2]?.src} alt={customerMedia[2]?.caption} width={800} height={1200} className="w-full h-full object-cover" />
             ) : (
               <video src={customerMedia[2]?.src} className="w-full h-full object-cover" playsInline muted loop />
             )}
           </button>
         </div>

         <div className="col-span-2 md:col-span-1 lg:col-span-2 grid grid-cols-2 gap-2 md:gap-4">
           {customerMedia.slice(0,4).map((m, i) => (
             <button
               key={`r-${m.id}-${i}`}
               onClick={() => setSelected(m)}
               className="aspect-square bg-gray-200 rounded-lg md:rounded-2xl overflow-hidden hover:scale-105 transition-transform cursor-pointer p-0 border-0"
             >
               {m.type === "image" ? (
                 <Image src={m.src} alt={m.caption || m.name} width={600} height={600} className="w-full h-full object-cover" />
               ) : (
                 <video src={m.src} className="w-full h-full object-cover" playsInline muted loop />
               )}
             </button>
           ))}
         </div>
       </div>

       {selected && (
         <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
           <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-0 shadow-none">
             <div className="relative w-full max-h-[85vh] flex items-center justify-center">
               {selected.type === "image" ? (
                 <Image src={selected.src} alt={selected.caption || selected.name} width={800} height={1200} className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-md" />
               ) : (
                 <video src={selected.src} controls autoPlay className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-md" />
               )}
               {selected.caption && <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm">{selected.caption}</div>}
             </div>
           </DialogContent>
         </Dialog>
       )}
     </>
   );
 };

 export default InstagramGrid;

