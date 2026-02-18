import { useEffect } from 'react'
import '../AdminStyles/UpdateRole.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSingleUser, removeErrors, updateUserRole } from '../features/admin/adminSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'

function UpdateRole() {
    const {userId}= useParams();
    const { user, loading, error } = useSelector((state) => state.admin)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getSingleUser(userId));
    }, [dispatch, userId]);
    const navigate = useNavigate();

    const handlesubmit = (e) => {
        e.preventDefault();
        const role = e.target.role.value

        dispatch(updateUserRole({ userId, role }))
            .unwrap()
            .then((data) => {
                toast.success(data?.message || 'User role updated successfully!', {
                    position: 'top-center',
                    autoClose: 3000,
                })
                navigate('/admin/users')
            })
            .catch((err) => {
                toast.error(err || 'Failed to update user role', {
                    position: 'top-center',
                    autoClose: 3000,
                })
            })
    }

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
    }, [error, dispatch])
  return (
<>
<Navbar />
<PageTitle title="Update User Role - Admin Dashboard" />
<div className='page-wrapper'>
   <div className='update-user-role-container'>
    <h1>Update User Role</h1>
    {loading ? (
        <Loader />
    ) : (
    <form className='update-user-role-form' onSubmit={handlesubmit}>
        <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input type='text' id='name' name='name' value={user?.name || ''} placeholder='Enter user name' disabled readOnly />
        </div>
        <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' name='email' value={user?.email || ''} placeholder='Enter user email' disabled readOnly />
        </div>
        <div className='form-group'>
            <label htmlFor='role'>Role</label>
            <select id='role' name='role' defaultValue={user?.role || ''} required>
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
            </select>
        </div>
        <button className='btn btn-primary' disabled={!user?._id}>Update Role</button>
     </form>
    )}
    </div> 
</div>
<Footer />
</>    
)
}

export default UpdateRole
