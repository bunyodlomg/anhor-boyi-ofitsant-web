import React from "react";

export default function ProductCard({ product, quantity, onAdd, onRemove, showCounter }) {
    return (
        <div className="relative p-4  border rounded-lg shadow-md flex flex-col justify-between">

            {/* Rasm ustidagi nom */}
            <div className="text-xl">
                <img
                    // src={product.image}
                    src={"https://www.nicepng.com/png/detail/255-2551087_coca-cola-clipart-cold-drink-bottle-coca-cola.png"}
                    alt={product.name}
                    className="h-40 ml-auto mr-auto object-cover mb-2 rounded"
                />
                <div className="text-center left-1 bg-opacity-50 font-bold text-black px-2 py-1 rounded">
                    {product.name}
                </div>
            </div>

            <p className="text-shadow-black mt-2 text-2xl font-bold">{product.price} so'm</p>

            {
                showCounter && (
                    <div className="mt-2 flex items-center justify-center">
                        {quantity && quantity > 0 ? (
                            <div className="flex items-center justify-center gap-3 w-24 text-2xl">
                                <button
                                    onClick={onRemove}
                                    disabled={quantity === 0}
                                    className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50 active:bg-red-700 active:scale-95 transition-all"
                                >
                                    ➖
                                </button>

                                <span className="px-2 absolute -top-2 -right-2 text-white font-bold bg-black rounded-full w-8 h-8 text-center">{quantity}</span>

                                <button
                                    onClick={onAdd}
                                    className="bg-green-500 text-white px-4 py-2 rounded active:bg-green-700 active:scale-95 transition-all"
                                >
                                    ➕
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onAdd}
                                className="bg-amber-300 text-2xl text-white px-4 py-2 rounded active:bg-blue-700 active:scale-95 transition-all"
                            >
                                ➕
                            </button>
                        )}
                    </div>
                )
            }

        </div>
    );
}
