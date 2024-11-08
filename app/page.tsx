import Link from 'next/link';

export default function Home() {
  console.log("On home page...");   

  return (
    <div className="grid grid-rows-[20px_1fr_20px]   p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className=" flex flex-col  gap-8 sm:items-start"> 
        <p className={`text-xl text-gray-800 md:text-2xl `}>
           <strong>Welcome to FinanceGuy.</strong> This is the homescreen.  
        </p>

      </header>

      <div className="flex flex-col gap-8 ">  
        <strong className={` text-xl text-gray-800 md:text-2xl `}>
             Here is the TODO list:
        </strong> 
          <ul className="list-inside list-decimal text-center sm:text-left font-[family-name:var(--font-geist-mono)]">   
            <li> if search page fails API fails display a message that it's unavailable.</li>
            <li>replace the search with a form</li>
            <li>Add database tables for positions, figure out why date is 1 day ahead when inserting...</li>
            <li>why is the accounts page taking so long to load? add skeleton and see if it loads faster..why can't sort account table?</li>
            <li> add calendar to accounts page</li>
            <li>Add ADR and other stuff to Ticker page</li>
            <li>automate api keys</li>
            <li>Check if API call is cached on ticker and positions pages</li>
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
