import About from "@/components/layout/About";
import Blog from "@/components/layout/Blog";
import Contact from "@/components/layout/Contact";
import Hero from "@/components/layout/Hero";
import Projects from "@/components/layout/Projects";
import Skills from "@/components/layout/Skills";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex min-h-full w-full flex-col items-center justify-between sm:items-start">
        <Hero />

        <About />

        <Skills />

        <Projects />

        <Blog />

        <Contact />
      </div>
    </main>
  );
}
