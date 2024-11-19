// import "@/styles/globals.css";
// import type { AppProps } from "next/app";
// import {ToastContainer} from 'react-toastify'
// import { AuthProvider,useAuth } from '../context/AuthContext';
// import Navbar from "../components/Navbar";
// import 'react-toastify/dist/ReactToastify.css';

// const NavbarWrapper:React.FC =()=>{
//   const { isAuthenticated, userName,favoritesCount,cartCount } = useAuth();
//   return <Navbar isAuthenticated={isAuthenticated} userName={userName} favoritesCount={favoritesCount} cartCount={cartCount}/>
// }

// export default function App({ Component, pageProps }: AppProps) {
  
//   return (
//     <AuthProvider>
//       <NavbarWrapper/>
//       <Component {...pageProps} />
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         className="toast-container"
//       />
//     </AuthProvider>
//   );
// }


import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import Navbar from '../components/Navbar'
import 'react-toastify/dist/ReactToastify.css'
// import { AuthProvider } from '../context/AuthContext'
import { useAuth,AuthProvider  } from '../context/AuthContext'

const NavbarWrapper:React.FC =()=>{
  const {  userName,favoritesCount,cartCount } = useAuth();
  return <Navbar  userName={userName} favoritesCount={favoritesCount} cartCount={cartCount}/>

}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <NavbarWrapper />
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </SessionProvider>
  )
}