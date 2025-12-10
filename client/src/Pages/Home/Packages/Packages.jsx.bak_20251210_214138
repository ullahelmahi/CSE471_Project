import React, { useEffect, useState } from 'react';
import EachPackage from './EachPackage';


const Packages = () => {

    const [packages, setPackages] = useState([])

    useEffect(() => {
        fetch('packages.json')
            .then(res => res.json())
            .then(data => setPackages(data))
            .catch(error => console.error('Error fetching packages:', error));
    }, [])

    return (
        <section>
            <h2 className='text-4xl font-semibold text-center'>Find the Best Internet Plan for Your Needs</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10'>
                {
                    packages.map(item => <EachPackage
                        key={item.id}
                        item={item}
                    ></EachPackage>)
                }
            </div>
        </section>
    );
};

export default Packages;