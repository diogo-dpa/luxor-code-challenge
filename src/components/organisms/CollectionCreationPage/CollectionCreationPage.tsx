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
import { useRouter, useSearchParams } from "next/navigation";
import { Collection } from "../../../../prisma/generated/prisma";
import { useCollections } from "@/hooks/useCollections";
import {
  collectionConfig,
  collectionFormSchema,
} from "@/app/collections/page-utils";

export default function CollectionCreationPage() {
  const { createCollection } = useCollections();
  const router = useRouter();
  const userId = useSearchParams().get("userId");
  const form = useForm<z.infer<typeof collectionFormSchema>>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      stocks: 0,
      price: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof collectionFormSchema>) {
    const payload: Omit<Collection, "id" | "createdAt"> = {
      price: data.price,
      name: data.name,
      description: data.description,
      stocks: data.stocks,
      userId: userId ? parseInt(userId) : 0,
    };
    await createCollection(payload);
    toast("You submitted the following values");
    router.push("/");
  }

  return (
    <PageWrapper title="Collection creation" actionText="Back" actionLink="/">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6 px-8">
          {collectionConfig.map((config) => (
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
