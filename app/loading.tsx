import SkeletonCard from "./ui/SkeletonCard"
export default function loading() {

    return (
        <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <header className="flex flex-col sm:items-start"> 
          <p className=" text-gray-800 md:text-2xl md:leading-normal">
             <strong>Welcome to FinanceGuy.</strong> 
          </p>
          
        </header>
        <main className="flex flex-col gap-8 sm:items-start">
     
          
          <SkeletonCard/>
        
        </main>    
      </div>
    )
}