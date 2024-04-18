import React, { useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import './Navbar.css'
import { useRef } from 'react'
import { useState } from 'react'

export default function Navbar({ coin }) {
  const navigate = useNavigate();
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  // Get realtime update of what is window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [openMenu, setOpenMenu] = useState(false);


  const [credentials, setCredentials] = useState({ email: "", password: "" })

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const setEmployee = () => {
    if (credentials.email === "manager@gmail.com") {
      if (credentials.password === "manager123") {
        localStorage.setItem("manager", "manager");
        refClose.current.click();
        navigate("/")
      }
    }
    if (credentials.email === "tiger@gmail.com") {
      if (credentials.password === "t tiger") {
        // localStorage.removeItem("UserId");
        localStorage.setItem("employee", "employee");
        if (!localStorage.getItem("uniqueEmployeeId")) {
          localStorage.setItem("uniqueEmployeeId", `EmployeeId${Math.ceil(Math.random() * 1000 + (9999 - 1000))}`) // uniqe employee
        }
        refClose.current.click();
        navigate("/")
      }
    }
  }
  const loginClick = (e) => {
    e.preventDefault();
    refOpen.current.click();
  }

  const logClick = (e) => {
    const isConfirm = window.confirm("you want to logout")
    if (isConfirm) {
      localStorage.removeItem("employee");
      localStorage.removeItem("manager");
      navigate("/");
    }
  }

  const refOpen = useRef(null);
  const refClose = useRef(null);

  // whenever change screen then get width of window
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleWindowResize);
    // also need cleanup funciton
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }

  }, [])

  return (
    <>
      {/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container-fluid">
    <Link className="navbar-brand" to="/">Smart Canteen</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
     <ul className="navbar-nav me-auto mb-2 mb-lg-0">
     {!localStorage.getItem("employee") && <li className="nav-item my-1">
          <Link className="nav-link active" aria-current="page" to="/usermsg">orderDetail</Link>
    </li>}
     {localStorage.getItem("employee") &&  <>
     <li className="nav-item my-1">
          <Link className="nav-link active" aria-current="page" to="/addfood">Addfood</Link>
        </li>
        <li className="nav-item my-1">
          <Link className="nav-link active" aria-current="page" to="/updatefood">Updatefood</Link>
        </li>
         <li className="nav-item my-1">
          <Link className="nav-link active" aria-current="page" to="message">Message</Link>
        </li></>}
      </ul>
      <form className="d-flex" role="search">
        <input className="form-control me-2" type="search" placeholder="Search food" aria-label="Search"/>
      {!localStorage.getItem("employee")&&<button className='btn btn-outline-success' onClick={loginClick}>login</button>}
      {localStorage.getItem("employee")&&<button className="btn btn-outline-success" onClick={logClick} >logout</button>}
      </form>
    </div>
  </div>
</nav>  */}

      <nav id="navbar" >

        <div id="header">
          <div id="logo" className="head">
            <Link to='/'><img src="/images/smartCanteenLogo.png" alt="Smart Canteen" /></Link>
          </div>
          <div id="mainHeading" className="head">
            <h1>Smart Canteen</h1>
          </div>
        </div>

        <div className='menu-container'>

          <div className='menu-links' style={{ left: `${openMenu ? '0%' : '100%'}` }} >
            {!localStorage.getItem("employee") && !localStorage.getItem("manager") && <li onClick={()=>setOpenMenu(false)}><NavLink to="/message">Orders</NavLink></li>}
            {!localStorage.getItem("employee") && !localStorage.getItem("manager") && <li onClick={()=>setOpenMenu(false)}><NavLink to="/card">Cart</NavLink></li>}
            {!localStorage.getItem("employee") && !localStorage.getItem("manager") && <li onClick={()=>setOpenMenu(false)}><NavLink to="/orderhistory">History</NavLink></li>}

            {localStorage.getItem("employee") && <>
              <li onClick={()=>setOpenMenu(false)}><NavLink to="/addfood" >Add Food</NavLink></li>
              <li onClick={()=>setOpenMenu(false)}><NavLink to="/updatefood">Update Food</NavLink></li>
              <li onClick={()=>setOpenMenu(false)}><NavLink to="/scanner">Scan</NavLink></li>
              <li onClick={()=>setOpenMenu(false)}><NavLink to="/message">Message</NavLink></li>
            </>}

            {
              localStorage.getItem("manager") && <>
                <li onClick={()=>setOpenMenu(false)}><NavLink to="/foodreport">Reports</NavLink></li>
                <li onClick={()=>setOpenMenu(false)}><NavLink to="/stockissue">Stock Issue</NavLink></li>
                <li onClick={()=>setOpenMenu(false)}><NavLink to="/stockentry">Stock Entry</NavLink></li>
              </>
            }
          </div>

          {isAuthenticated && <div className="coin-chip" title="Your wallet">
            <i className="fa-solid fa-coins"></i>
            <span>{coin || 0}</span>
          </div>}

          <div id="login-link">
            {!localStorage.getItem("manager") && !localStorage.getItem("employee") && <>
              {isAuthenticated
                ? <div className="user-chip">
                    <img className="user-avatar" src={user.picture} alt={user.name} referrerPolicy="no-referrer" />
                    <button className="login-btn logout" onClick={() => { localStorage.removeItem("UserId"); logout({ logoutParams: { returnTo: `${window.location.origin}/message` } }) }}>Logout</button>
                  </div>
                : <button className="login-btn" onClick={() => loginWithRedirect()}>Login</button>}
              <button className="staff-link" onClick={loginClick} title="Staff login">Staff</button>
            </>}
            {localStorage.getItem("employee") && <button className="login-btn logout" onClick={logClick}>Logout</button>}
            {localStorage.getItem("manager") && <button className="login-btn logout" onClick={logClick}>Logout</button>}
          </div>

          {
            (windowWidth < 900) &&
            (
              <div className='menu-bar' >
                {
                  (!openMenu) ? (
                    <i
                      onClick={() => setOpenMenu(true)}
                      className="fa-sharp fa-solid fa-bars"></i>

                  ) : (
                    <i
                      onClick={() => setOpenMenu(false)}
                      className="fa-sharp fa-solid fa-close"></i>

                  )
                }
              </div>

            )
          }


        </div>
      </nav>



      <button ref={refOpen} type="button" className="d-none btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Employee Login</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

              <form>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">Email id</label>
                  <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} />

                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" name='password' onChange={onChange} />
                </div>
              </form>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" ref={refClose} data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={setEmployee}>Go</button>
            </div>
          </div>
        </div>
      </div>


    </>

  )
}
