import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const locationSchema = z.string().trim().min(2, "Location must be at least 2 characters").max(200, "Location must be less than 200 characters");

interface LocationSearchProps {
  onLocationSubmit: (lat: number, lon: number, locationName: string) => void;
  isLoading: boolean;
}

const LocationSearch = ({ onLocationSubmit, isLoading }: LocationSearchProps) => {
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  const searchLocation = async () => {
    // Validate input
    const validation = locationSchema.safeParse(location);
    if (!validation.success) {
      toast({
        title: "Invalid location",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    try {
      // Use Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
        {
          headers: {
            'User-Agent': 'SoilIntelligencePlatform/1.0'
          }
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        onLocationSubmit(parseFloat(lat), parseFloat(lon), display_name);
      } else {
        toast({
          title: "Location not found",
          description: "Please try a different location",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast({
        title: "Error",
        description: "Failed to search location. Please try again.",
        variant: "destructive",
      });
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Getting location...",
      description: "Please allow location access",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSubmit(
          position.coords.latitude,
          position.coords.longitude,
          "Current Location"
        );
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location error",
          description: error.message || "Unable to retrieve your location",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 animate-slide-up" id="search">
      <div className="bg-card rounded-xl shadow-strong p-8 border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          Enter Location
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Search by city name, coordinates, or use your current location
        </p>
        
        <div className="flex gap-3 mb-4">
          <Input
            type="text"
            placeholder="e.g. Banglore "
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchLocation()}
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={searchLocation} 
            disabled={isLoading || !location.trim()}
            className="bg-gradient-primary hover:opacity-90 transition-opacity px-6"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        
        <Button
          onClick={useCurrentLocation}
          variant="outline"
          disabled={isLoading}
          className="w-full mt-4 hover:bg-accent"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Use Current Location
        </Button>
      </div>
    </div>
  );
};

export default LocationSearch;
