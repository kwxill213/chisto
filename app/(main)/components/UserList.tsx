"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface User {
  id: number;
  name: string;
  email: string;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addUser = async () => {
    try {
      await api.post("/users", { name, email });
      fetchUsers();
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
        />
        <Button onClick={addUser}>Add User</Button>
      </div>
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="p-2 border rounded">
            <p>{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}