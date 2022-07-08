import { IProduct } from '../interfaces';

export type Action =
  | {
      type: 'FETCH_REQUEST';
    }
  | {
      type: 'FETCH_FAIL';
      payload: string;
    }
  | {
      type: 'FETCH_SUCCESS';
      payload: IProduct[];
    };

export type State = {
  products: IProduct[];
  isLoading: boolean;
  error: string;
};

export const productsReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, isLoading: true };
    case 'FETCH_FAIL':
      return { ...state, isLoading: false, error: action.payload };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, isLoading: false };
    default:
      return state;
  }
};
