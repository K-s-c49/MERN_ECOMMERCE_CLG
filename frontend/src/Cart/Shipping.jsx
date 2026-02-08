import React, { useState, useEffect } from 'react'
import '../CartStyles/Shipping.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckoutPath from './CheckoutPath'
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingInfo } from '../features/Cart/cartSlice.js'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Country, State, City }  from 'country-state-city';

function Shipping() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { shippingInfo = {} } = useSelector(state => state.cart || {});

    const [address, setAddress] = useState(shippingInfo.address || '');
    const [city, setCity] = useState(shippingInfo.city || '');
    const [stateRegion, setStateRegion] = useState(shippingInfo.state || '');
    const [country, setCountry] = useState(shippingInfo.country || '');
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode || '');
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || '');

    useEffect(() => {
        setAddress(shippingInfo.address || '');
        setCity(shippingInfo.city || '');
        setStateRegion(shippingInfo.state || '');
        setCountry(shippingInfo.country || '');
        setPinCode(shippingInfo.pinCode || '');
        setPhoneNo(shippingInfo.phoneNo || '');
    }, [shippingInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!address || !city || !stateRegion || !country || !pinCode || !phoneNo) {
            toast.error('Please fill all shipping fields', { position: 'top-center', autoClose: 2500 });
            return;
        }
        if (String(phoneNo).replace(/\D/g, '').length < 10) {
            toast.error('Phone number must be at least 10 digits', { position: 'top-center', autoClose: 2500 });
            return;
        }
        const payload = { address, city, state: stateRegion, country, pinCode, phoneNo };
        dispatch(saveShippingInfo(payload));
        toast.success('Shipping information saved', { position: 'top-center', autoClose: 1000 });
        navigate('/order/confirm');
    }

    return (
        <>
            <PageTitle title="Shipping Information" />
            <Navbar />
            <div className='shipping-form-container'>
                <CheckoutPath activePath={0} />
                <h2 className='shipping-form-header'>Shipping Details</h2>
                <form className='shipping-form' onSubmit={submitHandler}>
                    <div className='shipping-section'>
                        <div className='shipping-form-group'>
                            <label htmlFor='address'>Address</label>
                            <input type='text' id='address' name='address' required placeholder='Enter Your Address' value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className='shipping-form-group'>
                            <label htmlFor='pinCode'>Pin Code</label>
                            <input type='text' id='pinCode' name='pinCode' required placeholder='Enter Your Pin Code' value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
                        </div>
                        <div className='shipping-form-group'>
                            <label htmlFor='phoneNo'>Phone Number</label>
                            <input type='tel' id='phoneNo' name='phoneNo' required placeholder='Enter Your Phone Number' value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                        </div>
                    </div>

                    <div className='shipping-section'>
                        <div className='shipping-form-group'>
                            <label htmlFor='country'>Country</label>
                            <select name='country' id='country' value={country} onChange={(e) => {
                                const val = e.target.value;
                                setCountry(val);
                                // reset dependent selects when country changes
                                setStateRegion('');
                                setCity('');
                            }}>
                                <option value=''>Select a country</option>
                                {Country && Country.getAllCountries().map((item) => (
                                     <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                                ))}
                            </select>
                        </div>

                        {country && <div className='shipping-form-group'>
                            <label htmlFor='state'>State</label>
                            <select name='state' id='state' value={stateRegion} onChange={(e) => setStateRegion(e.target.value)}>
                                <option value=''>Select a state</option>
                                {State && State.getStatesOfCountry(country).map((item) => (
                                             <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                                        ))}
                            </select>
                        </div>}
                                {stateRegion && <div className='shipping-form-group'>
                                    <label htmlFor='city'>City</label>
                                    <select name='city' id='city' value={city} onChange={(e) => setCity(e.target.value)}>
                                        <option value=''>Select a city</option>
                                        {City && City.getCitiesOfState(country, stateRegion).map((item) => (
                                             <option key={item.name} value={item.name}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>}
                    </div>

                    <button type='submit' className='shipping-submit-btn'>Continue</button>
                </form>
            </div>
            <Footer />
        </>
    )
}

export default Shipping
