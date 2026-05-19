import { useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

export const registerSchema = (t) => {
	return z.object({

		lastname: z
			.string()
			.min(2, t("validations:min.strings", {min: 2})),

		firstname: z
			.string()
			.min(2, t("validations:min.strings", {min: 2})),

		username: z
			.string()
			.min(3, t("validations:min.strings", {min: 3}))
			.regex(
				/^[a-z][a-z0-9_.]+$/i,
				t("validations:regex")
			),

		pin: z
			.string()
			.regex(
				/^\d{6}$/,
				t("validations:digits", {digits: 6})
			),
	});
}

export default function useRegisterForm({
	defaultValues = null,
} = {}) {

	const {t} = useTranslation()

	const schema = useMemo(() => registerSchema(t), []);

	return useForm({
		resolver: zodResolver(schema),

		defaultValues: defaultValues ?? {
			lastname: "",
			firstname: "",
			username: "",
			pin: "",
		},

		mode: "onBlur",
		// reValidateMode: "onChange",
	});
}
