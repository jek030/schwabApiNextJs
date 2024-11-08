"use client";
//import { accounts as accountsFile }  from '@/app/lib/accounts';
import Link from 'next/link';
import Search from '../ui/search';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
  ticker: z.string().min(2, {
    message: "Ticker must be at least 1 character.",
  }),
})

export function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ticker: "",
    },

  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data.ticker)
    //toast({
    //  title: "You submitted the following values:",
    //  description: (
    //    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //      <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //    </pre>
    //  ),
    //})
  }
 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="ticker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticker</FormLabel>
              <FormControl>
                <Input placeholder="NVDA" {...field} />
              </FormControl>
              <FormDescription>
                Enter a ticker to search for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    
  )
}


export  default  function Page() {
  console.log("On accounts page...");

  //let interfaceData
  
  try {
    //interfaceData = await getAccounts();
  } catch (error) {
    console.log("Web service call failed with error: " + error)
    //interfaceData = JSON.parse(accountsFile.toString());
  }

   
  return (
    
    <div className="grid grid-rows-[20px_1fr_20px] p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col gap-8 sm:items-start"> 
      <p className={`text-xl text-gray-800 md:text-2xl `}>        
           <strong>Welcome to FinanceGuy.</strong> This is the quote page. 
        </p>
    
      </header>
      <main className="flex flex-col gap-8 row-start-2 justify-items-center items-center sm:items-start">
        <p>
            <Link
            href=".."
            className="border border-slate-200 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            >
            Go Back
            </Link>
        </p>
        <Search placeholder='Search'></Search>
        
      </main>
    </div>
  );
}
