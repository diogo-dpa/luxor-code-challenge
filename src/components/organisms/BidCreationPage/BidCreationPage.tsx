"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";
import { useBids } from "@/hooks/useBids";
import { useRouter, useSearchParams } from "next/navigation";
import { Bid } from "../../../../prisma/generated/prisma";
import { useUserContext } from "@/contexts/userContext";
import { bidConfig, bidFormSchema } from "@/app/bids/page.utils";

export default function BidCreationPage() {
  const { createBid } = useBids();
  const { userId } = useUserContext();
  const router = useRouter();
  const collectionId = useSearchParams().get("collectionId");
  const form = useForm<z.infer<typeof bidFormSchema>>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: {
      price: 0,
    },
  });
  async function onSubmit(data: z.infer<typeof bidFormSchema>) {
    const payload: Omit<Bid, "id"> = {
      price: data.price,
      collectionId: collectionId ? parseInt(collectionId) : 0,
      userId: userId ? parseInt(userId) : 0,
      status: "PENDING",
      createdAt: new Date(),
    };
    await createBid(payload);
    toast("You submitted the following values");
    router.push("/");
  }

  return (
    <PageWrapper title="Bid creation" actionText="Back" actionLink="/">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6 px-8">
          {bidConfig.map((config) => (
            <FormField
              key={config.name}
              control={form.control}
              name={config.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{config.label}</FormLabel>
                  <FormControl>
                    <Input placeholder={config.placeholder} {...field} />
                  </FormControl>
                  {config.description && (
                    <FormDescription>{config.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </PageWrapper>
  );
}
