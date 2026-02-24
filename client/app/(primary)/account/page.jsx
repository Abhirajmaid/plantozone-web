 "use client";
 import React, { useState } from "react";
 import { Container } from "@/src/components/layout/Container";
 import { Section } from "@/src/components/layout/Section";
 import { NewsletterSection, ShopServiceSection } from "@/src/components";
 import SignInForm from "@/src/components/common/SignInForm";
 import SignUpForm from "@/src/components/common/SignUpForm";
 import Link from "next/link";

 export default function AccountPage() {
   const [showSignIn, setShowSignIn] = useState(true);

   return (
     <div className="min-h-screen bg-gray-50 pt-20">
       <div className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}>
         <div className="absolute inset-0 bg-white/70"></div>
         <Container>
           <div className="relative z-10 flex flex-col items-center text-center">
             <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">My Account</h1>
             <div className="flex items-center gap-2 text-gray-600">
               <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
               <span>/</span>
               <span className="text-gray-800 font-medium">My Account</span>
             </div>
           </div>
         </Container>
       </div>

       <Section className="bg-gray-50 py-16">
         <Container>
           <div className="max-w-3xl mx-auto">
             <div className="bg-white rounded-2xl shadow-lg p-8">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-900">{showSignIn ? "Sign In" : "Create Account"}</h2>
                 <button
                   onClick={() => setShowSignIn(!showSignIn)}
                   className="text-sm text-green-600 underline"
                 >
                   {showSignIn ? "Create an account" : "Already have an account? Sign in"}
                 </button>
               </div>

               {showSignIn ? (
                 <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
               ) : (
                 <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
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

