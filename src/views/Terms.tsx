import LegalPage, { ContactBlock } from "@/components/LegalPage";
import { siteConfig } from "@/lib/site-config";

const n = siteConfig.platformName;

const Terms = () => (
  <LegalPage
    title="Terms of Use"
    intro={<p>These terms apply to everyone who uses {n}. By creating an account or using the site, you agree to them.</p>}
    sections={[
      { heading: "What the platform does", body: <p>{n} connects clients with artists and creative professionals. We are not a party to any agreement between a client and an artist, and we are not responsible for how bookings or jobs are carried out.</p> },
      { heading: "Payments", body: <p>Prices and payments are agreed directly between clients and artists. {n} does not process, hold or guarantee any payments.</p> },
      { heading: "Your account", body: <p>You must give accurate information and keep it up to date. You are responsible for everything done with your account, so keep your password private.</p> },
      { heading: "Your content", body: <p>You keep ownership of the photos, videos, text and other content you upload. By uploading it, you allow {n} to store and display it on the platform so it can be shown to other users. You must have the right to share everything you upload.</p> },
      { heading: "Prohibited conduct", body: <><p>You must not:</p><ul className="list-disc pl-6 space-y-1"><li>post false, misleading, offensive or illegal content;</li><li>upload work that belongs to someone else;</li><li>harass, threaten or scam other users;</li><li>send spam or misuse other users' contact details;</li><li>try to break, overload or gain unauthorised access to the platform.</li></ul></> },
      { heading: "Reviews", body: <p>Reviews must be honest and based on a real booking or job. Fake reviews, reviews of yourself and reviews written in exchange for payment are not allowed.</p> },
      { heading: "Suspension of accounts", body: <p>We may remove content or suspend or close accounts that break these terms or put other users at risk.</p> },
      { heading: "Limitation of liability", body: <p>{n} is provided "as is". To the fullest extent allowed by law, we are not liable for losses arising from bookings, jobs, payments or dealings between users, or from the platform being unavailable.</p> },
      { heading: "Changes to these terms", body: <p>We may update these terms. The "Last updated" date at the top shows the latest version. Continuing to use the site after a change means you accept the updated terms.</p> },
      { heading: "Governing law", body: <p>These terms are governed by the laws of the Kingdom of Eswatini.</p> },
      { heading: "Contact us", body: <ContactBlock /> },
    ]}
  />
);

export default Terms;
