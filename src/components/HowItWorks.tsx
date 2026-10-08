
import { Card, CardContent } from "@/components/ui/card";
import { Search, Star, Calendar } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Discover Talent",
    description: "Browse through profiles of talented EmaSwati artists across various categories and specializations.",
    icon: Search,
    color: "bg-swati-purple text-white",
  },
  {
    id: 2,
    title: "Review Profiles",
    description: "Check portfolios, reviews, pricing, and availability to find the perfect match for your needs.",
    icon: Star,
    color: "bg-swati-gold text-swati-dark",
  },
  {
    id: 3,
    title: "Book & Connect",
    description: "Send booking requests directly through the platform and finalize your arrangements.",
    icon: Calendar,
    color: "bg-swati-teal text-white",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-serif mb-4 text-swati-dark">How It Works</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Find and book EmaSwati talent in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={step.id} className="border-0 shadow-lg relative card-hover">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className={`${step.color} h-12 w-12 rounded-full flex items-center justify-center shadow-lg`}>
                  <step.icon size={24} />
                </div>
              </div>
              
              <CardContent className="pt-10 text-center">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-gray-100 shadow-sm">
                  <span className="font-bold text-swati-purple">Step {index + 1}</span>
                </div>
                <h3 className="font-serif font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
