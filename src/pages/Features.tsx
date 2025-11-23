import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, MapPin, LineChart } from "lucide-react";

const Features = () => {
  useEffect(() => {
    document.title = "Features | SoilIntel";
  }, []);

  const features = [
    {
      icon: <MapPin className="w-6 h-6 text-primary" />, 
      title: "Location based soil insights",
      description: "Search any place by name or use your current location to instantly view estimated soil properties.",
    },
    {
      icon: <LineChart className="w-6 h-6 text-primary" />, 
      title: "Key soil properties",
      description: "See pH, organic carbon, nitrogen and texture breakdown (sand, silt, clay) in a clean dashboard.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-primary" />, 
      title: "Crop suggestions",
      description: "Get a quick list of crops and plants likely to perform well in your soil conditions.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-6 py-16 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Platform Features</h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-3xl">
            Explore the main capabilities of SoilIntel and how they help you understand and plan for soil health
            anywhere in the world.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-xl p-6 shadow-soft hover:shadow-strong transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h2 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h2>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <section className="bg-muted rounded-xl p-8 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-3">Coming next</h2>
            <p className="text-muted-foreground mb-4">
              This demo can be extended with richer analytics such as soil health scores, custom crop libraries,
              seasonal planning tools, and exportable PDF reports. Let us know which direction matters most to you.
            </p>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
