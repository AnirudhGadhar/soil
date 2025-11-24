import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LocationSearch from "@/components/LocationSearch";
import SoilData from "@/components/SoilData";
import RecentSearches, { RecentSearch } from "@/components/RecentSearches";
import { fetchSoilData, SoilData as SoilDataType } from "@/services/soilApi";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [soilData, setSoilData] = useState<SoilDataType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const { toast } = useToast();

  const handleLocationSubmit = async (lat: number, lon: number, name: string) => {
    setIsLoading(true);
    setLocationName(name);
    setCoordinates({ lat, lon });
    setSoilData(null); // Clear previous data

    try {
      console.log(`Fetching soil data for: ${name} (${lat}, ${lon})`);
      const data = await fetchSoilData(lat, lon);
      console.log("Soil data received:", data);
      setSoilData(data);

      // Update recent searches (keep latest 5, unique by name)
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.name !== name);
        const updated = [{ name, lat, lon }, ...filtered];
        return updated.slice(0, 5);
      });

      toast({
        title: "Success!",
        description: "Soil data retrieved successfully",
      });
    } catch (error) {
      console.error("Failed to fetch soil data:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch soil data. Please try again.",
        variant: "destructive",
      });
      setSoilData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        <div className="py-12">
          <LocationSearch onLocationSubmit={handleLocationSubmit} isLoading={isLoading} />
          <RecentSearches
            searches={recentSearches}
            onSelect={(search) => handleLocationSubmit(search.lat, search.lon, search.name)}
          />
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Analyzing soil data...</p>
            </div>
          )}
          
          {soilData && !isLoading && coordinates && (
            <SoilData 
              data={soilData} 
              locationName={locationName} 
              lat={coordinates.lat}
              lon={coordinates.lon}
            />
          )}
          
          {!soilData && !isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Enter a location above to start analyzing soil data</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
