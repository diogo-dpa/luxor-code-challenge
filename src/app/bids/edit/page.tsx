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
import { bidConfig, bidFormSchema } from "../page.utils";
import { useSearchParams } from "next/navigation";

export default function BidEditionPage() {
  const bidId = useSearchParams().get("bidId");
  const form = useForm<z.infer<typeof bidFormSchema>>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: {
      price: 0,
    },
  });
  function onSubmit(data: z.infer<typeof bidFormSchema>) {
    toast("You submitted the following values");
    console.log(data);
  }

  if (!bidId) {
    return (
      <PageWrapper title="Error" actionText="Back" actionLink="/">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Bid ID is missing</h1>
          <p className="text-gray-600">Please provide a valid bid ID.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Bid edition" actionText="Back" actionLink="/">
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
