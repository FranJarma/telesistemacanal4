import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import ListaBarrios from './ListaBarrios';
import ListaMunicipios from './ListaMunicipios';

const BarriosMunicipios = () => {
    return (
    <>
    <div className="container">
        <Aside/>
        <main>
        <Tabs>
            <TabList>
            <Tab><i style={{color: 'teal'}} className="bx bx-map"></i> Barrios</Tab>
            <Tab><i style={{color: 'teal'}} className='bx bx-map-alt'></i> Municipios</Tab>
            </TabList>
            <TabPanel>
            <ListaBarrios/>
            </TabPanel>
            <TabPanel>
            <ListaMunicipios/>
            </TabPanel>
        </Tabs>
    </main>
    <Footer/>
    </div>
    </>
    );
}
 
export default BarriosMunicipios;