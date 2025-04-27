'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '../input';

export default function Search({ placeholder }: { placeholder: string }) {
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const { replace } = useRouter();

   const handleSearch = useDebouncedCallback((term: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', '1');

      if (term) {
         params.set('query', term);
      } else {
         params.delete('query');
      }
      replace(`${pathname}?${params.toString()}`);
   }, 300);

   return (
      <Input
         placeholder={placeholder}
         defaultValue={searchParams.get('query')?.toString()}
         onChange={(event) => {
            handleSearch(event.target.value);
         }}
      />
   );
}