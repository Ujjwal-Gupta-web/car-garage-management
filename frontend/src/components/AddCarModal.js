import { Button, Label, Modal, TextInput, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { addCar } from '../controllers/car.controller';

function AddCarModal({ openModal, setOpenModal }) {
  const [newCar, setNewCar] = useState({
    numberplate: '', brand: '', model: '', problem: ''
  })

  const addCarHandler = async () => {
    await addCar(newCar).then((res) => {
      if (res?.error) {
        alert(res?.error || "Something went wrong")
      }
      else {
        alert(res?.message || "Done")
        window.location.reload()
      }
    }).catch(err => {
      alert("Something went wrong")
      console.log(err)
    })
    setOpenModal(false);
  }

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add New Car</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              <div className="flex max-w-md flex-col gap-4">
                <Label htmlFor="disabledInput1">Number Plate</Label>
                <TextInput type="text" id="disabledInput1"
                  onChange={(e) => setNewCar({ ...newCar, numberplate: e.target.value })}
                  placeholder="Eg: DL015342" />
                <Label htmlFor="disabledInput2">Brand</Label>
                <TextInput type="text" id="disabledInput2" placeholder="Eg: Tata"
                  onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                />
                <Label htmlFor="disabledInput2">Model</Label>
                <TextInput type="text" id="disabledInput2" placeholder="Eg: Nexon EV"
                  onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                />
                <Label htmlFor="disabledInput2">Problem</Label>
                <Textarea type="text" id="disabledInput2" placeholder="Describe the problem car is facing"
                  onChange={(e) => setNewCar({ ...newCar, problem: e.target.value })}
                />
              </div>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => addCarHandler()}>Add this car</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCarModal