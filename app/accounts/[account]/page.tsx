import Link from 'next/link';

export default function Page({params} : {params: {account: string}}) {
const accountNumber = params.account;
  return (
    <div>
      <Link className="mt-4 rounded-md bg-green-500 px-4 py-2 text-sm text-black transition-colors hover:bg-blue-400" 
            href={{pathname:  `/accounts/positions/${accountNumber}`}}>
              {'Account Number'}
      </Link>
    </div>
  );
}