import React from 'react';
import Banner from '../Banner/Banner';
import Packages from '../Packages/Packages';
import Reviews from '../Reviews/Reviews';
import Notice from '../../Notice/Notice';



const Home = () => {
    return (
        <div>
            <Banner></Banner>

            <Packages></Packages>

            <Reviews></Reviews>

            <Notice></Notice>
        </div>
    );
};

export default Home;