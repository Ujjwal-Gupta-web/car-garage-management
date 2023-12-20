
import { Button, Tabs } from 'flowbite-react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from 'react-icons/hi';
import { MdDashboard, MdPendingActions } from 'react-icons/md';
import { TbProgress, TbProgressCheck } from "react-icons/tb";
import AddCarModal from '../components/AddCarModal';
import CarTable from '../components/CarTable';
import Search from '../components/Search';
import { useEffect, useState } from 'react';
import { getCars } from '../controllers/car.controller';

function Home() {

    const [cars, setCars] = useState([]);
    const [dispCars, setDispCars] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const getAllCars = async () => {
        await getCars().then(res => {
            console.log(res);
            if (res) {
                setCars(res);
                setDispCars(res);
            }
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        getAllCars()
    }, [])

    return (
        <div className='m-5'>
            <AddCarModal setOpenModal={setOpenModal} openModal={openModal} />
            <div className='float-right'>
                <Button onClick={() => setOpenModal(true)}>+ Add New Car</Button>
            </div>
            <Search 
            setDispCars={setDispCars}
            dispCars={dispCars}
            cars={cars}
            />
            <Tabs aria-label="Default tabs" style="underline" className="flex items-center justify-around">
                <Tabs.Item className='p-5' active title="Pending" icon={MdPendingActions}>
                    <CarTable cars={dispCars.filter(car => car.status === "Pending")} />
                </Tabs.Item>
                <Tabs.Item className='p-5' title="In Process" icon={TbProgress}>
                    <CarTable cars={dispCars.filter(car => car.status === "In Process")} />
                </Tabs.Item>
                <Tabs.Item className='p-5' title="Completed" icon={TbProgressCheck}>
                    <CarTable cars={dispCars.filter(car => car.status === "Completed")} />
                </Tabs.Item>
            </Tabs>
        </div>
    );
}


export default Home