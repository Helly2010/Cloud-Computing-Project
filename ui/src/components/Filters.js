// Sidebar Component

import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { CartState } from '../context/CartContext';
import { useFilterBarState } from '../context/FilterBar';
import { useTheme } from '../context/ThemeContextProvider';
import { useWindowSize } from '../hooks/useWindowSize';
import Rating from './Rating'
import useCategories from "../hooks/useCategories"; // Import dynamic categories

const Filters = () => {
    const { productFilterState : {
                byStock, byFastDelivery, sort, byRating, byCategory
            }, 
            productFilterDispatch 
    } = CartState();

    const categories = useCategories(); // Fetch categories from API

    const { theme } = useTheme();

    const windowSize = useWindowSize();

    const {visible} = useFilterBarState();
    
    return (
        <div 
            className={`filters ${theme === 'light' ? 'lightFilter' : 'darkFilter'}`} 
            style={{display: windowSize.width <= 1100 && !visible && 'none'}}
        >
            <span className="title">Filter Products</span>
            <span>
                <Form.Check
                    inline
                    label='Ascending Price'
                    name='group1'
                    type='radio'
                    id={`inline-1`}
                    onChange={() => productFilterDispatch({
                        type: 'SORT_BY_PRICE',
                        payload: 'lowToHigh',
                    })}
                    checked= {sort === 'lowToHigh' ? true : false}
                />
            </span>
            <span>
                <Form.Check
                    inline
                    label='Descending Price'
                    name='group1'
                    type='radio'
                    id={`inline-2`}
                    onChange={() => productFilterDispatch({
                        type: 'SORT_BY_PRICE',
                        payload: 'highToLow',
                    })}
                    checked= {sort === 'highToLow' ? true : false}
                />
            </span>
            <span>
                <Form.Check
                    inline
                    label='Include Out of Stock'
                    name='group1'
                    type='checkbox'
                    id={`inline-3`}
                    onChange={() => productFilterDispatch({
                        type: 'FILTER_BY_STOCK',
                    })}
                    checked= {byStock}
                />
            </span>
            <span>
                <Form.Check
                    inline
                    label='Fast Delivery Only'
                    name='group1'
                    type='checkbox'
                    id={`inline-4`}
                    onChange={() => productFilterDispatch({
                        type: 'FILTER_BY_DELIVERY',
                    })}
                    checked= {byFastDelivery}
                />
            </span>
            {/*
            <span>
                <select onChange={(e) => productFilterDispatch({
                    type: 'FILTER_BY_SEARCH',
                    payload: e.target.value,
                })}>
                    <option value="">All Categories</option>
                        <option value="Furniture">
                            Furniture
                        </option>
                        <option value="Storage">
                            Storage
                        </option>
                        <option value="Office">
                            Office
                        </option>
                        <option value="Living Room">
                            Living Room
                        </option>
                </select>
            </span>
            */}
            <span>
                <select
                    value={byCategory} // Keep track of selected category
                    onChange={(e) =>
                        productFilterDispatch({
                            type: "FILTER_BY_CATEGORY",
                            payload: e.target.value,
                        })
                    }
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </span>
            
            <span>
                <label style={{ paddingRight: 10 }}>Rating: </label>
                <Rating 
                    rating={byRating} 
                    style={{ cursor: 'pointer' }} 
                    onClick={ i => productFilterDispatch({
                        type: 'FILTER_BY_RATING',
                        payload: i + 1,
                    })}
                />
            </span>
            <Button 
                variant='light' 
                onClick={() => productFilterDispatch({
                    type: 'CLEAR_FILTERS'
                })}
            >

                Clear Filters
            </Button>
        </div>
    );
}

export default Filters;

/**
 * useRef() hook creates an object with mutable variable which will not re render the component
 * it is used to access the DOM directly
 */