
import React from 'react';
import { Link } from '@/lib/router-compat';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqItems = [
    {
      question: "What is Swazi Artistry?",
      answer: "Swazi Artistry is a platform that connects talented artists, performers, and creatives from Eswatini with potential clients, event organizers, and fans. We showcase the diverse artistic talent found throughout the Kingdom of Eswatini."
    },
    {
      question: "How do I book an artist?",
      answer: "To book an artist, simply navigate to their profile page and click on the 'Book Now' button. You'll be asked to fill out a booking request form with details about your event. The artist will then review your request and respond to confirm availability and discuss the details."
    },
    {
      question: "I am an artist. How do I create a profile?",
      answer: "You can create an artist profile by signing up for an account and then navigating to your user profile. From there, click on 'Create Artist Profile' and fill out the required information about your talent, expertise, and rates. As soon as you save it, your profile is visible to potential clients."
    },
    {
      question: "Does Swazi Artistry check or verify artists?",
      answer: "No. Artists create and manage their own profiles, and Swazi Artistry does not vet or verify them. Before booking, look through an artist's portfolio and read reviews from other clients."
    },
    {
      question: "What categories of talent are available?",
      answer: "We feature a wide range of talent categories, including musicians, dancers, visual artists, actors, photographers, videographers, DJs, MCs, spoken word artists, traditional performers, and more. Our goal is to represent the full spectrum of artistic talent in Eswatini."
    },
    {
      question: "How are payments handled?",
      answer: "Currently, we facilitate the initial connection between artists and clients, but payments are arranged directly between the two parties. We recommend that both parties agree on terms in writing before proceeding with a booking."
    },
    {
      question: "Can I leave a review for an artist?",
      answer: "Yes, after your event or project is completed, you can return to the artist's profile and leave a review and rating based on your experience. Honest feedback helps maintain quality and assists other potential clients in making informed decisions."
    },
    {
      question: "What if I need to cancel a booking?",
      answer: "Cancellation policies may vary by artist. We recommend discussing cancellation terms before confirming a booking. If you need to cancel, contact the artist directly as soon as possible to discuss options."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data security very seriously. We use industry-standard security measures to protect your personal information and do not share your contact details with third parties without your consent."
    },
    {
      question: "How can I feature my talent on the homepage?",
      answer: "Featured placements are selected based on a combination of factors including profile completeness, positive reviews, booking history, and artistic excellence. Consistently maintaining a professional profile with positive client interactions increases your chances of being featured."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-swati-purple/10 to-swati-teal/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-serif gradient-heading mb-6">Frequently Asked Questions</h1>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Find answers to common questions about using Swazi Artistry
              </p>
            </div>
          </div>
        </section>
        
        {/* FAQ Content */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-serif font-semibold">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <Link to="/about">
                <Button className="bg-swati-purple hover:bg-swati-purple/90">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
