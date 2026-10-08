
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Music & Performance", label: "Music & Performance" },
  { value: "Visual Arts & Design", label: "Visual Arts & Design" },
  { value: "Creative Writing & Literature", label: "Creative Writing & Literature" },
  { value: "Dance & Movement", label: "Dance & Movement" },
  { value: "Theater & Acting", label: "Theater & Acting" },
  { value: "Photography", label: "Photography" },
  { value: "Film & Video", label: "Film & Video" },
  { value: "Public Speaking", label: "Public Speaking" },
  { value: "Traditional Arts", label: "Traditional Arts" },
  { value: "Other", label: "Other" },
];

const locations = [
  { value: "all", label: "All Locations" },
  { value: "Mbabane", label: "Mbabane" },
  { value: "Manzini", label: "Manzini" },
  { value: "Lobamba", label: "Lobamba" },
  { value: "Ezulwini", label: "Ezulwini" },
  { value: "Nhlangano", label: "Nhlangano" },
  { value: "Siteki", label: "Siteki" },
  { value: "Piggs Peak", label: "Piggs Peak" },
];

type SearchBarProps = {
  onSearch: (query: string, category: string, location: string) => void;
  initialQuery?: string;
  initialCategory?: string;
  initialLocation?: string;
};

const SearchBar = ({
  onSearch,
  initialQuery = "",
  initialCategory = "all",
  initialLocation = "all"
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, category, location);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search for talent, skills, or keywords..."
            className="pl-10 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:flex gap-2">
          <div className="w-full md:w-48">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="h-12 bg-swati-purple hover:bg-swati-purple/90 px-8 col-span-2 md:col-span-1">
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
