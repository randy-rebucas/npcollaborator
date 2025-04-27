"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { useRouter, usePathname, useSearchParams } from "next/navigation";


export default function Filter({ target, options, placeholder, defaultValue }: { target: string, options: { [key: string]: string }[], placeholder: string, defaultValue: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const filter = searchParams.get(target) || defaultValue;
    const onChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(target, value);
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">{placeholder}</Label>
            <Select onValueChange={onChange} defaultValue={filter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {options.map((option) => (
                        <SelectItem key={Object.keys(option)[0]} value={Object.keys(option)[0]}>{option[Object.keys(option)[0]]}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}