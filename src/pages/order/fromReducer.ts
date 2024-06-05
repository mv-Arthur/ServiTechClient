import Store from "../../store/store";

export type FullOrder = {
	editMode: EditMode;
	form: Form;
};

export type EditMode = {
	status: boolean;
	price: boolean;
};

export type Form = {
	price: Price;
	status: Status;
};

export type Price = {
	value: string;
};

export type Status = {
	value: string;
};

export const formReducer = (state: FullOrder, action: FormReducerType): FullOrder => {
	switch (action.type) {
		case "SET-PRICE-EDIT-MODE": {
			return { ...state, editMode: { ...state.editMode, price: action.payload.value } };
		}
		case "SET-STATUS-EDIT-MODE": {
			return { ...state, editMode: { ...state.editMode, status: action.payload.value } };
		}
		case "SET-PRICE-VALUE": {
			return {
				...state,
				form: { ...state.form, price: { ...state.form.price, value: action.payload.value } },
			};
		}
		case "SET-STATUS-VALUE": {
			return {
				...state,
				form: { ...state.form, status: { ...state.form.status, value: action.payload.value } },
			};
		}
	}
};

type FormReducerType =
	| setPriceEditModeACType
	| setStatusEditModeACType
	| setPriceValueACType
	| setStatusValueACType;

type setPriceEditModeACType = ReturnType<typeof setPriceEditModeAC>;
export const setPriceEditModeAC = (value: boolean) => {
	return { type: "SET-PRICE-EDIT-MODE" as const, payload: { value } };
};

type setStatusEditModeACType = ReturnType<typeof setStatusEditModeAC>;
export const setStatusEditModeAC = (value: boolean) => {
	return { type: "SET-STATUS-EDIT-MODE" as const, payload: { value } };
};

type setPriceValueACType = ReturnType<typeof setPriceValueAC>;
export const setPriceValueAC = (value: string) => {
	return { type: "SET-PRICE-VALUE" as const, payload: { value } };
};

type setStatusValueACType = ReturnType<typeof setStatusValueAC>;
export const setStatusValueAC = (value: string) => {
	return { type: "SET-STATUS-VALUE" as const, payload: { value } };
};
