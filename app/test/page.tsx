"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import supabaseClient from "@/utils/supabase";
import { useEffect } from "react";

function ToastSimple() {
  const { toast } = useToast();

  const inStuff = [
    "a72e9967-1905-4233-a335-6b8fd38ad683",
    "560aa23e-2639-4a3d-9980-2b41f06e49f7",
    "013fd383-fb88-4a91-bfbc-23ee5e36e4b5",
  ];

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .in("id", inStuff);
      console.log(22, data);
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
