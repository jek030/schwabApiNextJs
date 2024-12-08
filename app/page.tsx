import Link from 'next/link';
import PageHeader from './components/PageHeader';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/app/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <PageHeader>
        This is the home page.
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 md:text-2xl">
            Here is the TODO list:
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-6">
          <ul className="list-inside list-decimal text-center sm:text-left font-[family-name:var(--font-geist-mono)]"> 
            <li>set the access token as a cookie so it can be used in the api calls instead of resetting the token every time</li>
            <li> fix price history card.</li>
            <li> update theme colors in globals.css. Looks as shad ui them page for reference, instead of hardcoding blue buttons</li>
            <li> connect supabase to the app. Use it for the account data</li>
            <li>set up refresh token rotation</li>
            <li>On the R/R card, add the % gain and loss that the PT and SL are from the entry price</li>
            <li>add revennue data and percent change from each earnings to the ticker page</li>
            <li>Add stage analysis to the ticker page</li>
            <li>Cache the getPositions and getTickers calls?</li>
            <li>Fix all table footers, if not data in suspense then table says page 1 of 0</li>
            <li>Remove NaN from ticker page id web service calls fails</li>
            <li>Add ADR and other stuff to Ticker page</li>
            <li>Automate api keys</li>
            <li>Deployed on vercel </li>
          </ul>

          <Link 
            href="/accounts"
            className="border border-slate-300 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400 self-start"
          >
            Click here to view your accounts.
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}