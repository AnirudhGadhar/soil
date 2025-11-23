import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  useEffect(() => {
    document.title = "About | SoilIntel";
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-6 py-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About SoilIntel</h1>
          <p className="text-lg text-muted-foreground mb-6">
            SoilIntel is a lightweight soil intelligence platform that transforms global open soil data
            into clear, actionable insights for farmers, gardeners, students, and researchers.
          </p>
          <p className="text-muted-foreground mb-4">
            We use freely available scientific datasets to estimate soil properties such as pH, organic
            carbon, nitrogen, and texture (sand, silt, clay) for almost any point on earth. On top of
            that, we provide simple crop and plant recommendations so you can quickly understand what is
            likely to grow well in your soil conditions.
          </p>
          <p className="text-muted-foreground mb-4">
            This tool is meant as an educational and planning aid, not a replacement for laboratory soil
            testing. Always combine remote data with local knowledge and expert advice before making
            critical decisions.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
