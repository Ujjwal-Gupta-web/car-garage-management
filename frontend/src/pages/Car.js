import React, { useEffect, useState } from 'react'
import { Button, Card, Label, Textarea } from 'flowbite-react';
import { MdMoreTime } from "react-icons/md";
import { ListGroup, ListGroupItem } from 'flowbite-react';
import { Link, useParams } from 'react-router-dom';
import { addComments, getCarByNumberPlate } from '../controllers/car.controller';
import moment from 'moment';
import { MdOutlineDelete } from "react-icons/md";

const Car = () => {

    const { numberplate } = useParams();
    const [car, setCar] = useState({});
    const [newComment,setNewComment]=useState('');

    const addCommentsHandler=async()=>{
        if(newComment.length==0){ alert("no new comment found"); return;}
        const obj={
          numberplate,
          newComment
        }
        await addComments(obj).then((res)=>alert(res?.error?res.error:res.message)).catch(err=>alert("Something went wrong"))
      }

    const deleteCarHandler=async()=>{
        const val=prompt("Do you want to delete this entry?(y/n)")
        if(val && val.length>0 && (val[0]=='y' || val[0]=='Y')){
            await addComments(numberplate).then((res)=>alert(res?.error?res.error:res.message)).catch(err=>alert("Something went wrong"))
            window.location.href="/";
        }
        else alert("Car NOT deleted");
      }

    const convertTimeFormat = (d) => {
        const momentObj = moment(d);
        const formattedDate = momentObj.format('DD MMM YYYY hh:mm:ss A');
        return formattedDate;
    }

    useEffect(() => {
        getCarByNumberPlate(numberplate).then(res => setCar(res)).catch(err => console.log(err))
    }, [])

    return (
        <div className='m-5'>
             <Button color="gray" className='border border-lg-500'>
                    <Link to="/">
                    Go Back
                    </Link>
                    
                </Button>
                <br/><hr/><br/>
            <div className='float-right'>
                <Button color="rose" className='border border-rose-500'
                onClick={()=>deleteCarHandler()}
                >
                    <MdOutlineDelete className="mr-3 h-8 w-8" />
                    Delete
                </Button>
            </div>
            <Card href="#" className="max-w-sm">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {numberplate}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    {car.brand + " " + car.model}
                </p>
            </Card>
            <Card href="#" className="max-w-sm my-5">
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <div>{car.status}</div>
                    <div>{car.problem}</div>
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    <div className='flex items-center'>
                        <MdMoreTime /> <div className='ml-2'>{convertTimeFormat(car.entry_time)}</div>
                    </div>
                </p>
            </Card>

            <div className='my-5 p-3 border-t-4 border-lg-500'>
                <div className='float-right'>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        Add New Comment
                        <div className="w-[450px]">
                            <div className="mb-2 block">
                                <Label htmlFor="comment" value="Your message" />
                            </div>
                            <Textarea id="comment"
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Leave a comment..." required rows={4} />
                        </div>
                        <Button 
                        onClick={()=>addCommentsHandler()}
                        className='my-3'>Add Comment</Button>
                    </p>
                </div>
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Comments
                </h5>
                <div className="flex my-5">
                    <ListGroup className="w-100">
                        {car?.comments?.map(comment => <ListGroupItem>{comment}</ListGroupItem>)}
                    </ListGroup>
                </div>

            </div>
        </div>
    )
}

export default Car

