import config from "@payload-config";
import { getPayload } from "payload";

import { getSession } from "@/lib/auth";
import { base64URLToHex } from "@/lib/utils";
import { ErrorView } from "./_views/ErrorView";
import { FormView } from "./_views/FormView";
import { LoginView } from "./_views/LoginView";

type Props = {
	params: Promise<{
		formId: string;
	}>;
	searchParams: Promise<{
		[key: string]: string | string[] | undefined;
	}>;
};

export default async function FormPage({ params, searchParams }: Props) {
	const { formId } = await params;
	const searchParamsData = await searchParams;
	const session = await getSession();

	const payload = await getPayload({ config });

	if (/^[A-Za-z0-9\-_]{16}$/.test(formId)) {
		const id = base64URLToHex(formId);
		const formById = await payload.find({
			collection: "form",
			where: { id: { equals: id } },
		});

		if (formById.totalDocs === 1) {
			if (formById.docs[0].settings?.require_login && !session) {
				return <LoginView formId={formId} />;
			}

			const response = await payload.find({
				collection: "response",
				where: {
					form: { equals: formById.docs[0].id },
					user: { equals: session?.user.payload_id },
				},
			});

			return (
				<FormView
					form={formById.docs[0]}
					formPath={formId}
					response={response.docs[0]}
					start={"start" in searchParamsData}
				/>
			);
		}

		if (formById.totalDocs > 1) {
			return <ErrorView errorId="multiple_forms" />;
		}
	}

	const formBySlug = await payload.find({
		collection: "form",
		where: { custom_slug: { equals: formId } },
	});

	if (formBySlug.totalDocs === 1) {
		const response = await payload.find({
			collection: "response",
			where: {
				form: { equals: formBySlug.docs[0].id },
				user: { equals: session?.user.payload_id },
			},
		});

		return (
			<FormView
				form={formBySlug.docs[0]}
				formPath={formId}
				response={response.docs[0]}
				start={"start" in searchParamsData}
			/>
		);
	}

	if (formBySlug.totalDocs > 1) {
		return <ErrorView errorId="multiple_forms" />;
	}

	return <ErrorView errorId="not_found" />;
}
