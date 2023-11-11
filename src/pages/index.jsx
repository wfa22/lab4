import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './Home'

export const Pages = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    )
}