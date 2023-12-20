import { Button, Label, ListGroup, ListGroupItem, Modal, TextInput, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { addComments } from '../controllers/car.controller';

function AddCommentModal({ selectedCar, openModal, setOpenModal }) {
  const [newComment,setNewComment]=useState('');
  const addCommentsHandler=async()=>{
    if(newComment.length==0){ alert("no new comment found"); return;}
    const obj={
      numberplate:selectedCar.numberplate,
      newComment
    }
    await addComments(obj).then((res)=>alert(res?.error?res.error:res.message)).catch(err=>alert("Something went wrong"))
    setOpenModal(false);
  }
  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add comment to {selectedCar.numberplate}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              <div>Comments
                <div className="flex">
                  <ListGroup className="w-100">
                    {selectedCar?.comments?.map(comment => <ListGroupItem>{comment}</ListGroupItem>)}
                  </ListGroup>
                </div>
              </div>
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              <div className="max-w-md">
                <div className="mb-2 block">
                  <Label htmlFor="comment" value="Your message" />
                </div>
                <Textarea id="comment" 
                onChange={(e)=>setNewComment(e.target.value)}
                placeholder="Leave a comment..." required rows={4} />
              </div>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => addCommentsHandler()}>Add comment</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCommentModal