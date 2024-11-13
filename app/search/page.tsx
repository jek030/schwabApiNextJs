"use client";

import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation';
import PageHeader from '../components/PageHeader';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


const FormSchema = z.object({
  ticker: z.string().min(1, {
    message: "Ticker must be at least 1 character.",
  }),
})

export function SearchForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ticker: "",
    },
  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    router.push(`/search/${data.ticker.toUpperCase()}`);
  }
 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full border border-slate-200 max-w-md space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <FormField
          control={form.control}
          name="ticker"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Search Stock</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input 
                    placeholder="Enter ticker (e.x., NVDA)" 
                    className="flex-1"
                    {...field} 
                  />
                </FormControl>
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <SearchIcon className="h-4 w-4" />
                  Search
                </Button>
              </div>
              <FormDescription className="text-sm text-gray-500">
                Enter a stock ticker symbol to search the Schwab API.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default function Page() {
  return (
    <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <PageHeader>
        This is the search page.
      </PageHeader>

      <main className="flex flex-col gap-8 row-start-2 justify-items-center items-center sm:items-start">
        <p>
          <Link
            href=".."
            className="border border-slate-200 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
          >
            Go Back
          </Link>
        </p>
        <SearchForm />
      </main>
    </div>
  );
}