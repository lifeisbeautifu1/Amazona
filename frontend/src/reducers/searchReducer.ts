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
      payload: {
        products: IProduct[];
        page: number;
        pages: number;
        countProducts: number;
      };
    };

export type State = {
  products: IProduct[];
  page: number;
  pages: number;
  countProducts: number;
  isLoading: boolean;
  error: string;
};

export const searchReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, isLoading: true };
    case 'FETCH_FAIL':
      return { ...state, isLoading: false, error: action.payload };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        isLoading: false,
      };
    default:
      return state;
  }
};
