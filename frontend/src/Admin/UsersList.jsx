import { useEffect } from 'react'
import '../AdminStyles/UsersList.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { Delete, Edit } from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser, fetchUsers, removeErrors } from '../features/admin/adminSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'

function UsersList() {
    const { users, loading, error, deleting } = useSelector((state) => state.admin)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
        }, [error, dispatch]);

    const handleDelete = (userId) => {
        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (confirmed) {
            dispatch(deleteUser(userId))
                .unwrap()
                .then((data) => {
                    toast.success(data?.message || 'User deleted successfully', {
                        position: 'top-center',
                        autoClose: 3000,
                    })
                })
                .catch((err) => {
                    toast.error(err || 'Failed to delete user', {
                        position: 'top-center',
                        autoClose: 3000,
                    })
                })
        }
    }
  return (
    <>
    <Navbar />
    <PageTitle title="Users List - Admin Dashboard" />
    <div className='usersList-container'>
        <h1 className='usersList-title'>All Users</h1>

        {loading ? (
            <Loader />
        ) : (
            <div className='userList-table-container'>
                <table className='usersList-table'>
                    <thead>
                        <tr>
                            <th>Sr No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) && users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user?._id || index}>
                                    <td>{index + 1}</td>
                                    <td>{user?.name || '—'}</td>
                                    <td>{user?.email || '—'}</td>
                                    <td>{user?.role || '—'}</td>
                                    <td>
                                        {user?.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString()
                                            : '—'}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/admin/user/${user?._id}`}
                                            className="action-icon edit-icon"
                                        >
                                            <Edit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(user?._id)}
                                            className="action-icon delete-icon"
                                            disabled={Boolean(deleting?.[user?._id])}
                                            aria-label={
                                                deleting?.[user?._id]
                                                    ? 'Deleting user'
                                                    : 'Delete user'
                                            }
                                        >
                                            {deleting?.[user?._id] ? (
                                                <CircularProgress
                                                    size={18}
                                                    thickness={5}
                                                    color="primary"
                                                />
                                            ) : (
                                                <Delete />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="no-admin-products">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}

    </div>
    <Footer />
        </>
  )
}

export default UsersList
