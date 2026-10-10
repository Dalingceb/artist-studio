import LegalPage, { ContactBlock } from "@/components/LegalPage";
import { siteConfig } from "@/lib/site-config";

const n = siteConfig.platformName;

const Privacy = () => (
  <LegalPage
    title="Privacy Policy"
    intro={<p>This policy explains how {n} collects, uses and protects your personal information. It is written to comply with Eswatini's Data Protection Act 41 of 2022.</p>}
    sections={[
      { heading: "Information we collect", body: <><p>When you use {n} we may collect:</p><ul className="list-disc pl-6 space-y-1"><li>your name and email address, and your password (stored in encrypted form);</li><li>profile details such as category, location, phone number, biography, website and social links;</li><li>portfolio photos and videos, profile and banner images;</li><li>bookings, including event details, dates, locations and proposed prices;</li><li>messages and attachments you send to other users;</li><li>reviews and ratings you write;</li><li>job listings and job applications.</li></ul></> },
      { heading: "Why we collect it", body: <p>We use your information to run your account, show artist profiles to clients, let clients and artists book, message and review each other, publish and manage job listings, keep the platform safe, and contact you about your account.</p> },
      { heading: "Where it is stored", body: <p>Your information is stored in the platform's cloud database, and uploaded files are kept in the platform's cloud file storage. These services are provided by trusted hosting providers and may be located outside Eswatini.</p> },
      { heading: "Who can see your information", body: <><p><strong>Public:</strong> artist profiles (name, category, location, phone number, biography, images, portfolio), reviews and job listings can be seen by anyone visiting the site.</p><p><strong>Private:</strong> messages can only be seen by the people in the conversation. Bookings and job applications can only be seen by the client and artist involved. Site administrators can access data where needed to run and protect the platform.</p></> },
      { heading: "We do not sell your data", body: <p>{n} does not sell, rent or trade your personal information to anyone.</p> },
      { heading: "How long we keep it", body: <p>We keep your information while your account is active. You can ask us to delete your account and data at any time, and we will do so unless the law requires us to keep certain records.</p> },
      { heading: "Your rights", body: <p>Under the Data Protection Act 41 of 2022 you have the right to access the personal information we hold about you, to have it corrected, and to have it deleted. You can also object to how it is used. To use these rights, contact us using the details below.</p> },
      { heading: "Security", body: <p>We protect your information with encrypted connections, encrypted passwords and access rules that limit who can read each type of data. No online service is completely secure, so please keep your password private.</p> },
      { heading: "Children", body: <p>{n} is not intended for children under 18. We do not knowingly collect information from children. If you believe a child has created an account, please contact us and we will remove it.</p> },
      { heading: "Changes to this policy", body: <p>If we change this policy, we will update the "Last updated" date at the top of this page and, for significant changes, notify users on the site or by email.</p> },
      { heading: "Contact us", body: <ContactBlock /> },
    ]}
  />
);

export default Privacy;
