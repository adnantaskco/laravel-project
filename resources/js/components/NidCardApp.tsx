
import { useEffect, useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'

interface NidCard {
    id?: number
    nid_number: string
    name: string
    date_of_birth: string
    father_name: string
    mother_name: string
    address: string
    photo: string
}

interface NidForm {
    nid_number: string
    name: string
    date_of_birth: string
    father_name: string
    mother_name: string
    address: string
    photo: string
}

const API_URL = 'http://localhost:8000/api/nid-cards'

const initialForm: NidForm = {
    nid_number: '',
    name: '',
    date_of_birth: '',
    father_name: '',
    mother_name: '',
    address: '',
    photo: '',
}

export default function NidCardApp() {
    const [form, setForm] = useState<NidForm>(initialForm)
    const [cards, setCards] = useState<NidCard[]>([])
    const [editId, setEditId] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // =========================
    // GET ALL CARDS
    // =========================
    const fetchCards = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await fetch(API_URL)

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to load NID cards')
            }

            setCards(data)
        } catch (error) {
            console.error(error)
            setError('Failed to load NID cards.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCards()
    }, [])

    // =========================
    // HANDLE INPUT
    // =========================
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // =========================
    // CREATE / UPDATE
    // =========================
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)
        setError('')

        const data = {
            nid_number: form.nid_number,
            name: form.name,
            date_of_birth: form.date_of_birth,
            father_name: form.father_name,
            mother_name: form.mother_name,
            address: form.address,
            photo: form.photo || null,
        }

        try {
            let response: Response

            // UPDATE
            if (editId !== null) {
                response = await fetch(`${API_URL}/${editId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(data),
                })
            }

            // CREATE
            else {
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(data),
                })
            }

            const result = await response.json()

            console.log('Laravel response:', result)

            if (!response.ok) {
                if (result.errors) {
                    const validationErrors = Object.values(result.errors)
                        .flat()
                        .join('\n')

                    setError(validationErrors)
                    alert(validationErrors)
                } else {
                    setError(result.message || 'Failed to save NID card.')
                    alert(result.message || 'Failed to save NID card.')
                }

                return
            }

            // UPDATE
            if (editId !== null) {
                setCards((prev) =>
                    prev.map((card) =>
                        card.id === editId ? result : card
                    )
                )

                setEditId(null)
            }

            // CREATE
            else {
                setCards((prev) => [...prev, result])
            }

            setForm(initialForm)

        } catch (error) {
            console.error('API Error:', error)

            setError('Could not connect to Laravel API.')
            alert('Could not connect to Laravel API.')
        } finally {
            setLoading(false)
        }
    }

    // =========================
    // EDIT
    // =========================
    const handleEdit = (card: NidCard) => {
        setForm({
            nid_number: card.nid_number,
            name: card.name,
            date_of_birth: card.date_of_birth,
            father_name: card.father_name,
            mother_name: card.mother_name,
            address: card.address,
            photo: card.photo || '',
        })

        setEditId(card.id ?? null)

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    // =========================
    // DELETE
    // =========================
    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this NID card?'
        )

        if (!confirmed) {
            return
        }

        try {
            setLoading(true)

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                },
            })

            const result = await response.json()

            if (!response.ok) {
                alert(result.message || 'Failed to delete NID card.')
                return
            }

            setCards((prev) =>
                prev.filter((card) => card.id !== id)
            )

            if (editId === id) {
                setEditId(null)
                setForm(initialForm)
            }

        } catch (error) {
            console.error(error)
            alert('Could not connect to Laravel API.')
        } finally {
            setLoading(false)
        }
    }

    // =========================
    // CANCEL EDIT
    // =========================
    const handleCancelEdit = () => {
        setEditId(null)
        setForm(initialForm)
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-6xl">

                {/* TITLE */}
                <h1 className="mb-8 text-center text-3xl font-bold">
                    NID Card CRUD
                </h1>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-300 bg-red-100 p-4 text-red-700">
                        <strong>Error:</strong>

                        <div className="mt-1 whitespace-pre-line">
                            {error}
                        </div>
                    </div>
                )}

                {/* FORM */}
                <div className="mb-8 rounded-xl bg-white p-6 shadow">

                    <h2 className="mb-5 text-xl font-bold">
                        {editId !== null
                            ? 'Update NID Card'
                            : 'Add New NID Card'}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-5 md:grid-cols-2"
                    >

                        {/* NID NUMBER */}
                        <div>
                            <label className="mb-1 block font-medium">
                                NID Number
                            </label>

                            <input
                                type="text"
                                name="nid_number"
                                value={form.nid_number}
                                onChange={handleChange}
                                placeholder="Enter NID number"
                                className="w-full rounded-lg border p-3"
                                required
                            />
                        </div>

                        {/* NAME */}
                        <div>
                            <label className="mb-1 block font-medium">
                                Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className="w-full rounded-lg border p-3"
                                required
                            />
                        </div>

                        {/* DOB */}
                        <div>
                            <label className="mb-1 block font-medium">
                                Date of Birth
                            </label>

                            <input
                                type="date"
                                name="date_of_birth"
                                value={form.date_of_birth}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                                required
                            />
                        </div>

                        {/* FATHER */}
                        <div>
                            <label className="mb-1 block font-medium">
                                Father's Name
                            </label>

                            <input
                                type="text"
                                name="father_name"
                                value={form.father_name}
                                onChange={handleChange}
                                placeholder="Enter father's name"
                                className="w-full rounded-lg border p-3"
                                required
                            />
                        </div>

                        {/* MOTHER */}
                        <div>
                            <label className="mb-1 block font-medium">
                                Mother's Name
                            </label>

                            <input
                                type="text"
                                name="mother_name"
                                value={form.mother_name}
                                onChange={handleChange}
                                placeholder="Enter mother's name"
                                className="w-full rounded-lg border p-3"
                                required
                            />
                        </div>

                        {/* PHOTO URL */}
                        <div>
                            <label className="mb-1 block font-medium">
                                Photo URL
                            </label>

                            <input
                                type="url"
                                name="photo"
                                value={form.photo}
                                onChange={handleChange}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full rounded-lg border p-3"
                            />

                            <p className="mt-1 text-xs text-gray-500">
                                Enter a direct image URL.
                            </p>
                        </div>

                        {/* ADDRESS */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block font-medium">
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                                rows={3}
                                className="w-full rounded-lg border p-3"
                                required
                            />
                        </div>

                        {/* BUTTONS */}
                        <div className="flex gap-3 md:col-span-2">

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading
                                    ? 'Processing...'
                                    : editId !== null
                                      ? 'Update NID Card'
                                      : 'Add NID Card'}
                            </button>

                            {editId !== null && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="rounded-lg bg-gray-500 px-5 py-3 font-semibold text-white hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            )}

                        </div>
                    </form>
                </div>

                {/* LOADING */}
                {loading && cards.length === 0 && (
                    <div className="mb-5 text-center text-gray-600">
                        Loading...
                    </div>
                )}

                {/* EMPTY */}
                {!loading && cards.length === 0 && (
                    <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
                        No NID cards found.
                    </div>
                )}

                {/* CARDS */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow"
                        >

                            <div className="flex gap-4">

                                {/* PHOTO */}
                                <div className="shrink-0">

                                    {card.photo ? (
                                        <img
                                            src={card.photo}
                                            alt={card.name}
                                            className="h-24 w-24 rounded-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    'none'
                                            }}
                                        />
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-500">
                                            No Photo
                                        </div>
                                    )}

                                </div>

                                {/* INFO */}
                                <div className="min-w-0">

                                    <h2 className="text-xl font-bold">
                                        {card.name}
                                    </h2>

                                    <p className="text-sm text-gray-600">
                                        NID: {card.nid_number}
                                    </p>

                                    <p className="text-sm">
                                        DOB: {card.date_of_birth}
                                    </p>

                                    <p className="text-sm">
                                        Father: {card.father_name}
                                    </p>

                                    <p className="text-sm">
                                        Mother: {card.mother_name}
                                    </p>

                                </div>
                            </div>

                            {/* ADDRESS */}
                            <div className="mt-4 border-t pt-3">
                                <p className="text-sm">
                                    <strong>Address:</strong>{' '}
                                    {card.address}
                                </p>
                            </div>

                            {/* BUTTONS */}
                            <div className="mt-4 flex gap-2">

                                <button
                                    onClick={() =>
                                        handleEdit(card)
                                    }
                                    className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(card.id!)
                                    }
                                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>

                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}
