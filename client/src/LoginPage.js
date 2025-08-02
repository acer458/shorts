// import { useEffect, useState } from "react";
// import { Auth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";
// import { supabase } from "./supabaseClient";

// export default function LoginPage({ onLogin }) {
//   const [session, setSession] = useState(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
//     return () => subscription.unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (session) {
//       onLogin && onLogin(session);
//     }
//   }, [session, onLogin]);

//   if (!session) {
//     return (
//       <div style={{ width: "100vw", height: "100dvh", display: "flex", justifyContent: "center", alignItems: "center" }}>
//         <Auth
//           supabaseClient={supabase}
//           appearance={{ theme: ThemeSupa }}
//           providers={[]}      // just email
//           magicLink          // enables OTP/email-login
//         />
//       </div>
//     );
//   }
//   return <div>Logged in!</div>;
// }
