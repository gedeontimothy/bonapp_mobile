import { z } from "zod";

export const registerSchema = (t) => {
	return z.object({

		lastname: z
			.string()
			.min(2, t("validations:min.strings", {attribute: t("common:labels.lastname"), min: 2})),

		firstname: z
			.string()
			.min(2, t("validations:min.strings", {attribute: t("common:labels.firstname"), min: 2})),

		username: z
			.string()
			.min(3, t("validations:min.strings", {attribute: t("common:labels.username"), min: 3}))
			.regex(
				/^[a-z][a-z0-9_.]+$/i,
				t("validations:regex", {attribute: t("common:labels.username")})
			),

		pin: z
			.string()
			.regex(
				/^\d{6}$/,
				t("validations:digits", {attribute: t("common:labels.pin"), digits: 6})
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
