const baseUrl="http://localhost:8080/cars";
// const baseUrl="cars";

export const addCar=async(obj)=>{
    const response=await fetch(`${baseUrl}`,{
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
          "Content-Type":"application/json"
        }
      })
      const res=await response.json();
      return res;
}
export const getCars=async()=>{
    const response=await fetch(`${baseUrl}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json"
        }
      })
      const res=await response.json();
      return res;
}
export const getCarByNumberPlate=async(numberplate)=>{
    const response=await fetch(`${baseUrl}/${numberplate}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json"
        }
      })
      const res=await response.json();
      return res;
}
export const updateCarStatus=async(obj)=>{
    const response=await fetch(`${baseUrl}/updateStatus/${obj.numberplate}`,{
        method:"PUT",
        body:JSON.stringify({status:obj.status}),
        headers:{
          "Content-Type":"application/json"
        }
      })
      const res=await response.json();
      return res;
}
export const addComments=async(obj)=>{
    const response=await fetch(`${baseUrl}/addComments/${obj.numberplate}`,{
        method:"PUT",
        body:JSON.stringify({newComment:obj.newComment}),
        headers:{
          "Content-Type":"application/json"
        }
      })
      const res=await response.json();
      return res;
}
export const deleteCar=async(numberplate)=>{
    const response=await fetch(`${baseUrl}/${numberplate}`,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json"
        }
      })
      const res=await response.json();
      return res;
}