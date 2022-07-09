import { useReducer, useContext, createContext } from 'react';
import { IProduct, IUserInfo, IShippingAddress } from './interfaces';
import React from 'react';

interface ContextProps {
  children: React.ReactNode;
}

export interface ICartProduct extends IProduct {
  quantity: number;
}

type State = {
  userInfo: IUserInfo | null;
  cart: {
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    shippingAddress: IShippingAddress | null;
    cartItems: ICartProduct[];
    paymentMethod: string;
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
    }
  | {
      type: 'USER_SIGNIN';
      payload: IUserInfo;
    }
  | {
      type: 'USER_SIGNOUT';
    }
  | {
      type: 'SAVE_SHIPPING_ADDRESS';
      payload: IShippingAddress;
    }
  | {
      type: 'SAVE_PAYMENT_METHOD';
      payload: string;
    }
  | {
      type: 'CART_CLEAR';
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
    case 'CART_CLEAR': {
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [],
        },
      };
    }
    case 'USER_SIGNIN': {
      return {
        ...state,
        userInfo: action.payload,
      };
    }
    case 'USER_SIGNOUT': {
      return {
        ...state,
        userInfo: null,
        cart: {
          shippingAddress: null,
          cartItems: [],
          paymentMethod: '',
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      };
    }
    case 'SAVE_SHIPPING_ADDRESS': {
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    }
    case 'SAVE_PAYMENT_METHOD': {
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    }
    default:
      return state;
  }
};

export const AppContextProvider: React.FC<ContextProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')!)
      : null,
    cart: {
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0,
      shippingAddress: localStorage.getItem('shippingAddress')
        ? JSON.parse(localStorage.getItem('shippingAddress')!)
        : null,
      cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems')!)
        : [],
      paymentMethod: localStorage.getItem('paymentMethod')
        ? localStorage.getItem('paymentMethod')!
        : '',
    },
  });
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
