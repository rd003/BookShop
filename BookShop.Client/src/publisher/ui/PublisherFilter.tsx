import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props{
    onSubmit: (searchTerm:string)=>void,
    resetSignal: number,
    onClear: ()=>void,
    className:string
}

export default function PublisherFilter({onSubmit,resetSignal,onClear,className}:Props) {
    const [searchTerm, setSearchTerm] = useState("");

    function clear(){
        setSearchTerm('');
    }

    function handleClear(){
        clear();
        onClear();
    }

    useEffect(()=>{
        clear();
    },[resetSignal])

  return (
    <form className={cn("flex items-center gap-2",className)} onSubmit={(e)=>{e.preventDefault();onSubmit(searchTerm)}}>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
            <Input type="text" className="w-72 pl-8 border border-black" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search by name"/>
          </div>
          <Button type="submit" variant="default">Search</Button>
          <Button type="button" variant="outline" onClick={handleClear}><X className="size-4"/>Clear</Button>
    </form>
  )
}
