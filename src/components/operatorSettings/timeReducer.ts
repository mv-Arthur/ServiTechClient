export type FormTime = {
	hours: string;
	minuts: string;
	second: string;
};

export const timeRducer = (state: FormTime, action: timeReducerType) => {
	switch (action.type) {
		case "SET-HOURS":
			return { ...state, hours: action.payload.value };
		case "SET-MINUTS":
			return { ...state, minuts: action.payload.value };
		case "SET-SECONDS":
			return { ...state, second: action.payload.value };
	}
};

type timeReducerType = setHoursACType | setMinutsACType | setSecondACType;

type setHoursACType = ReturnType<typeof setHoursAC>;

export const setHoursAC = (value: string) => ({ type: "SET-HOURS" as const, payload: { value } });

type setMinutsACType = ReturnType<typeof setMinutsAC>;

export const setMinutsAC = (value: string) => ({ type: "SET-MINUTS" as const, payload: { value } });

type setSecondACType = ReturnType<typeof setSecondsAC>;

export const setSecondsAC = (value: string) => ({
	type: "SET-SECONDS" as const,
	payload: { value },
});
