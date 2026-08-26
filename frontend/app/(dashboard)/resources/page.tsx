import { Card } from "@/components/ui/Card";

export default function ResourcesPage() {
  return (
    <div>
      <h1 className="text-headline-lg text-on-background">Resources</h1>
      <p className="text-body-md text-on-surface-variant mt-1">
        Guides, templates, and playbooks for mentors and companies. More resources are on the way.
      </p>
      <Card className="mt-lg">
        <p className="text-body-md text-on-surface-variant">
          This section is a placeholder — plug in your CMS or a static content collection here.
        </p>
      </Card>
    </div>
  );
}
