
import { useEffect, useState } from 'react'

interface NidCard {
    id: number
    nid_number: string
    name: string
    date_of_birth: string
    father_name: string
    mother_name: string
    address: string
    photo: string | null
}

export default function NidCards() {
    const [nidCards, setNidCards] = useState<NidCard[]>([])
    const [loading, setLoading] = useState(true)

    const [editingCard, setEditingCard] = useState<NidCard | null>(null)

    const fetchNidCards = async () => {
        try {
            const response = await fetch('/api/nid-cards')
            const data = await response.json()

            if (!response.ok) {
                throw new Error('Failed to load NID cards')
            }

            setNidCards(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNidCards()
    }, [])

    // DELETE
    const handleDelete = async (id: number) => {
        const confirmDelete = confirm(
            'Are you sure you want to delete this NID card?'
        )

        if (!confirmDelete) return

        try {
            const response = await fetch(`/api/nid-cards/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete NID card')
            }

            setNidCards((prev) =>
                prev.filter((card) => card.id !== id)
            )
        } catch (error) {
            console.error(error)
            alert('Delete failed')
        }
    }

    // UPDATE
    const handleUpdate = async () => {
        if (!editingCard) return

        try {
            const response = await fetch(
                `/api/nid-cards/${editingCard.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editingCard),
                }
            )

            if (!response.ok) {
                throw new Error('Failed to update NID card')
            }

            const updatedCard = await response.json()

            setNidCards((prev) =>
                prev.map((card) =>
                    card.id === updatedCard.id
                        ? updatedCard
                        : card
                )
            )

            setEditingCard(null)
        } catch (error) {
            console.error(error)
            alert('Update failed')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-8 text-center text-3xl font-bold">
                    NID Cards
                </h1>

                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : nidCards.length === 0 ? (
                    <div className="rounded-xl bg-white p-6 text-center shadow">
                        No NID cards found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {nidCards.map((card) => (
                            <div
                                key={card.id}
                                className="rounded-xl bg-white p-6 shadow"
                            >
                                {editingCard?.id === card.id ? (
                                    // EDIT FORM
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold">
                                            Edit NID Card
                                        </h2>

                                        <input
                                            type="text"
                                            value={editingCard.nid_number}
                                            onChange={(e) =>
                                                setEditingCard({
                                                    ...editingCard,
                                                    nid_number:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full rounded border p-2"
                                            placeholder="NID Number"
                                        />

                                        <input
                                            type="text"
                                            value={editingCard.name}
                                            onChange={(e) =>
                                                setEditingCard({
                                                    ...editingCard,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="w-full rounded border p-2"
                                            placeholder="Name"
                                        />

                                        <input
                                            type="date"
                                            value={editingCard.date_of_birth}
                                            onChange={(e) =>
                                                setEditingCard({
                                                    ...editingCard,
                                                    date_of_birth:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full rounded border p-2"
                                        />

                                        <input
                                            type="text"
                                            value={editingCard.father_name}
                                            onChange={(e) =>
                                                setEditingCard({
                                                    ...editingCard,
                                                    father_name:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full rounded border p-2"
                                            placeholder="Father Name"
                                        />

                                        <input
                                            type="text"
                                            value={editingCard.mother_name}
                                            onChange={(e) =>
                                                setEditingCard({
                                                    ...editingCard,
                                                    mother_name:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full rounded border p-2"
                                            placeholder="Mother Name"
                                        />

                                        <textarea
                                            value={editingCard.address}
                                            onChange={(e) =>
                                                setEditingCard({
                                                    ...editingCard,
                                                    address:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full rounded border p-2"
                                            placeholder="Address"
                                        />

                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleUpdate}
                                                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                            >
                                                Update
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setEditingCard(null)
                                                }
                                                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* CARD */}
                                        <div className="flex gap-5">
                                            <div>
                                                {card.photo ? (
                                                    <img
                                                        src={card.photo}
                                                        alt={card.name}
                                                        className="h-28 w-24 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-28 w-24 items-center justify-center rounded-lg bg-gray-200 text-sm">
                                                        No Photo
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <h2 className="text-xl font-bold">
                                                    {card.name}
                                                </h2>

                                                <p className="text-sm text-gray-600">
                                                    NID: {card.nid_number}
                                                </p>

                                                <p className="mt-2">
                                                    <strong>
                                                        Date of Birth:
                                                    </strong>{' '}
                                                    {card.date_of_birth}
                                                </p>

                                                <p>
                                                    <strong>Father:</strong>{' '}
                                                    {card.father_name}
                                                </p>

                                                <p>
                                                    <strong>Mother:</strong>{' '}
                                                    {card.mother_name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 border-t pt-4">
                                            <strong>Address:</strong>

                                            <p className="text-gray-700">
                                                {card.address}
                                            </p>
                                        </div>

                                        {/* BUTTONS */}
                                        <div className="mt-5 flex gap-3">
                                            <button
                                                onClick={() =>
                                                    setEditingCard(card)
                                                }
                                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(card.id)
                                                }
                                                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

