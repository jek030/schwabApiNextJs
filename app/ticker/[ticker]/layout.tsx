import SideNav from '@/app/ui/sidenav';
 
export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      
      <div className="flex flex-col md:flex-row h-screen ">{children}</div>
    
  ); 
}