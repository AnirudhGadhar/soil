import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SoilTextureTriangleProps {
  clay: number;
  sand: number;
  silt: number;
}

const SoilTextureTriangle = ({ clay, sand, silt }: SoilTextureTriangleProps) => {
  // Determine soil texture class based on USDA classification
  const getTextureClass = () => {
    if (clay >= 40) {
      if (sand >= 45) return "Sandy Clay";
      if (silt >= 40) return "Silty Clay";
      return "Clay";
    } else if (clay >= 27) {
      if (sand >= 20 && sand <= 45) return "Clay Loam";
      if (sand > 45) return "Sandy Clay Loam";
      return "Silty Clay Loam";
    } else if (clay >= 12) {
      if (sand >= 52) return "Sandy Loam";
      if (silt >= 50) return "Silt Loam";
      return "Loam";
    } else if (silt >= 80) {
      return "Silt";
    } else if (silt >= 50) {
      return "Silt Loam";
    } else if (sand >= 85) {
      return "Sand";
    } else if (sand >= 70) {
      return "Loamy Sand";
    }
    return "Loam";
  };

  const textureClass = getTextureClass();

  const getTextureDescription = (texture: string) => {
    const descriptions: Record<string, string> = {
      "Clay": "Heavy, sticky when wet, holds water well but drains poorly",
      "Sandy Clay": "Heavy texture with better drainage than pure clay",
      "Silty Clay": "Smooth, slippery when wet, moderate drainage",
      "Clay Loam": "Balanced texture, good for most crops, retains nutrients well",
      "Sandy Clay Loam": "Good drainage with decent water retention",
      "Silty Clay Loam": "Fertile, holds moisture well, slightly sticky",
      "Loam": "Ideal texture - balanced sand/silt/clay, excellent for farming",
      "Sandy Loam": "Easy to work, good drainage, warms quickly in spring",
      "Silt Loam": "Fertile, retains moisture, can compact if overworked",
      "Sand": "Drains quickly, low nutrient retention, easy to work",
      "Loamy Sand": "Drains well, moderate nutrient retention",
      "Silt": "Smooth texture, high fertility, can crust when dry",
    };
    return descriptions[texture] || "Moderate characteristics";
  };

  return (
    <Card className="shadow-soft hover:shadow-strong transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔺 Soil Texture Classification
        </CardTitle>
        <CardDescription>USDA texture class based on particle distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gradient-primary text-primary-foreground rounded-lg p-6 text-center">
            <div className="text-3xl font-bold mb-2">{textureClass}</div>
            <div className="text-sm opacity-90">{getTextureDescription(textureClass)}</div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-muted rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Clay</div>
              <div className="text-2xl font-bold text-foreground">{clay.toFixed(0)}%</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Sand</div>
              <div className="text-2xl font-bold text-foreground">{sand.toFixed(0)}%</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Silt</div>
              <div className="text-2xl font-bold text-foreground">{silt.toFixed(0)}%</div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
            Classification based on USDA soil texture triangle
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoilTextureTriangle;
