import Link from 'next/link';
import { getAccountByNumber } from '@/app/lib/stores/accountStore';

export default async function Page({ params }: { params: { account: string } }) {
    const account = await getAccountByNumber(params.account);

    if (!account) {
        return <div>Account not found</div>;
    }

    return (
        <div>
            <h1>Account Details: {account.accountNumber}</h1>
            <div className="mt-4">
                <Link 
                    className="rounded-md bg-green-500 px-4 py-2 text-sm text-black transition-colors hover:bg-blue-400" 
                    href={`/accounts/${account.accountNumber}/positions`}
                >
                    View Positions
                </Link>
            </div>
        </div>
    );
}