import SearchForm from '@/app/components/search-form';
import PageHeader from '../components/PageHeader';

export default function SearchPage() {
  return (
    <div className="flex flex-col">
      <div className="p-6">
        <PageHeader>
          This is the search page.
        </PageHeader>
      </div>

      <main className="p-6 flex flex-col gap-8 justify-items-center items-center sm:items-start">
        <SearchForm />
      </main>
    </div>
  );
}