import React from 'react';
import { BiSolidTachometer } from "react-icons/bi";
import { FaCalendarAlt, FaClock, FaPercent } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

/**
 * Resolve an image url safely.
 * - Prefer explicit item.image if it is a valid http(s) or public path.
 * - Otherwise derive a local filename from item.id or item.name.
 * - Return empty string if nothing valid.
 */
function resolveImage(item) {
  if (!item) return '';

  const raw = item.image || '';

  // 1) explicit absolute URL
  if (raw && (raw.startsWith('http://') || raw.startsWith('https://'))) {
    try {
      const u = new URL(raw);
      const host = u.hostname || '';
      // catch malformed i.ibb.co.com and fall back to local
      if (host.includes('i.ibb.co.com') || host.includes('i.ibb.co.')) {
        // fall through to derive local
      } else {
        return raw;
      }
    } catch (err) {
      // not a valid URL - continue to fallback
    }
  }

  // 2) public path (starts with /)
  if (raw && raw.startsWith('/')) return raw;

  // 3) raw seems like filename (basic.jpg)
  if (raw && !raw.includes('://')) {
    try {
      return new URL(`../../../assets/${raw}`, import.meta.url).href;
    } catch (err) {
      // continue to derive
    }
  }

  // 4) derive filename from id or name
  const id = item.id || item.planId || item._id || '';
  let fnameBase = '';
  if (id) {
    fnameBase = String(id).split('_')[0];
  } else if (item.name) {
    // use first word of name as fallback
    fnameBase = String(item.name).split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  if (fnameBase) {
    const candidate = `${fnameBase}.jpg`;
    try {
      return new URL(`../../../assets/${candidate}`, import.meta.url).href;
    } catch (err) {
      console.error('resolveImage: failed to resolve local candidate', candidate, err);
      return '';
    }
  }

  // nothing found
  console.warn('resolveImage: no image for item', item);
  return '';
}

const EachPackage = ({ item, onSelect }) => {
  if (!item) return null;

  const { name, speed, price, billingCycle, validityDays, description, discount } = item;
  const imgSrc = resolveImage(item);

  const handleImgError = (e) => {
    // if image fails, attempt a derived fallback using id/name
    try {
      const id = item.id || item.planId || item._id || '';
      const fnameBase = id ? String(id).split('_')[0] : (item.name ? String(item.name).split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') : 'basic');
      const fallback = new URL(`../../../assets/${fnameBase}.jpg`, import.meta.url).href;
      if (e?.target?.src !== fallback) e.target.src = fallback;
    } catch (err) {
      console.error('handleImgError fallback failed', err);
    }
  };

  return (
    <div>
      <div className="card w-3/4 bg-base-100 shadow-xl hover:shadow-slate-900 transition duration-300 ease-in-out">
        <figure>
          {imgSrc ? (
            <img
              className="w-80 h-52 object-cover"
              src={imgSrc}
              alt={name || 'Package'}
              onError={handleImgError}
            />
          ) : (
            <div className="w-80 h-52 bg-gray-200 flex items-center justify-center">No image</div>
          )}
        </figure>

        <div className="card-body">
          <h2 className="card-title text-2xl font-semibold">{name}</h2>
          <p className="text-lg">{description}</p>
          <p className="text-lg flex items-center gap-2"><BiSolidTachometer /> Speed: {speed} Mbps</p>
          <p className="text-lg flex items-center gap-2"><FaBangladeshiTakaSign /> Price: {price} <span className="text-2xl">৳</span></p>
          <p className="text-lg flex items-center gap-2"><FaCalendarAlt /> Billing Cycle: {billingCycle}</p>
          <p className="text-lg flex items-center gap-2"><FaClock /> Validity: {validityDays} days</p>
          <p className="text-lg flex items-center gap-2"><FaPercent /> Discount: {discount}%</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={onSelect}>Select Plan</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EachPackage;
