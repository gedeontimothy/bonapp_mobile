import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "../../schemas/auth.schema";

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