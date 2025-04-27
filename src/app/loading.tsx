import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-[300px]">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">
            Loading your content...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}