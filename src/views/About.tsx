import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-16 pb-20 bg-gradient-to-r from-swati-purple/10 to-swati-teal/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-serif gradient-heading mb-6">About Swazi Artistry</h1>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Connecting Eswatini's creative talent with opportunities and audiences worldwide
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg mb-6 text-gray-700">
                  Swazi Artistry is a platform dedicated to showcasing and promoting the diverse 
                  artistic talent found throughout the Kingdom of Eswatini. We believe in the power 
                  of art and creativity to transform lives and communities.
                </p>
                <p className="text-lg mb-6 text-gray-700">
                  Our mission is to create opportunities for EmaSwati artists by connecting them with 
                  clients, collaborators, and audiences both locally and internationally.
                </p>
                <p className="text-lg text-gray-700">
                  Through our platform, we aim to preserve and celebrate Eswatini's rich cultural 
                  heritage while also fostering innovation and growth in the creative industries.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1561490497-43bc900ac2d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0JTIwc2hvd3xlbnwwfHwwfHx8MA%3D%3D" 
                  alt="Artists performing"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold font-serif text-center mb-12">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-swati-light to-white p-6 rounded-lg shadow-md">
                <h3 className="font-serif font-bold text-xl mb-4 text-swati-purple">Community</h3>
                <p className="text-gray-700">
                  We believe in the power of community and collaboration. By bringing artists together, 
                  we create a supportive environment where creativity can flourish.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-swati-light to-white p-6 rounded-lg shadow-md">
                <h3 className="font-serif font-bold text-xl mb-4 text-swati-teal">Authenticity</h3>
                <p className="text-gray-700">
                  We value the authentic expression of Eswatini's cultural heritage while embracing 
                  innovation and contemporary artistic practices.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-swati-light to-white p-6 rounded-lg shadow-md">
                <h3 className="font-serif font-bold text-xl mb-4 text-swati-gold">Opportunity</h3>
                <p className="text-gray-700">
                  We are committed to creating sustainable opportunities for artists to showcase their 
                  work, develop their skills, and build successful careers.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        
        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-serif mb-4">Get in Touch</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Have questions about Swazi Artistry? Want to collaborate or learn more about our platform?
                We'd love to hear from you!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-swati-purple/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-swati-purple" />
                </div>
                <h3 className="font-bold mb-2">Address</h3>
                <p className="text-gray-600">Mbabane, Eswatini</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-swati-purple/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-swati-purple" />
                </div>
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-gray-600">swaziartistry@gmail.com</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-swati-purple/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-swati-purple" />
                </div>
                <h3 className="font-bold mb-2">Phone</h3>
                <p className="text-gray-600">+268 78209908</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
