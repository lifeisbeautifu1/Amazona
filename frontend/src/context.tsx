import { useReducer, useContext, createContext } from 'react';
import { IProduct } from './interfaces';
import React from 'react';

interface ContextProps {
  children: React.ReactNode;
}

export interface ICartProduct extends IProduct {
  quantity: number;
}

type State = {
  cart: {
    cartItems: ICartProduct[];
  };
};

type Action =
  | {
      type: 'ADD_TO_CART';
      payload: ICartProduct;
    }
  | {
      type: 'REMOVE_FROM_CART';
      payload: ICartProduct;
    };

interface IContext {
  dispatch: React.Dispatch<Action>;
  state: State;
}

const AppContext = createContext<IContext>({} as IContext);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    case 'REMOVE_FROM_CART': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }
    default:
      return state;
  }
};

export const AppContextProvider: React.FC<ContextProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    cart: {
      cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems')!)
        : [],
    },
  });
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
