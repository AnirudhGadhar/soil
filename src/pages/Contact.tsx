import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MessageCircle, MapPin } from "lucide-react";

const Contact = () => {
  useEffect(() => {
    document.title = "Contact | SoilIntel";
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-6 py-16 max-w-3xl space-y-8">
          <header>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Contact</h1>
            <p className="text-lg text-muted-foreground">
              This is a demo project, but you can adapt this page to collect feedback from farmers, students, or
              researchers using your tool.
            </p>
          </header>

          <div className="bg-card border border-border rounded-xl p-8 shadow-soft space-y-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold text-foreground">Email</div>
                <div className="text-muted-foreground text-sm">youremail@example.com</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold text-foreground">Feedback</div>
                <div className="text-muted-foreground text-sm">
                  Ask questions, suggest features, or report issues so we can improve soil insights together.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold text-foreground">Use cases</div>
                <div className="text-muted-foreground text-sm">
                  Let us know if you use this for farm planning, gardening, education, or research projects.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
