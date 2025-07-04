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
import { useCollections } from "@/hooks/useCollections";
import { Collection } from "../../../../prisma/generated/prisma";
import { useUserContext } from "@/contexts/userContext";
import { useEffect } from "react";
import {
  collectionConfig,
  collectionFormSchema,
} from "@/app/collections/page-utils";

export default function CollectionEditPage() {
  const { updateCollection, fetchCollectionById, collection } =
    useCollections();
  const { userId } = useUserContext();
  const router = useRouter();
  const collectionId = useSearchParams().get("collectionId");

  const form = useForm<z.infer<typeof collectionFormSchema>>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      stocks: 0,
      price: 0,
    },
  });

  useEffect(() => {
    if (collection) {
      form.setValue("name", collection.name);
      form.setValue("description", collection.description);
      form.setValue("stocks", collection.stocks);
      form.setValue("price", collection.price);
    }
  }, [collection, form]);

  useEffect(() => {
    if (collectionId) {
      fetchCollectionById(collectionId);
    }
  }, [collectionId]);

  async function onSubmit(data: z.infer<typeof collectionFormSchema>) {
    if (!collectionId) {
      toast.error("Collection ID is required for updating.");
      return;
    }

    const payload: Omit<Collection, "id" | "createdAt"> = {
      price: data.price,
      name: data.name,
      description: data.description,
      stocks: data.stocks,
      userId: userId ? parseInt(userId) : 0,
    };
    await updateCollection(collectionId, payload);
    toast("You submitted the following values");
    router.push("/");
  }

  if (!collectionId) {
    return (
      <PageWrapper title="Error" actionText="Back" actionLink="/">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Collection ID is missing</h1>
          <p className="text-gray-600">Please provide a valid collection ID.</p>
        </div>
      </PageWrapper>
    );
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
