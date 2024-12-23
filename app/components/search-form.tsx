"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import { Search as SearchIcon } from 'lucide-react';
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/ui/form";

const FormSchema = z.object({
  ticker: z.string().min(1, {
    message: "Ticker must be at least 1 character.",
  }),
});

interface SearchFormProps {
  className?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ className = "" }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ticker: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    router.push(`/search/${data.ticker.toUpperCase()}`);
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className={`w-full border border-slate-200 max-w-lg bg-gray-50 p-6 rounded-lg shadow-sm ${className}`}
      >
        <FormField
          control={form.control}
          name="ticker"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-2">
                <FormControl>
                  <Input 
                    placeholder="Search for a ticker (e.x., NVDA)" 
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
  );
};

export default SearchForm; 