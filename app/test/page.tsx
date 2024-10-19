"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import supabaseClient from "@/utils/supabase";
import { useEffect } from "react";

function ToastSimple() {
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabaseClient.from("posts").select("*");
      console.log(data);
    };

    fetchData();
  }, []);

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
        Show Toast
      </Button>
    </div>
  );
}

export default ToastSimple;
