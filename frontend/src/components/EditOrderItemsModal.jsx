import { useState } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';

const EditOrderItemsModal = ({ order, onClose, onSave, onRemove }) => {
  const [items, setItems] = useState(order.orderItems);
  const [loading, setLoading] = useState(false);

  const handleQtyChange = (index, value) => {
    const qty = Math.max(1, Number(value));
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index].qty = qty;
      return newItems;
    });
  };

  const incrementQty = (index) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index].qty += 1;
      return newItems;
    });
  };

  const decrementQty = (index) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index].qty = Math.max(1, newItems[index].qty - 1);
      return newItems;
    });
  };

  const handleRemove = async (index) => {
    const productId = items[index].product;
    setLoading(true);
    try {
      // Call backend removal
      if (onRemove) await onRemove(order._id, productId);
      // Update UI
      setItems((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Remove error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSave(order._id, items);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-xl mb-4">Edit Order Items</h3>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {items.map((item, idx) => (
            <div
              key={item._id}
              className="flex items-center justify-between gap-4 bg-base-200 p-3 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-500">₹ {item.price.toFixed(2)}</div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => decrementQty(idx)}
                  disabled={loading}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) => handleQtyChange(idx, e.target.value)}
                  className="input input-sm input-bordered w-16 text-center"
                  disabled={loading}
                />
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => incrementQty(idx)}
                  disabled={loading}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                className="btn btn-sm btn-error text-white"
                onClick={() => handleRemove(idx)}
                disabled={loading}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="modal-action mt-6 flex items-center gap-4">
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button
            className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Updating...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default EditOrderItemsModal;
