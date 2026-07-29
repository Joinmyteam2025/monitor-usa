// @ts-nocheck
import { LegalFooter } from "@/components/LegalFooter";
export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-foreground mb-6">Privacy Policy</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <p className="text-sm"><strong>Last Updated:</strong> July 2026</p>
        <p className="text-sm">MonitorUSA.ai ("monitorusa.ai") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">Information We Collect</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Account information (name, email, phone number)</li>
          <li>Usage data (pages visited, features used, device information)</li>
          <li>Payment information (processed securely through Stripe)</li>
          <li>Communications (support requests, feedback)</li>
        </ul>
        <h2 className="text-lg font-bold text-foreground mt-6">How We Use Your Information</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>To provide and improve our services</li>
          <li>To communicate with you about your account</li>
          <li>To process payments and prevent fraud</li>
          <li>To comply with legal obligations</li>
        </ul>
        <h2 className="text-lg font-bold text-foreground mt-6">Data Security</h2>
        <p className="text-sm">We implement industry-standard security measures including encryption, secure servers, and regular audits to protect your data.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">Your Rights</h2>
        <p className="text-sm">You may request access to, correction of, or deletion of your personal data at any time by contacting us at support@garnerfinancialpartners.com.</p>
        <h2 className="text-lg font-bold text-foreground mt-6">Contact</h2>
        <p className="text-sm">Garner Financial Partners LLC<br/>Email: support@garnerfinancialpartners.com</p>
      </div>
      <LegalFooter />
    </div>
  );
}
