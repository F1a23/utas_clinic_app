import React, { useState } from "react";
import { Button, Input, FormGroup, Label } from "reactstrap";

const MedicinesManagement = () => {
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Paracetamol", description: "Pain reliever" },
    { id: 2, name: "Ibuprofen", description: "Anti-inflammatory" },
  ]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const addMedicine = () => {
    if (!newName || !newDescription) return;
    const newMed = {
      id: Date.now(),
      name: newName,
      description: newDescription,
    };
    setMedicines([...medicines, newMed]);
    setNewName("");
    setNewDescription("");
  };

  const deleteMedicine = (id) => {
    setMedicines(medicines.filter((med) => med.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Manage Medicines</h2>

      <div className="bg-gray-100 p-4 rounded-2xl shadow mb-6">
        <FormGroup>
          <Label for="medName">Medicine Name</Label>
          <Input
            id="medName"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g., Amoxicillin"
          />
        </FormGroup>

        <FormGroup>
          <Label for="medDesc">Description</Label>
          <Input
            id="medDesc"
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Short description"
          />
        </FormGroup>

        <Button color="primary" onClick={addMedicine}>
          Add Medicine
        </Button>
      </div>

      <div className="space-y-4">
        {medicines.map((med) => (
          <div
            key={med.id}
            className="bg-white p-4 rounded-2xl shadow flex justify-between items-center"
          >
            <div>
              <strong>{med.name}</strong>
              <div className="text-sm text-gray-600">{med.description}</div>
            </div>
            <Button color="danger" onClick={() => deleteMedicine(med.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicinesManagement;
