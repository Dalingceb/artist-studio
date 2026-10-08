import { Card, CardContent } from "@/components/ui/card";
import { Link } from '@/lib/router-compat';
import { Music, Camera, Video, Mic, Book, Users } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Music & Performance",
    icon: Music,
    color: "bg-swati-purple/10 text-swati-purple",
    description: "Vocalists, instrumentalists, producers, and DJs",
    path: "/explore?category=Musicians",
  },
  {
    id: 2,
    name: "Visual Arts & Design",
    icon: Camera,
    color: "bg-swati-gold/10 text-swati-gold",
    description: "Painters, illustrators, and graphic designers",
    path: "/explore?category=Visual Arts & Design",
  },

  {
    id: 3,
    name: "Creative Writing & Literature",
    icon: Book,
    color: "bg-blue-500/10 text-blue-500",
    description: "Authors, poets, scriptwriters, and copywriters",
    path: "/explore?category=Creative Writing & Literature",
  },

  {
    id: 4,
    name: "Dance & Movement",
    icon: Users,
    color: "bg-swati-teal/10 text-swati-teal",
    description: "Dancers, actors, and live performers",
    path: "/explore?category=Dance & Movement",
  },
  {
    id: 5,
    name: "Theatre & Acting",
    icon: Video,
    color: "bg-swati-red/10 text-swati-red",
    description: "Actors, directors, screenwriters, and stage designers",
    path: "/explore?category=Theatre & Acting",
  },
{
  id: 6,
  name: "Film & Video",
  icon: Video,
  color: "bg-swati-red/10 text-swati-red",
  description: "Filmmakers, directors, and cinematographers",
  path: "/explore?category=Film & Video",
},

{
  id: 7,
  name: "Photography",
  icon: Camera,
  color: "bg-blue-500/10 text-blue-500",
  description: "Photographers, videographers, and film enthusiasts",
  path: "/explore?category=Photography",
  },

  {
    id: 8,
    name: "Public Speaking",
    icon: Mic,
    color: "bg-purple-500/10 text-purple-500",
    description: "MCs, hosts, public speakers, and influencers",
    path: "/explore?category=Public Speaking",
  },

  {
    id: 9,
    name: "Traditional Arts",
    icon: Users,
    color: "bg-swati-teal/10 text-swati-teal",
    description: "Traditional dancers, traditional singers, sculptors, and craftspeople",
    path: "/explore?category=Traditional Arts",
  },

  {
    id: 10,
    name: "Other",
    icon: Users,
    color: "bg-swati-teal/10 text-swati-teal",
    description: "Other artists and creative professionals",
    path: "/explore?category=Other",
  }
];

const TalentCategories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-serif mb-4 text-swati-dark">Explore Talent Categories</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Discover diverse EmaSwati talent across various artistic disciplines and creative fields
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/explore?category=${encodeURIComponent(category.name)}`}>
              <Card className="h-full card-hover border-t-4 border-t-swati-purple">
                <CardContent className="pt-6 flex flex-col h-full">
                  <div className={`p-3 rounded-full w-fit ${category.color} mb-4`}>
                    <category.icon size={24} />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TalentCategories;
