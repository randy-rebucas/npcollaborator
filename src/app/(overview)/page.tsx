// import { getLogtoContext, signIn, signOut } from '@logto/next/server-actions';
// import SignIn from '../components/auth/SignIn';
// import SignOut from '../components/auth/SignOut';
// import { logtoConfig } from './logto';

// const Home = async () => {
//   const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

//   // if (isAuthenticated) {

//   // }

//   return (
//     <nav>
//       {isAuthenticated ? (
//         <p>
//           Hello, {claims?.sub},
//           <SignOut
//             onSignOut={async () => {
//               'use server';

//               await signOut(logtoConfig);
//             }}
//           />
//         </p>
//       ) : (
//         <p>
//           <SignIn
//             onSignIn={async () => {
//               'use server';

//               await signIn(logtoConfig);
//             }}
//           />
//         </p>
//       )}
//     </nav>
//   );
// };

// export default Home;
// import { createClient } from '@/utils/supabase/server'
// import { cookies } from 'next/headers'

import AboutUs from "@/components/home/AboutUs";
import Banner from "@/components/home/Banner";
import Brand from "@/components/home/Brand";
import Matching from "@/components/home/Matching";
import HowItWork from "@/components/home/HowItWork";

export default async function Home() {
  // const cookieStore = cookies()
  // const supabase = createClient(cookieStore)

  // const { data: { user } } = await supabase.auth.getUser();
  // console.log(user)
  // const { data: todos } = await supabase.from('todos').select()
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Banner />
      <Brand />
      <AboutUs />
      <Matching />
      <HowItWork />
    </main>
  );
}