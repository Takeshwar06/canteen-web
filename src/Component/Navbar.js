import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { useState } from 'react'

export default function Navbar() {
  const navigate = useNavigate();

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
            <Link to='/'><img src="/images/smartCanteenLogo.png" alt="😊" /></Link>
          </div>
          <div id="mainHeading" className="head">
            <h1>Smart Canteen</h1>
          </div>
        </div>

        <div className='menu-container'>

          {/* <div id="searchBlock">
                        <div id="search" className="searching">
                            <input type="text" name="search" id="searchTxt" placeholder="search your favorite dish"/>
                            <input id="searchBtn" type="submit" value="Search"/>
                        </div>
                      </div> */}

          <div id="login-link">
            <form className='d-flex' role='search'>
              {!localStorage.getItem("manager") && !localStorage.getItem("employee") && <img onClick={loginClick} id="logo" src="/image2/loginLogo.png" alt="log" srcSet="" />}
              {localStorage.getItem("employee") && <img onClick={logClick} id="logo" src="/image2/loginLogo.png" alt="sig" srcSet="" />}
              {localStorage.getItem("manager") && <img onClick={logClick} id="logo" src="/image2/loginLogo.png" alt="sig" srcSet="" />}
            </form>
          </div>
          {/* <div id="login-link">
            <form className='d-flex' role='search'>
              {!localStorage.getItem("manager") && !localStorage.getItem("employee") && <span onClick={loginClick} id="logo" >Login</span>}
              {localStorage.getItem("employee") && <span onClick={logClick} id="logo">Login</span>}
              {localStorage.getItem("manager") && <span onClick={logClick} id="logo" >Login</span>}
            </form>
          </div> */}


          <div className='menu-links' style={{ left: `${openMenu ? '0%' : '100%'}` }} >
            {/* {!localStorage.getItem("employee") &&<li><a id="active" href="index.html">orderDetail</a></li>} */}
            {!localStorage.getItem("employee") && !localStorage.getItem("manager") && <li onClick={()=>setOpenMenu(false)}><Link to="/message">OrderDetail</Link></li>}
            {!localStorage.getItem("employee") && !localStorage.getItem("manager") && <li onClick={()=>setOpenMenu(false)}><Link to="/card">Card</Link></li>}
            {!localStorage.getItem("employee") && !localStorage.getItem("manager") && <li onClick={()=>setOpenMenu(false)}><Link to="/">Home</Link></li>}

            {localStorage.getItem("employee") && <>
              <li onClick={()=>setOpenMenu(false)}><Link to="/addfood" >Addfood</Link></li>
              <li onClick={()=>setOpenMenu(false)}><Link to="/updatefood">Updatefood</Link></li>
              <li onClick={()=>setOpenMenu(false)}><Link to="/scanner">Scan</Link></li>
              <li onClick={()=>setOpenMenu(false)}><Link to="/message">Message</Link></li>
              {/* <span style={{fontSize:"10px"}} className="badge text-bg-secondary">.</span>   */}
            </>}

            {
              localStorage.getItem("manager") && <>
                <li onClick={()=>setOpenMenu(false)}><Link to="/foodreport">Foodreport</Link></li>
                <li onClick={()=>setOpenMenu(false)}><Link to="/stockissue">Stockissue</Link></li>
                <li onClick={()=>setOpenMenu(false)}><Link to="/stockentry">Stockentry</Link></li>
              </>
            }
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
