import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface RecentSearch {
  name: string;
  lat: number;
  lon: number;
}

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSelect: (search: RecentSearch) => void;
}

const RecentSearches = ({ searches, onSelect }: RecentSearchesProps) => {
  if (!searches.length) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 mt-4 animate-fade-in">
      <Card className="border border-border bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Recent locations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {searches.map((search) => (
            <Button
              key={`${search.name}-${search.lat}-${search.lon}`}
              variant="outline"
              size="sm"
              className="hover:bg-accent hover:text-accent-foreground text-xs"
              onClick={() => onSelect(search)}
            >
              {search.name}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentSearches;
