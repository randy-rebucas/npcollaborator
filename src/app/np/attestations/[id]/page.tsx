export default async function AttestationPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    return <div>Attestation Page {id}</div>;
}