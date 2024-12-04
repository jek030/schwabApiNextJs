import SearchForm from '@/app/components/search-form';
import PageHeader from '../components/PageHeader';

export default function SearchPage() {
  return (
    <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <PageHeader>
        This is the search page.
      </PageHeader>

      <main className="flex flex-col gap-8 row-start-2 justify-items-center items-center sm:items-start">
        <SearchForm />
      </main>
    </div>
  );
}