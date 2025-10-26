export const metadata = {
  title: 'Terms of Service | Kilalo',
  description: 'Kilalo terms of service and conditions of use.',
}

export default function TermsPage() {
  const lastUpdated = 'January 2025'

  return (
    <div className="container py-16 md:py-24 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using Kilalo's website and services, you agree to be bound by these
            Terms of Service. If you disagree with any part of these terms, you may not access
            our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Use of Services</h2>
          <p className="text-muted-foreground mb-4">
            You agree to use our services only for lawful purposes and in accordance with these Terms.
            You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Use our services in any way that violates applicable laws or regulations</li>
            <li>Impersonate or attempt to impersonate Kilalo or any other person or entity</li>
            <li>Engage in any conduct that restricts or inhibits anyone's use of our services</li>
            <li>Use our services to transmit any harmful or malicious code</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
          <p className="text-muted-foreground">
            The services and all content, features, and functionality are owned by Kilalo and are
            protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <p className="text-muted-foreground">
            In no event shall Kilalo, its directors, employees, or agents be liable for any indirect,
            incidental, special, consequential, or punitive damages arising out of or relating to your
            use of our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right to modify or replace these Terms at any time. We will provide notice
            of any material changes by posting the new Terms on this page and updating the "Last updated"
            date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms, please contact us at:{' '}
            <a href="mailto:legal@kilalo.com" className="text-teal hover:underline">
              legal@kilalo.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
