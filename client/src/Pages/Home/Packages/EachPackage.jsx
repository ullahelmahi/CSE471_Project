import { BiSolidTachometer } from "react-icons/bi";
import { FaCalendarAlt, FaClock, FaPercent } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const EachPackage = ({ item, onSelect }) => {
  const { user } = useContext(AuthContext);
  if (!item) return null;

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-52 object-cover"
          />
        ) : (
          <div className="h-52 flex items-center justify-center bg-gray-200">
            No image
          </div>
        )}
      </figure>

      <div className="card-body">
        <h2 className="card-title text-2xl">{item.name}</h2>
        <p>{item.description}</p>

        <p className="flex items-center gap-2">
          <BiSolidTachometer /> Speed: {item.speed} Mbps
        </p>

        <p className="flex items-center gap-2">
          <FaBangladeshiTakaSign /> Price: ৳{item.price}
        </p>

        <p className="flex items-center gap-2">
          <FaCalendarAlt /> Billing: {item.billingCycle}
        </p>

        <p className="flex items-center gap-2">
          <FaClock /> Validity: {item.validityDays} days
        </p>

        <p className="flex items-center gap-2">
          <FaPercent /> Discount: {item.discount}%
        </p>

        <div className="card-actions justify-end">
          {user?.role !== "admin" && (
            <button className="btn btn-primary" onClick={onSelect}>
              Select Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EachPackage;