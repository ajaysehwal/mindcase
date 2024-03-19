import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent2,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/providers/AuthProvider";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Box } from "@radix-ui/themes";
import { Loader2 } from "lucide-react";

export default function UserDetailsForm() {
  const [open, setOpen] = React.useState<boolean>(false);
  const { user } = useAuthStore((s) => s);
  const handleOpen = () => {
    setOpen(true);
  };
  const validateUserDetails = () => {
    const userMetadata = user?.user_metadata;

    const isMissingField = !(
      userMetadata?.full_name &&
      userMetadata?.gender &&
      userMetadata?.name &&
      userMetadata?.companyId &&
      userMetadata?.dob
    );

    return !isMissingField;
  };
  useEffect(() => {
    if (!validateUserDetails()) {
      handleOpen();
    }
  }, []);

  return (
    <>
      <Dialog open={open}>
        <DialogContent2>
          <DialogHeader>
            <DialogTitle>Please fill these details</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <UserForm />
        </DialogContent2>
      </Dialog>
    </>
  );
}

const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "Full name is required.",
  }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.string().min(2, {
    message: "Please select your gender",
  }),
  companyID: z.string(),
});

const UserForm = () => {
  const supabase = createClient();
  const { user } = useAuthStore((s) => s);
  const [btnload, setBtnLoad] = useState<boolean>(false);
  const metadata = user?.user_metadata;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: metadata?.full_name || "",
      dob: metadata?.dob || null,
      gender: metadata?.gender || "",
      companyID: metadata?.companyId || "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setBtnLoad(true);
    const userDetails = {
      company_id: values.companyID,
      gender: values.gender,
      name: values.fullname,
      full_name: values.fullname,
      dob: values.dob,
    };
    try {
      await supabase.auth.updateUser({
        data: userDetails,
      });
      setBtnLoad(false);
    } catch (err) {
      setBtnLoad(false);
      throw new Error("Something went wrong,Please try again later");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
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
                          "pl-3 text-left font-normal",
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="not perfer to say">
                      Not perfer to say
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input placeholder="Enter your company ID" {...field} />
                </FormControl>
                <FormDescription>
                  Please reach out to the administrator for Company ID
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
          <Box className="flex justify-end">
            <Button type="submit">
              {btnload ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </form>
      </Form>
    </>
  );
};
