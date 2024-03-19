"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/providers/AuthProvider";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

const accountFormSchema = z.object({
  fullname: z.string().min(2, {
    message: "Full name is required.",
  }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  companyID: z.string(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const supabase = createClient();
  const { user } = useAuthStore((s) => s);
  const metadata = user?.user_metadata;
  const [btnload, setBtnLoad] = useState<boolean>(false);

  const defaultValues: Partial<AccountFormValues> = {
    fullname: metadata?.full_name || "",
    dob: new Date(metadata?.dob) || undefined,
    companyID: metadata?.companyId || "",
  };

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  async function onSubmit(values: AccountFormValues) {
    setBtnLoad(true);
    console.log("Hello wotld")
    const userDetails = {
      company_id: values.companyID,
      name: values.fullname,
      full_name: values.fullname,
      dob: values.dob,
    };
    try {
      await supabase.auth.updateUser({
        data: userDetails,
      });
      setBtnLoad(false);
      toast({
        title: "Successfully Changed",
        variant: "default",
      });
    } catch (err) {
      setBtnLoad(false);
      throw new Error("Something went wrong,Please try again later");
    }
  }
  const isFormChange = !form.formState.isDirty;

  return (
    <Form {...form}>
            <Toaster/>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                       {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                    
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company ID</FormLabel>
              <FormControl>
                <Input placeholder="Change your company ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isFormChange} type="submit">
          {btnload ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Update Account"
          )}
        </Button>
      </form>
    </Form>
  );
}
