// @ts-nocheck
import { LegalFooter } from "@/components/LegalFooter";
export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-foreground mb-6">Terms of Service</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <p className="text-sm"><strong>Last Updated:</strong> July 2026</p>
        <p className="text-sm">By accessing or using MonitorUSA.ai ("monitorusa.ai"), you agree to these Terms of Service. If you do not agree, do not use this platform.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">Use of Service</h2>
        <p className="text-sm">You must be 18 years or older to use this service. You are responsible for maintaining the confidentiality of your account credentials.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">Acceptable Use</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Do not use the service for any unlawful purpose</li>
          <li>Do not attempt to gain unauthorized access to any part of the service</li>
          <li>Do not interfere with or disrupt the service</li>
          <li>Do not upload malicious content or software</li>
        </ul>
        <h2 className="text-lg font-bold text-foreground mt-6">Intellectual Property</h2>
        <p className="text-sm">All content, features, and functionality of MonitorUSA.ai are owned by Garner Financial Partners LLC and are protected by copyright, trademark, and other intellectual property laws.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">Disclaimer</h2>
        <p className="text-sm">The information provided through MonitorUSA.ai is for educational and informational purposes only. It does not constitute financial, legal, tax, or investment advice. Consult qualified professionals before making financial decisions.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">Limitation of Liability</h2>
        <p className="text-sm">To the fullest extent permitted by law, Garner Financial Partners LLC shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this service.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">Contact</h2>
        <p className="text-sm">Garner Financial Partners LLC<br/>Email: support@garnerfinancialpartners.com</p>
      </div>
      <LegalFooter />
    </div>
  );
}
