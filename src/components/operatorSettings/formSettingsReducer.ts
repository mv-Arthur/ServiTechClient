export type FormSettings = {
	dealPercent: string;
	fineTardiness: string;
	retentionRejection: string;
};

export const fromReducer = (state: FormSettings, action: FromSettingsReducerType) => {
	switch (action.type) {
		case "SET-DEAL-PERCENT":
			return { ...state, dealPercent: action.payload.value };
		case "SET-FINE-TARDINESS":
			return { ...state, fineTardiness: action.payload.value };
		case "SET-RETENTION-REJECTION":
			return { ...state, retentionRejection: action.payload.value };
	}
};

type FromSettingsReducerType =
	| setDealPercentACType
	| setFineTardinessACType
	| setRetentionRejectionACType;

type setDealPercentACType = ReturnType<typeof setDealPercentAC>;
export const setDealPercentAC = (value: string) => ({
	type: "SET-DEAL-PERCENT" as const,
	payload: { value },
});

type setFineTardinessACType = ReturnType<typeof setFineTardinessAC>;
export const setFineTardinessAC = (value: string) => ({
	type: "SET-FINE-TARDINESS" as const,
	payload: { value },
});
type setRetentionRejectionACType = ReturnType<typeof setRetentionRejectionAC>;
export const setRetentionRejectionAC = (value: string) => ({
	type: "SET-RETENTION-REJECTION" as const,
	payload: { value },
});
