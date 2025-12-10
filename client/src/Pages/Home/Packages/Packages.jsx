import React, { useEffect, useState, useContext } from 'react';
import EachPackage from './EachPackage';
import API from '../../../services/api';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function loadPackages() {
      try {
        // 1) try backend
        try {
          const res = await API.get('/packages');
          const backendPackages = Array.isArray(res?.data) ? res.data : [];

          // if backend packages look valid (have at least one item with an image), use them
          const hasImages = backendPackages.length > 0 && backendPackages.some(p => !!(p.image));
          if (hasImages) {
            if (mounted) setPackages(backendPackages);
            return;
          }
          // else fall through to load local JSON
          console.warn('Backend /packages returned items without image. Falling back to /packages.json');
        } catch (e) {
          // backend failed — we'll fall back to local JSON
          console.warn('API /packages not available, falling back to local /packages.json', e?.message || e);
        }

        // 2) fallback to local packages.json served from /public
        try {
          const r = await fetch('/packages.json');
          const data = await r.json();
          if (mounted) setPackages(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Failed to load /packages.json fallback', err);
          if (mounted) setPackages([]);
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
        Swal.fire({ icon: 'error', title: 'Failed to load packages', text: err?.message || '' });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadPackages();
    return () => { mounted = false; };
  }, []);

  // Handler to be passed to EachPackage
  const selectPlan = async (item) => {
    if (!user || !user._id) {
      const res = await Swal.fire({
        title: 'You must be logged in',
        text: 'Please login or create an account to select a plan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel'
      });
      if (res.isConfirmed) {
        navigate('/login', { state: { from: { pathname: '/packages' } } });
      }
      return;
    }

    const confirmed = await Swal.fire({
      title: `Subscribe to ${item.name || 'this plan'}?`,
      html: `<p>Price: <strong>${item.price ?? 'N/A'}</strong></p><p>Speed: <strong>${item.speed ?? 'N/A'}</strong></p>`,
      showCancelButton: true,
      confirmButtonText: 'Yes, subscribe'
    });
    if (!confirmed.isConfirmed) return;

    try {
      Swal.fire({ title: 'Checking subscription...', didOpen: () => Swal.showLoading(), allowOutsideClick: false });
      const planId = item._id || item.id || item.planId;
      const checkResp = await API.get('/subscriptions/check', { params: { userId: user._id, planId } });
      Swal.close();

      if (checkResp?.data?.exists) {
        Swal.fire({ icon: 'info', title: 'Already subscribed', text: 'You already have a subscription to this plan.' });
        return;
      }

      const subscription = {
        userId: user._id,
        planId,
        planName: item.name || item.title || '',
        price: item.price || 0,
        status: 'active',
        subscriptionDate: new Date().toISOString()
      };

      Swal.fire({ title: 'Subscribing...', didOpen: () => Swal.showLoading(), allowOutsideClick: false });
      await API.post('/subscriptions', subscription);
      Swal.close();
      Swal.fire({ icon: 'success', title: 'Subscribed', text: 'Your subscription was created.' });
      navigate('/subscription');
    } catch (err) {
      Swal.close();
      console.error('Select plan error:', err);
      const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Subscription failed';
      Swal.fire({ icon: 'error', title: 'Error', text: message });
    }
  };

  if (loading) return <section className="p-8">Loading packages…</section>;
  if (!packages || packages.length === 0) return <section className="p-8">No packages found.</section>;

  return (
    <section>
      <h2 className='text-4xl font-semibold text-center'>Find the Best Internet Plan for Your Needs</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10'>
        {packages.map(item => (
          <EachPackage key={item._id || item.id} item={item} onSelect={() => selectPlan(item)} />
        ))}
      </div>
    </section>
  );
};

export default Packages;
