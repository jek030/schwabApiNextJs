import Link from 'next/link';
import ADRCalculationCard from './lib/adr-calculation-card';
import PageHeader from './components/PageHeader';

export default function Home() {

  return (
    <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <PageHeader>
        This is the home page.
      </PageHeader>
      <div className="flex flex-col gap-8 ">  
        <strong className={` text-xl text-gray-800 md:text-2xl `}>
             Here is the TODO list:
        </strong> 
          <ul className="list-inside list-decimal text-center sm:text-left font-[family-name:var(--font-geist-mono)]">   
          <li> on the R/R card, add the % gain and loss that the PT and SL are from the entry price</li>
          <li>add stage analysis to the ticker page</li>
            <li>cache the getPositions and getTickers calls?</li>
            <li> fix all table footers, if not data in suspense then table says page 1 of 0</li>
            <li>remove NaN from ticker page id web service calls fails</li>
            <li>Add ADR and other stuff to Ticker page</li>
            <li>automate api keys</li>
            <li>deployed on vercel - only push if want to deploy changes now...does the ts file work?</li>

          </ul>
        <p className="text-xl text-gray-800 md:text-2xl">
           <Link href="/accounts"
                 className="border border-slate-300 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
           >
            Click here to view your accounts.
          </Link>     
        </p>
      </div>  
    </div>
  );
}
