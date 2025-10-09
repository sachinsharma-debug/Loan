import React from "react";

const ExpensesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Expenses</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Manage and track your expenses here.</p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Recent Expenses</h3>
          <div className="text-sm text-gray-500">No expenses recorded yet.</div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
