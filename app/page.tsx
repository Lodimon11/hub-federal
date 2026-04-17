import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Metrics from "@/components/sections/Metrics";
import Quoter from "@/components/sections/Quoter";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Metrics />
        <Quoter />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
