
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

interface NidForm {
    nid_number: string
    name: string
    date_of_birth: string
    father_name: string
    mother_name: string
    address: string
    photo: string
}

const initialForm: NidForm = {
    nid_number: '',
    name: '',
    date_of_birth: '',
    father_name: '',
    mother_name: '',
    address: '',
    photo: '',
}

export default function CreateNidCard() {
    const [form, setForm] = useState<NidForm>(initialForm)
    const [loading, setLoading] = useState(false)

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        try {
            const response = await fetch('/api/nid-cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(form),
            })

            const data = await response.json()

            console.log('Laravel response:', data)

            if (!response.ok) {
                console.error(data)
                alert(
                    data.message ||
                        'Failed to create NID card'
                )
                return
            }

            alert('NID card created successfully!')

            setForm(initialForm)
        } catch (error) {
            console.error(error)
            alert('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-8 text-center text-3xl font-bold">
                    Create NID Card
                </h1>

                <div className="rounded-xl bg-white p-6 shadow">
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-5 md:grid-cols-2"
                    >
                        {/* NID Number */}
                        <div>
                            <label className="mb-1 block font-medium">
                                NID Number
                            </label>

                            <input
                                type="text"
                                name="nid_number"
                                value={form.nid_number}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                                placeholder="Enter NID number"
                                required
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="mb-1 block font-medium">
                                Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                                placeholder="Enter name"
                                required
                            />
                        </div>

                        {/* Date of Birth */}
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

                        {/* Father's Name */}
                        <div>
                            <label className="mb-1 block font-medium">
                                Father's Name
                            </label>

                            <input
                                type="text"
                                name="father_name"
                                value={form.father_name}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                                placeholder="Father's name"
                                required
                            />
                        </div>

                        {/* Mother's Name */}
                        <div>
                            <label className="mb-1 block font-medium">
                                Mother's Name
                            </label>

                            <input
                                type="text"
                                name="mother_name"
                                value={form.mother_name}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                                placeholder="Mother's name"
                                required
                            />
                        </div>

                        {/* Photo URL */}
                        <div>
                            <label className="mb-1 block font-medium">
                                Photo URL
                            </label>

                            <input
                                type="url"
                                name="photo"
                                value={form.photo}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                                placeholder="https://example.com/photo.jpg"
                            />
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="mb-1 block font-medium">
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                rows={3}
                                className="w-full rounded-lg border p-3"
                                placeholder="Enter address"
                                required
                            />
                        </div>

                        {/* Submit */}
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading
                                    ? 'Creating...'
                                    : 'Create NID Card'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

