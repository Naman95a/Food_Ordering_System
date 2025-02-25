import { useCart } from "../context/cartContext";

const MenuItem = ({ item }) => {
    const { addToCart } = useCart();

    return (
        <div className="menu-item">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
        </div>
    );
};

export default MenuItem;
