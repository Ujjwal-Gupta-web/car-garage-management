import { Button, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { IoMdSearch } from "react-icons/io";

function Search({ cars, dispCars, setDispCars }) {
  const [search,setSearch]=useState('');
  const handleSearch=()=>{
    if(search==''){
      setDispCars(cars);
    }
    else{
      setDispCars(
        cars.filter((car)=>{
          console.log(car)
          return (car?.numberplate?.toLowerCase().includes(search.toLowerCase()))
        }
      ))
    }
  }
  useEffect(()=>{
   handleSearch()
  },[search])
  return (
    <div className="max-w-100 flex">
      <TextInput id="email4" type="email" icon={IoMdSearch}
      onChange={(e)=>setSearch(e.target.value)}
        placeholder="Search by number plate" />
      <Button>Search</Button>
    </div>
  );
}

export default Search;