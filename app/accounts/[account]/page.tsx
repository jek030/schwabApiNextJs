import Image from "next/image";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/table";
import { accounts }  from '@/app/lib/accounts';
import Breadcrumbs from '@/app/accounts/[account]/positions/breadcrumbs';

export default function Page({params} : {params: {account: string }}) {
//let accs = accounts;S
const accountNumber = params.account;



let positions: any[] = [];
  for (let acc in accounts) {
    console.log(`Index: ${acc} Object: ${accounts[acc]}`)

    if ( accounts[acc].securitiesAccount.accountNumber = accountNumber ) {
        positions = accounts[acc].securitiesAccount.positions
        }

    }
    console.log("In [account].page: Account Number: " + accountNumber);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          
          {
            label: 'Account Number',
            href: `/accounts/positions/${accountNumber}`
          },
        ]}
      />
    </main>
  );
}