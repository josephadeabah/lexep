import { Card } from "@/components/ui/Card";

export default function HelpCenterPage() {
  return (
    <div>
      <h1 className="text-headline-lg text-on-background">Help Center</h1>
      <p className="text-body-md text-on-surface-variant mt-1">
        Have a question? Reach out to the Lexep team at support@lexep.org.
      </p>
      <Card className="mt-lg">
        <p className="text-body-md text-on-surface-variant">
          FAQs and support articles will live here.
        </p>
      </Card>
    </div>
  );
}
