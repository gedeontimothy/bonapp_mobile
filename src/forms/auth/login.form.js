import { useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

export const loginSchema = (t) => {
	return z.object({
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

export default function useLoginForm({
	defaultValues = null,
} = {}) {

	const {t} = useTranslation()

	const schema = useMemo(() => loginSchema(t), []);

	return useForm({
		resolver: zodResolver(schema),

		defaultValues: defaultValues ?? {
			username: "",
			pin: "",
		},

		mode: "onBlur",
		// reValidateMode: "onChange",
	});
}
