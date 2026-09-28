
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import CreateNidCard from './pages/CreateNidCard'
import NidCards from './pages/NidCards'

import '../css/app.css'

const app = document.getElementById('app')

if (app) {
    createRoot(app).render(
        <StrictMode>
            <BrowserRouter>
                <nav className="border-b bg-white shadow">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <Link
                            to="/"
                            className="text-xl font-bold"
                        >
                            NID Card App
                        </Link>

                        <div className="flex gap-3">
                            <Link
                                to="/create"
                                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                            >
                                Create NID
                            </Link>

                            <Link
                                to="/cards"
                                className="rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white hover:bg-gray-800"
                            >
                                NID Cards
                            </Link>
                        </div>
                    </div>
                </nav>

                <Routes>
                    <Route
                        path="/"
                        element={
                            <div className="min-h-screen bg-gray-100 p-10 text-center">
                                <h1 className="text-3xl font-bold">
                                    Welcome to NID Card App
                                </h1>

                                <p className="mt-3 text-gray-600">
                                    Create and manage NID cards.
                                </p>
                            </div>
                        }
                    />

                    <Route
                        path="/create"
                        element={<CreateNidCard />}
                    />

                    <Route
                        path="/cards"
                        element={<NidCards />}
                    />
                </Routes>
            </BrowserRouter>
        </StrictMode>
    )
}

