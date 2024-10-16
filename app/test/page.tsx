"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function ToastSimple() {
  const { toast } = useToast();

  console.log("Toast function:", toast); // Check if toast is defined

  // Ensure your app is wrapped in a Toast Provider component
  // ... existing code ...

  return (
    <div className="mt-32">
      <Button
        variant="outline"
        onClick={() => {
          toast({
            description: "Your message has been sent.",
            duration: 3000,
          });
        }}
      >
        don't Show Toast
      </Button>
    </div>
  );
}

export default ToastSimple;
