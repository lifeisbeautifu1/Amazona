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
      payload: IProduct;
    };

export type State = {
  product: IProduct | null;
  isLoading: boolean;
  error: string;
};

export const productReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, isLoading: true };
    case 'FETCH_FAIL':
      return { ...state, isLoading: false, error: action.payload };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, isLoading: false };
    default:
      return state;
  }
};
