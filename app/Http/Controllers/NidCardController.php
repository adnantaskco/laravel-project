<?php

namespace App\Http\Controllers;

use App\Models\NidCard;
use Illuminate\Http\Request;

class NidCardController extends Controller
{
    public function index()
    {
        return NidCard::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nid_number' => 'required|string|unique:nid_cards,nid_number',
            'name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'father_name' => 'required|string|max:255',
            'mother_name' => 'required|string|max:255',
            'address' => 'required|string',
            'photo' => 'nullable|url|max:2048',
        ]);

        $nidCard = NidCard::create($validated);

        return response()->json($nidCard, 201);
    }

    public function show(NidCard $nidCard)
    {
        return response()->json($nidCard);
    }

    public function update(Request $request, NidCard $nidCard)
    {
        $validated = $request->validate([
            'nid_number' => 'required|string|unique:nid_cards,nid_number,' . $nidCard->id,
            'name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'father_name' => 'required|string|max:255',
            'mother_name' => 'required|string|max:255',
            'address' => 'required|string',
            'photo' => 'nullable|url|max:2048',
        ]);

        $nidCard->update($validated);

        return response()->json($nidCard);
    }

    public function destroy(NidCard $nidCard)
    {
        $nidCard->delete();

        return response()->json([
            'message' => 'NID card deleted successfully',
        ]);
    }
}

