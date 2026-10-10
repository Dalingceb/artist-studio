import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

export type LegalSection = { heading: string; body: ReactNode };

const LegalPage = ({ title, intro, sections }: { title: string; intro: ReactNode; sections: LegalSection[] }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow bg-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {siteConfig.legalLastUpdated}</p>
        <div className="text-gray-700 mb-8">{intro}</div>
        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="text-xl font-serif font-bold mb-3">{i + 1}. {s.heading}</h2>
              <div className="text-gray-700 space-y-3 leading-relaxed">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export const ContactBlock = () => (
  <address className="not-italic">
    {siteConfig.operatorName}, operator of {siteConfig.platformName}<br />
    Email: <a className="text-swati-purple hover:underline" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><br />
    Phone: {siteConfig.phone}<br />
    Post: {siteConfig.address}
  </address>
);

export default LegalPage;
