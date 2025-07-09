const AdminDashboard = () => {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded">Manage Products</div>
          <div className="bg-green-100 p-4 rounded">Manage Orders</div>
          <div className="bg-yellow-100 p-4 rounded">Users</div>
          <div className="bg-red-100 p-4 rounded">Reviews</div>
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;
  