import Image from "next/image";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/table";
import { accounts }  from '@/app/lib/accounts';
import Link from 'next/link';
import { useRouter } from 'next/navigation'

export default function Page({params} : {params: {account: string}}) {
//let accs = accounts;S
const accountNumber = params.account;
const router  = useRouter();

//const accounts = router.query;

let positions: any[] = [];
  for (let acc in accounts) {
    console.log(`Index: ${acc} Object: ${accounts[acc]}`)

    if ( accounts[acc].securitiesAccount.accountNumber = accountNumber ) {
        positions = accounts[acc].securitiesAccount.positions
        }

    }
    console.log("In [account].page: Account Number: " + accountNumber);

  return (
    <div>
      <Link className="mt-4 rounded-md bg-green-500 px-4 py-2 text-sm text-black transition-colors hover:bg-blue-400" 
            href={{pathname:  `/accounts/positions/${accountNumber}`}}>
              {'Account Number'}
      </Link>
    </div>
  );
}