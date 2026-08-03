# SoloStack

SoloStack is an early-stage freelance business management SaaS designed for African freelancers, with a focus on Nigerian freelancers. Built on a 12-week MVP plan, the application is live at solostack.ng and is currently in active development. Tolu personally designs and builds the product's UI himself, using a visual identity that features an amber (#F59E0B) accent color with a near-black dark mode. He also explored an interlocked "S" mark as a logo concept.

The platform is planned around six modules: Client CRM, Proposal Builder, Contracts, Invoicing/Payments, Project Tracker, and an Income Dashboard. The proposal builder module is actively being built. The invoicing module, income dashboard, and payment gateway integrations (which plan to use Paystack and Flutterwave) are not yet built. The planned pricing for the Pro tier is ₦5,000/month.

From a technical perspective, Tolu rebuilt the MiniPreviewPanel component by replacing brittle Tailwind responsive classes with an isMobilePreview prop-driven conditional threaded through the component tree, ensuring more reliable behavior across different device sizes.
