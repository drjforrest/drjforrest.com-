"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const fieldClass =
  "focus-ring w-full border-2 border-[var(--color-ink)] bg-white px-3 py-2.5 text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]";

export function ContactForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast({
        title: "Message sent",
        description: "Thank you for reaching out. I'll get back to you shortly.",
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="border-2 border-[var(--color-ink)] bg-[var(--color-chalk)] p-6 md:p-8">
      <p className="meta-label text-[var(--color-cobalt)]">Message</p>
      <h2 className="mt-3 font-display text-2xl tracking-tight text-[var(--color-ink)]">
        Send a note
      </h2>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        I do my best to respond within 48 hours.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="meta-label text-[var(--color-ink)]">
                  Name
                </FormLabel>
                <FormControl>
                  <input className={fieldClass} placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="meta-label text-[var(--color-ink)]">
                  Email
                </FormLabel>
                <FormControl>
                  <input
                    type="email"
                    className={fieldClass}
                    placeholder="jane.doe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="meta-label text-[var(--color-ink)]">
                  Message
                </FormLabel>
                <FormControl>
                  <textarea
                    className={`${fieldClass} min-h-[140px]`}
                    placeholder="What are you working on?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="focus-ring inline-flex w-full items-center justify-center bg-[var(--color-cobalt)] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-cobalt-deep)] disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              "Send message"
            )}
          </button>
        </form>
      </Form>
    </div>
  );
}
