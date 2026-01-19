import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Admin from "./pages/Admin";
import History from "./pages/History";
import Home from "./pages/Home";

export default function Router(){

    return (
        <BrowserRouter>
            <ToastContainer
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            theme="colored" />
            <Routes>
                <Route path="/" exact element={<Home />}></Route>
                <Route path="/history" element={<History />}></Route>
                <Route path="/admin" element={<Admin />}></Route>
            </Routes>
        </BrowserRouter>
    )
}