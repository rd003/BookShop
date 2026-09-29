import { cn } from "cn";
import type { UpdatePublisher } from "../types/updatePublisher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface Props{
  resetSignal:number;
  onSubmit: (data:UpdatePublisher)=>void;
  onClear: ()=>void;
  editingValues:UpdatePublisher|null,
  className?:string,
  submitting:boolean
}
export default function PublisherForm({
    resetSignal,
    className,
    onClear,
    onSubmit,
    editingValues,
    submitting=false
}:Props) {
  const [id,setId] = useState(0);
  const [name,setName]= useState("");
  const [nameValidation, setNameValidation] = useState<string|null>(null);

  function clearValidation(){
    setNameValidation(null);
  }

  function resetForm(){
    setFormValues(0,"");
  }

  function setFormValues(id:number, name:string){
    setId(id);
    setName(name);
  }

  useEffect(()=>{
    resetForm();
    clearValidation();
  },[resetSignal]);

  useEffect(()=>{
    if(editingValues){
      setFormValues(editingValues.id, editingValues.name);
    }
  },[editingValues])

  function handleSubmit(e:React.SubmitEvent){
    e.preventDefault();
    if(!validateName(name)) return;

    const publisher:UpdatePublisher = {
        id,
        name
    };
    onSubmit(publisher);
  }

  function validateName(name:string):boolean{
    if(name.trim().length===0){
        setNameValidation("Name is required");
        return false;
    }
    if(name.length>100){
        setNameValidation("Name can not exceed 100 characters");
        return false;
    }
    setNameValidation("");
    return true;
  }

    return (<form onSubmit={handleSubmit} className={cn("",className)}>
        <input type="hidden" value={id}/>
        <Card>
            <CardHeader className="pb-2">
               <CardTitle className="text-lg">
                   {editingValues ? "Edit publisher" : "Add publisher"}
               </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
                <div className="">
                    <div className="flex gap-2">
                <Label htmlFor="name">Name<span className="text-destructive">*</span></Label>
                <Input
                type="text" id="name" className="w-75"
                placeholder="Name" value={name}
                aria-invalid={!!nameValidation}
                aria-describedby={nameValidation? "name-error": undefined}
                onChange={(e)=>setName(e.target.value)}/>
                </div>

                {nameValidation && <p id="name-error" role="alert" className="text-destructive">
                    {nameValidation}
                </p>}
                </div>

                <Button
                variant="default"
                type="submit"
                disabled={submitting}
                >
                    {
                        submitting ? "Saving...": editingValues?"Edit": "Add"
                    }
                    </Button>

                <Button variant="outline" type="button" disabled={submitting} onClick={onClear}
                ><X className="size-4"/>Clear</Button>
            </CardContent>
        </Card>
    </form>
  )
}