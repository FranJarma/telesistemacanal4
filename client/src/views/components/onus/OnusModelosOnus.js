import React from 'react';
import { useLocation } from 'react-router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Aside from '../design/layout/Aside';
import Footer from '../design/layout/Footer';
import ListaModelosOnus from './ListaModelosOnus';
import ListaOnus from './ListaOnus';

const OnusModelosOnus = () => {
    const location = useLocation();
    return (
    <>
    <div className="container">
        <Aside/>
        <main>
        <Tabs>
            <TabList>
            <Tab><i style={{color: 'teal'}} className="bx bx-broadcast"></i> ONUS</Tab>
            <Tab><i style={{color: 'teal'}} className='bx bxs-hdd'></i> Modelos ONUS</Tab>
            </TabList>
            <TabPanel>
            <ListaOnus location={location}/>
            </TabPanel>
            <TabPanel>
            <ListaModelosOnus location={location}/>
            </TabPanel>
        </Tabs>
    </main>
    <Footer/>
    </div>
    </>
    );
}
 
export default OnusModelosOnus;