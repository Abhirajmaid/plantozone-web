 "use client";
 import React, { useEffect, useState } from "react";
 import { useRouter } from "next/navigation";
 import { Container } from "@/src/components/layout/Container";
 import { Section } from "@/src/components/layout/Section";
 import { NewsletterSection, ShopServiceSection } from "@/src/components";
 import Link from "next/link";

 export default function ProfilePage() {
   const [user, setUser] = useState(null);
   const router = useRouter();

   useEffect(() => {
     const u = sessionStorage.getItem("user");
     if (!u) {
       router.push("/account");
       return;
     }
     try {
       setUser(JSON.parse(u));
     } catch (e) {
       setUser(null);
     }
   }, []);

   const handleSignOut = () => {
     sessionStorage.removeItem("user");
     sessionStorage.removeItem("jwt");
     router.push("/");
   };

   return (
     <div className="min-h-screen bg-gray-50 pt-20">
       <div className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}>
         <div className="absolute inset-0 bg-white/70"></div>
         <Container>
           <div className="relative z-10 flex flex-col items-center text-center">
             <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Your Profile</h1>
             <div className="flex items-center gap-2 text-gray-600">
               <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
               <span>/</span>
               <span className="text-gray-800 font-medium">Profile</span>
             </div>
           </div>
         </Container>
       </div>

       <Section className="bg-gray-50 py-16">
         <Container>
           <div className="max-w-3xl mx-auto">
             <div className="bg-white rounded-2xl shadow-lg p-8">
               {user ? (
                 <>
                   <h2 className="text-2xl font-bold mb-4">Welcome back, {user.username || user.name || user.email}</h2>
                   <p className="mb-4 text-sm text-gray-600">Email: {user.email}</p>
                   <p className="mb-6 text-sm text-gray-600">Mobile: {user.mobile_number || "—"}</p>
                   <div className="flex space-x-3">
                     <Link href="/orders" className="px-4 py-2 bg-green-600 text-white rounded">My Orders</Link>
                     <button onClick={handleSignOut} className="px-4 py-2 bg-gray-200 rounded">Sign Out</button>
                   </div>
                 </>
               ) : (
                 <p className="text-gray-600">Loading profile...</p>
               )}
             </div>
           </div>
         </Container>
       </Section>

       <ShopServiceSection />
       <NewsletterSection />
     </div>
   );
 }

