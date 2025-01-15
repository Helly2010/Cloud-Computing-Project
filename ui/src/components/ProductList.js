import React from 'react';
import SingleProduct from './SingleProduct';
import products from '../data/products';
import './styles.css';

const ProductList = () => {
    return (
        <div className="productList" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            {products.map((prod) => (
                <SingleProduct key={prod.id} prod={prod} />
            ))}
        </div>
    );
};

export default ProductList;