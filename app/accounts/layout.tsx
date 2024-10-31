import SideNav from '@/app/ui/sidenav';
 
export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
      </div>
      <div className="flex-grow p-6 md:overflow-auto md:p-12">{children}</div>
    </div>
  );
}