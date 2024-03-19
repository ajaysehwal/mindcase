"use client";

import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { Spinner } from "@/components/Spinner";
import { Dispatch, SetStateAction, useState } from "react";
import { NewDbType } from "../page";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/providers/AuthProvider";

export enum HasAccess {
  Onlyme = "Onlyme",
  Everyone = "Everyone",
}

export const FormSchema = z.object({
  name: z.string().min(2),
  has_access: z.enum([HasAccess.Everyone, HasAccess.Onlyme]),
});

interface CreateDbProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  createNewDatabase: (values: any) => Promise<NewDbType>;
}
export function CreateDb({ setOpen, createNewDatabase }: CreateDbProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore((state) => state);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      has_access: HasAccess.Onlyme,
    },
  });

  const handleDBCreate = () => {
    setLoading(true);
    createNewDatabase({
      name: form.getValues("name"),
      has_access: form.getValues("has_access"),
      created_by: user?.id,
    })
      .then((data) => {
        if (data) {
          setOpen(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="grid">
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(handleDBCreate)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Database name</FormLabel>
                <FormControl>
                  <Input placeholder="Case 101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="has_access"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Who has access?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Onlyme">Only me</SelectItem>
                    <SelectItem value="Everyone">Everyone</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              className=""
              type="submit"
              disabled={!form.formState.isValid}
            >
              {loading ? (
                <Spinner />
              ) : (
                <div className="flex gap-1">
                  <Label>Create</Label>
                  <ArrowRight size={16} />
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
