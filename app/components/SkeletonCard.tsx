import {Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';//CardFooter
import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonCard() {
return (
    <Card>
          <CardHeader>
           <Skeleton className='w-12 h-12 rounded-full'/>
           <Skeleton className='h-6 flex-grow'/>

          </CardHeader>
          <CardContent>
          <Skeleton className='h-4 flex-grow mt-4'/>
          <Skeleton className='h-4 flex-grow mt-4'/>
          <Skeleton className='h-4 w-1/2  mt-4'/>

          </CardContent>
        </Card>
)
}