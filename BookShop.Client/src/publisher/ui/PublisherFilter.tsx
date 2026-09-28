import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import { Repeat, Search } from "lucide-react";
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
    <form className={cn("flex gap-2",className)} onSubmit={(e)=>{e.preventDefault();onSubmit(searchTerm)}}>
          <Input type="text" className="w-65" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search by name"/>
          <Button type="submit" variant="default"><Search/> Search </Button>
          <Button type="button" variant="outline" onClick={handleClear}><Repeat/>Clear</Button>
    </form>
  )
}
