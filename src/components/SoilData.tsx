import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf, Droplets, Mountain, Activity } from "lucide-react";
import ExportSoilData from "./ExportSoilData";
import SoilTextureTriangle from "./SoilTextureTriangle";
import SoilComparisonChart from "./SoilComparisonChart";
import GeneratePDFReport from "./GeneratePDFReport";
import WeatherCalendar from "./WeatherCalendar";

interface SoilDataProps {
  data: {
    ph: number;
    organic_carbon: number;
    nitrogen: number;
    clay: number;
    sand: number;
    silt: number;
  };
  locationName: string;
  lat?: number;
  lon?: number;
}

const SoilData = ({ data, locationName, lat, lon }: SoilDataProps) => {
  const getPhCategory = (ph: number) => {
    if (ph < 5.5) return { label: "Acidic", color: "text-orange-600" };
    if (ph < 6.5) return { label: "Slightly Acidic", color: "text-yellow-600" };
    if (ph < 7.5) return { label: "Neutral", color: "text-primary" };
    if (ph < 8.5) return { label: "Slightly Alkaline", color: "text-blue-600" };
    return { label: "Alkaline", color: "text-indigo-600" };
  };

  const phCategory = getPhCategory(data.ph);

  const getSuitablePlants = () => {
    const ph = data.ph;
    const clay = data.clay;
    const sand = data.sand;
    
    // Simple plant recommendation logic based on pH and soil texture
    if (ph >= 6.0 && ph <= 7.5) {
      if (clay > 40) {
        return ["Rice", "Wheat", "Soybeans", "Alfalfa"];
      } else if (sand > 60) {
        return ["Carrots", "Potatoes", "Peanuts", "Watermelon"];
      } else {
        return ["Corn", "Tomatoes", "Lettuce", "Beans", "Peppers"];
      }
    } else if (ph < 6.0) {
      return ["Blueberries", "Cranberries", "Potatoes", "Azaleas", "Rhododendrons"];
    } else {
      return ["Asparagus", "Spinach", "Cabbage", "Beets"];
    }
  };

  const plants = getSuitablePlants();

  const getTextureClass = () => {
    const clay = data.clay;
    const sand = data.sand;
    const silt = data.silt;
    
    if (clay >= 40) return "Clay";
    if (sand >= 85) return "Sand";
    if (sand >= 70 && clay <= 15) return "Loamy Sand";
    if (clay >= 35 && sand <= 45) return "Clay Loam";
    if (clay >= 27 && sand <= 20) return "Silty Clay";
    if (clay >= 27 && sand >= 45) return "Sandy Clay";
    if (silt >= 80 && clay <= 12) return "Silt";
    if (silt >= 50 && clay <= 27 && sand <= 50) return "Silt Loam";
    if (clay <= 27 && sand <= 52 && silt >= 28) return "Loam";
    if (clay <= 20 && sand >= 52 && silt <= 50) return "Sandy Loam";
    return "Loam";
  };

  // Check if we have valid data
  const hasValidData = data.ph > 0 || data.organic_carbon > 0 || data.nitrogen > 0;

  if (!hasValidData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <p className="text-destructive font-semibold">No soil data available for this location</p>
          <p className="text-sm text-muted-foreground mt-2">
            The selected location may be over water or outside the SoilGrids coverage area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Soil Analysis Results</h2>
        <p className="text-muted-foreground mb-3">{locationName}</p>
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <ExportSoilData data={data} locationName={locationName} />
          <GeneratePDFReport 
            data={data} 
            locationName={locationName} 
            recommendedCrops={plants}
            soilTexture={getTextureClass()}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* pH Level Card */}
        <Card className="shadow-soft hover:shadow-strong transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              pH Level
            </CardTitle>
            <CardDescription>Soil acidity/alkalinity measure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary">{data.ph.toFixed(1)}</div>
              <div className={`text-lg font-semibold ${phCategory.color}`}>{phCategory.label}</div>
              <Progress value={(data.ph / 14) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">
                pH scale ranges from 0 (acidic) to 14 (alkaline), with 7 being neutral
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Organic Carbon Card */}
        <Card className="shadow-soft hover:shadow-strong transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              Organic Carbon
            </CardTitle>
            <CardDescription>Soil organic matter indicator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary">{data.organic_carbon.toFixed(1)}%</div>
              <Progress value={Math.min((data.organic_carbon / 5) * 100, 100)} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Higher organic carbon indicates better soil fertility and structure
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Nitrogen Content Card */}
        <Card className="shadow-soft hover:shadow-strong transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Nitrogen Content
            </CardTitle>
            <CardDescription>Essential nutrient for plant growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary">{data.nitrogen.toFixed(2)} g/kg</div>
              <Progress value={Math.min((data.nitrogen / 3) * 100, 100)} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Critical for chlorophyll production and plant protein synthesis
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Soil Texture Card */}
        <Card className="shadow-soft hover:shadow-strong transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="w-5 h-5 text-primary" />
              Soil Texture
            </CardTitle>
            <CardDescription>Composition breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Clay</span>
                  <span className="font-semibold">{data.clay.toFixed(1)}%</span>
                </div>
                <Progress value={data.clay} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sand</span>
                  <span className="font-semibold">{data.sand.toFixed(1)}%</span>
                </div>
                <Progress value={data.sand} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Silt</span>
                  <span className="font-semibold">{data.silt.toFixed(1)}%</span>
                </div>
                <Progress value={data.silt} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Soil Texture Triangle Classification */}
        <SoilTextureTriangle clay={data.clay} sand={data.sand} silt={data.silt} />
      </div>

      {/* Comparative Soil Analysis */}
      <SoilComparisonChart actualData={data} primaryCrop={plants[0]} />

      {/* Weather Calendar */}
      {lat !== undefined && lon !== undefined && (
        <WeatherCalendar 
          lat={lat} 
          lon={lon} 
          locationName={locationName} 
          primaryCrop={plants[0]} 
        />
      )}

      {/* Suitable Plants Card */}
      <Card className="shadow-strong">
        <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Leaf className="w-6 h-6" />
            Recommended Crops & Plants
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Based on your soil composition and pH level
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {plants.map((plant, index) => (
              <div
                key={index}
                className="bg-muted rounded-lg p-4 text-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                <div className="text-4xl mb-2">🌱</div>
                <div className="font-semibold">{plant}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6 text-center">
            These recommendations are based on general soil characteristics. Consult local agricultural experts for specific advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoilData;
