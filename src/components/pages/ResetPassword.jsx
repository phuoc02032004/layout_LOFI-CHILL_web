import React, { useState } from 'react';
import "../loginform/LoginForm.css";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/auth';
import Navbar from '../Navbar/Navbar';
import Cookies from 'js-cookie';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordNew, setPasswordNew] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            const accessToken = Cookies.get('accessToken');
            const userId = localStorage.getItem('userId');
            const response = await resetPassword(
                userId,
                password,
                passwordNew,
                accessToken,
            );

            setSuccessMessage('Đổi mật khẩu thành công!');
            setPassword('');
            setPasswordNew('');
        } catch (error) {
            console.error('Reset Password failed:', error);

            if (error.response) {
                if (error.response.status === 400) {
                    setError('Mật khẩu hiện tại không đúng!');
                } else if (error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Có lỗi xảy ra, vui lòng thử lại!');
                }
            } else {
                setError('Không thể kết nối đến server, vui lòng thử lại!');
            }
        }
    };


    return (
        <div>
            <Navbar></Navbar>
            <style>{`
                .bootstrap-container {
                    padding: 20px;
                    max-width: 500px;
                    margin: 0 auto;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                }
                .bootstrap-alert-success {
                    color: #0f5132;
                    background-color: #d1e7dd;
                    border-color: #badbcc;
                    padding: 10px;
                    border-radius: 4px;
                    margin-bottom: 10px;
                }
                .bootstrap-alert-danger {
                    color: #842029;
                    background-color: #f8d7da;
                    border-color: #f5c2c7;
                    padding: 10px;
                    border-radius: 4px;
                    margin-bottom: 10px;
                }
                .bootstrap-btn-primary {
                    background-color: #0d6efd;
                    color: white;
                    padding: 10px 15px;
                    border: none;
                    border-radius: 4px;
                    width: 100%;
                    margin-top: 10px;
                }
                .bootstrap-btn-primary:hover {
                    background-color: #0b5ed7;
                }
                .bootstrap-input-group {
                    margin-bottom: 15px;
                }
                .bootstrap-input-group input {
                    border-radius: 4px;
                    padding: 10px;
                    width: calc(100% - 40px);
                    border: 1px solid #ced4da;
                }
                .bootstrap-input-group .input-group-icon {
                    width: 40px;
                    text-align: center;
                    background-color: #e9ecef;
                    border: 1px solid #ced4da;
                    border-left: none;
                    border-radius: 0 4px 4px 0;
                }
            `}</style>
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Reset Your Password</h1>
                    {successMessage && (
                        <div className="bootstrap-alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}
                    {error && (
                        <div className="bootstrap-alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <div className="input-box">
                        <input
                            type='password'
                            placeholder='Your Password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="icon-container">
                            <FaLock className='icon' />
                        </div>
                    </div>
                    <div className="input-box">
                        <input
                            type='password'
                            placeholder='New Pass Word'
                            required
                            value={passwordNew}
                            onChange={(e) => setPasswordNew(e.target.value)}
                        />
                        <div className="icon-container">
                            <FaLock className='icon' />
                        </div>
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;