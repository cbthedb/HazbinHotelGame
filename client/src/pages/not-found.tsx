import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 border-2 border-destructive/50 text-center space-y-6">
        <div className="space-y-2">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="font-display text-3xl font-bold">404</h1>
          <p className="text-lg font-semibold">Page Not Found</p>
        </div>

        <p className="text-muted-foreground">
          The page you're looking for doesn't exist. It's probably lost in the depths of Hell somewhere.
        </p>

        <Link href="/">
          <Button className="w-full gap-2" data-testid="button-home">
            <Home className="w-4 h-4" />
            Return to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
}
