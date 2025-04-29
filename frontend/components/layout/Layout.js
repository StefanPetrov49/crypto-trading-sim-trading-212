import Footer from "./Footer";
import NoSSR from "./NoSSR";
import Header from "./Header";


export default function Layout({ children }) {
  
  return (
    <NoSSR>
      {/* <Head>
        <link rel="icon" href="/logo_bubble_max.png" />
      </Head> */}
      <Header/>
      {children}
      <Footer />
    </NoSSR>
  );
}