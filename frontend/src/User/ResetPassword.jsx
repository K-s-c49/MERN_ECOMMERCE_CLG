import React from 'react'
import '../UserStyles/Form.css';
import PageTitle from '../components/PageTitle';

function ResetPassword() {
    const resetPasswordSubmit = (e) => {
        e.preventDefault();
        // Implement reset password logic here
    };
  return (
<>
<PageTitle title="Reset Password"/>
<div className='container form-container'>
    <div className='form-content'>
        <form className='form' onSubmit={resetPasswordSubmit}>
            <h2>Reset Password</h2>
            <div className='input-group'>
                <input type="password" placeholder='Enter your new password' name='new password' />
            </div>
            <div className='input-group'>
                <input type="password" placeholder='Confirm your new password' name='confirm new password' />
            </div>
            <button type="submit" className='authBtn'>Reset Password</button>
        </form>
    </div>
</div>
</>
  )
}

export default ResetPassword