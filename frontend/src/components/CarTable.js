import { ListGroup, Table } from 'flowbite-react';
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-react';
import { useState } from 'react';
import AddCommentModal from './AddCommentModal';
import { Link } from 'react-router-dom';
import { updateCarStatus } from '../controllers/car.controller';
import moment from 'moment';

  const CarTable=({cars})=> {
    const [openModal,setOpenModal]=useState(false);
    const [selectedCar,setSelectedCar]=useState({});

    const convertTimeFormat=(d)=>{
      const momentObj = moment(d);
      const formattedDate = momentObj.format('DD MMM YYYY hh:mm:ss A');
      return formattedDate;
    }

    const updateCarStatusHandler=async(numberplate,status)=>{
      await updateCarStatus({numberplate,status}).then(res=>alert(res?.error?res.error:res.message)).catch(err=>console.log("Something went wrong"))
    }

    return (<>
      <AddCommentModal selectedCar={selectedCar} openModal={openModal} setOpenModal={setOpenModal}/>
      <div className="overflow-x-auto overflow-y-scroll h-[400px]">
        <Table>
          <Table.Head>
            <Table.HeadCell>Number Plate</Table.HeadCell>
            <Table.HeadCell>Brand</Table.HeadCell>
            <Table.HeadCell>Model</Table.HeadCell>
            <Table.HeadCell>Problem</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Entry Time</Table.HeadCell>
            <Table.HeadCell>Comments</Table.HeadCell>
            <Table.HeadCell>
              View
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
          {cars?.map((car)=>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {car.numberplate}
              </Table.Cell>
              <Table.Cell>{car.brand}</Table.Cell>
              <Table.Cell>{car.model}</Table.Cell>
              <Table.Cell>{car.problem}</Table.Cell>
              <Table.Cell>
                <Dropdown className='sm' label={car.status} dismissOnClick={false}>
                  <DropdownItem
                  onClick={(e)=>updateCarStatusHandler(car.numberplate,"Pending")}
                  >Pending</DropdownItem>
                  <DropdownItem
                  onClick={()=>updateCarStatusHandler(car.numberplate,"In Process")}
                  >In Process</DropdownItem>
                  <DropdownItem
                  onClick={()=>updateCarStatusHandler(car.numberplate,"Completed")}
                  >Completed</DropdownItem>
                </Dropdown>
              </Table.Cell>
              <Table.Cell>{convertTimeFormat(car.entry_time)}</Table.Cell>
              <Table.Cell><a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              onClick={()=>{ setSelectedCar(car); setOpenModal(true);}}
              >
                + Add Comments
              </a></Table.Cell>

              <Table.Cell>
                <Link to={`/${car?.numberplate}`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                  {"View Details"}
                </Link>
              </Table.Cell>
            </Table.Row>
          )}
          </Table.Body>
        </Table>
      </div>
      </>
    );
  }

export default CarTable
