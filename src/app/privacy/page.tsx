import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Forrest Insights",
  description: "Privacy policy for Forrest Insights - how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-headline mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="mb-4">
              This Privacy Policy describes how Forrest Insights ("we," "our," or "us") collects, uses, 
              and protects your personal information when you visit our website or use our services. 
              We are committed to protecting your privacy and being transparent about our data practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3">Information You Provide</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Contact information when you reach out to us (name, email address, message content)</li>
              <li>Information you provide when using our DEI Proposal Assistant tool</li>
              <li>Any other information you choose to share with us</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">Information We Collect Automatically</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Website usage data through analytics (pages visited, time spent, device information)</li>
              <li>IP address and browser information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our website and services</li>
              <li>Generate insights for our DEI Proposal Assistant tool</li>
              <li>Analyze website usage and performance</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">AI and Data Processing</h2>
            <p className="mb-4">
              Our DEI Proposal Assistant tool uses artificial intelligence to help generate proposal content. 
              When you use this tool:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your responses are processed by AI services to generate customized content</li>
              <li>We may retain anonymized data to improve the tool's performance</li>
              <li>No personally identifiable information is permanently stored in connection with AI processing</li>
              <li>Generated content is not used to train external AI models</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p className="mb-4">We do not sell, rent, or trade your personal information. We may share information in the following circumstances:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>With service providers who help us operate our website (analytics, hosting, etc.)</li>
              <li>When required by law or to protect our legal rights</li>
              <li>In connection with a business transaction (merger, acquisition, etc.)</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar technologies to enhance your experience and analyze website usage. 
              This may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Essential cookies for website functionality</li>
              <li>Analytics cookies (such as Vercel Analytics) to understand website usage</li>
              <li>Performance cookies to improve our services</li>
            </ul>
            <p className="mb-4">
              You can control cookies through your browser settings, though this may affect website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="mb-4">
              We retain personal information only as long as necessary to fulfill the purposes outlined in this 
              Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="mb-4">Depending on your location, you may have certain rights regarding your personal information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
            <p className="mb-4">
              Our website may be hosted and our services may be provided from various locations. 
              By using our services, you consent to the transfer of your information to countries 
              that may have different data protection laws than your country of residence.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="mb-4">
              Our services are not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If we become aware that we have 
              collected personal information from a child under 13, we will take steps to delete such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new Privacy Policy on this page and updating the "Last updated" date. 
              Your continued use of our services after any changes constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-muted p-6 rounded-lg">
              <p className="mb-2"><strong>Email:</strong> privacy@drjforrest.com</p>
              <p className="mb-2"><strong>Website:</strong> <a href="/contact" className="text-accent-950 hover:underline">Contact Form</a></p>
              <p><strong>Response Time:</strong> We aim to respond to privacy inquiries within 30 days.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}