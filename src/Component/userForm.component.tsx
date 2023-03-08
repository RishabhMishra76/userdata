import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTrash, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  age: number;
}

const API_URL = "https://blue-journalist-bbrpv.ineuron.app:4000";

const UserComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();
    setUsers(data?.data);
    console.log(data?.message);
  };

  const createUser = async () => {
    const response = await fetch(`${API_URL}/user/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, phoneNumber, age }),
    });
    const data = await response.json();
    console.log(data);
    await fetchUsers();
  };

  const handleEdit = async (selectedUserTemp: User | null) => {
    if (!selectedUserTemp) return;
    const response = await fetch(`${API_URL}/user/${selectedUserTemp._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, phoneNumber, age }),
    });
    const data = await response.json();
    console.log(data);
    handleSelectUser(null);
    await fetchUsers();
  };

  const handleSelectForEdit = async (selectedUserTemp: User) => {
    handleSelectUser(selectedUserTemp);
  };

  console.log(selectedUser);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^(|[1-9][0-9]?$|^200$)$/;
    if (regex.test(e.target.value)) {
      setAge(e.target.value);
    }
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    const regex = /^(|\+[0-9]{1,11}$|^[0-9]{1,13})$/;
    if (regex.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleNameChange = (
    name: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    const regex = /^[a-zA-Z]{0,20}$/;
    if (regex.test(value)) {
      name === "first" ? setFirstName(value) : setLastName(value);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API_URL}/user/${id}`, {
      method: "DELETE",
    });
    const updatedUsers = users.filter((user) => user._id !== id);
    setUsers(updatedUsers);
  };

  const handleSelectUser = (user: User | null) => {
    setSelectedUser(user);
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhoneNumber(user.phoneNumber);
      setAge(user.age.toString());
    }
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setAge("");
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (selectedUser) {
      handleEdit(selectedUser);
    } else {
      createUser();
    }
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setAge("");
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="text-3xl font-bold my-4">
        {selectedUser ? "Edit User" : "Add User"}
      </h1>
      <form>
        <div className="flex flex-row mb-4">
          <div className="flex flex-col mb-4 mr-8">
            <label className="font-bold mb-2" htmlFor="firstName">
              First Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              className="border border-gray-400 py-2 px-4 rounded"
              type="text"
              id="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => handleNameChange("first", e)}
            />
          </div>
          <div className="flex flex-col mb-4 mr-8">
            <label className="font-bold mb-2" htmlFor="lastName">
              Last Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              className="border border-gray-400 py-2 px-4 rounded"
              type="text"
              id="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => handleNameChange("second", e)}
            />
          </div>
          <div className="flex flex-col mb-4 mr-8">
            <label className="font-bold mb-2" htmlFor="phoneNumber">
              Phone Number
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              className="border border-gray-400 py-2 px-4 rounded"
              type="text"
              id="phoneNumber"
              placeholder="e.g. : +911122334455"
              value={phoneNumber}
              onChange={(e) => handlePhoneNumberChange(e)}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="font-bold mb-2" htmlFor="age">
              Age
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              className="border border-gray-400 py-2 px-4 rounded"
              type="text"
              placeholder="Age max:200"
              value={age}
              onChange={(e) => {
                handleAgeChange(e);
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
            !selectedUser &&
            (firstName === "" ||
              lastName === "" ||
              phoneNumber === "" ||
              age === "")
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
          onClick={handleSubmit}
          disabled={
            !selectedUser &&
            firstName === "" &&
            lastName === "" &&
            phoneNumber === "" &&
            age === ""
          }
        >
          <span className="pr-2">{selectedUser ? "Edit" : "Add"}</span>
          <FontAwesomeIcon icon={faUser} />
        </button>
        {selectedUser && (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={handleCancelEdit}
          >
             <span className="pr-2">Cancel</span><FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </form>
      <h1 className="text-3xl font-bold mt-8">User List</h1>
      <div className="max-h-60 overflow-y-auto border-2 border-gray-500 mb-8 scrollbar-hidden">
        <table className="border-collapse">
          <thead className="sticky top-0 bg-gray-200">
            <tr className="mr-8 ml-8">
              <th className="p-2">First Name</th>
              <th className="p-2">Last Name</th>
              <th className="p-2">Phone Number</th>
              <th className="p-2">Age</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id} className="border-b border-gray-200">
                <td className="py-2 px-4 overflow-hidden overflow-ellipsis">
                  {user.firstName}
                </td>
                <td className="py-2 px-4 overflow-hidden overflow-ellipsis">
                  {user.lastName}
                </td>
                <td className="py-2 px-4">{user.phoneNumber}</td>
                <td className="py-2 px-4">{user.age}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(user._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleSelectForEdit(user)}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserComponent;
