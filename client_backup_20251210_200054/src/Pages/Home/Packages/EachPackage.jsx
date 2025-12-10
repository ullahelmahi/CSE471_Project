import { BiSolidTachometer } from "react-icons/bi";
import { FaCalendarAlt, FaClock, FaPercent } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";


const EachPackage = ({ item }) => {
    const { id, name, speed, price, billingCycle, validityDays, description, features, isPromotional, discount, available, image } = item;
    return (
        <div>
            <div className="card w-3/4 bg-base-100 shadow-xl hover:shadow-slate-900 transition duration-300 ease-in-out">
                <figure><img className="w-80 h-52" src={image} alt="Package" /></figure>
                <div className="card-body">
                    <h2 className="card-title text-2xl font-semibold">{name}</h2>
                    <p className="text-lg">{description}</p>
                    <p className="text-lg flex items-center gap-2">
                        <BiSolidTachometer /> Speed: {speed} Mbps
                    </p>
                    <p className="text-lg flex items-center gap-2">
                        <FaBangladeshiTakaSign /> Price: {price} <span className="text-2xl">৳</span>
                    </p>
                    <p className="text-lg flex items-center gap-2">
                        <FaCalendarAlt /> Billing Cycle: {billingCycle}
                    </p>
                    <p className="text-lg flex items-center gap-2">
                        <FaClock /> Validity: {validityDays} days
                    </p>
                    <p className="text-lg flex items-center gap-2">
                        <FaPercent /> Discount: {discount}%
                    </p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">Select Plan</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EachPackage;