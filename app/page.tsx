import Link from 'next/link';
import { IPost } from './lib/utils';
import mysql from 'mysql2/promise';


export async function insertPost(post: IPost): Promise<number> {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password:  process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

  const [result] = await connection.query<mysql.ResultSetHeader>(
    'INSERT INTO posts_test (id, content) VALUES (?, ?)',
    [post.id, post.content]
  );
  console.log(result)//todo remove
  await connection.end();
  return result.insertId;
}

export default function Home() {
  console.log("On home page...");   

  //try {
  //  const newPost: IPost = {
  //    id:126,
  //    content: 'john@example.com',
  //  };
  //  const insertId =  insertPost(newPost);
  //  console.log(`New user inserted with ID: ${insertId}`);
  //} catch (error) {
  //  console.error('Error:', error);
  //}

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
            <li> add calendar to accounts page</li>
            <li>Add ADR and other stuff to Ticker page</li>
            <li>make ticker page accessible from sidebar, make tickers searchable to API</li>
            <li>automate api keys</li>
            <li>add more fields for the tickers, link yahoo finance site</li>
            <li>Check if API call is cached on ticker and positions pages</li>
            <li>do I add a database? or websockets? should use db so i can store internal values</li>
            <li>deployed on vercel - only push if want to deploy changes now...does the ts file work?</li>

          </ul>
        <p className="text-xl text-gray-800 md:text-2xl">
           <Link href="/accounts"
                 className=" border border-slate-300 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
           >
            Click here to view your accounts.
          </Link>     
        </p>
      </div>  
    </div>
  );
}
