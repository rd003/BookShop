import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import { Search } from "lucide-react";
import { useEffect, useState,type SubmitEvent } from "react";

interface Props{
    onSearch: (searchTerm:string)=>void;
    onClear: ()=>void;
    resetSignal:number;
    className?:string;
}

export default function BookFilter({
    className,
    onClear,
    onSearch,
    resetSignal
}:Props) {
  const [searchTerm, setSearchTerm] = useState('');

  function handleSubmit(e:SubmitEvent){
    e.preventDefault();
    onSearch(searchTerm);
  }

  function resetForm(){
    setSearchTerm('');
  }

  useEffect(()=>{
    resetForm();
  },[resetSignal]);

  return (
    <form className={cn("flex gap-2",className)} onSubmit={handleSubmit}>
         <div className="relative">
             <Search className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"/>
             <Input type="text" value={searchTerm} className="w-72 pl-8 border border-black" onChange={(e)=>setSearchTerm(e.target.value)}/>
         </div>

         <Button variant="default" type="submit">Search</Button>

         <Button variant="outline" type="button" onClick={()=>onClear()}>Clear</Button>
    </form>
  )
}
